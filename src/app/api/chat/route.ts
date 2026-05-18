import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { openai, MODELS } from '@/lib/openai'
import { retrieveContext } from '@/lib/rag'
import {
  getSystemPrompt,
  ACTIVITY_PROMPT,
  RUBRIC_PROMPT,
  LESSON_PLAN_PROMPT,
  QUIZ_PROMPT,
} from '@/lib/prompts'
import type { CurriculumContext } from '@/types/curriculum'

const chatBodySchema = z.object({
  message: z.string().min(1).max(4000),
  conversationId: z.string().nullish(),
  curriculumContext: z
    .object({
      educationLevel: z.enum(['initial', 'preschool', 'primary', 'middle_school', 'high_school']),
      grade: z.string(),
      area: z.string(),
    })
    .optional(),
  mode: z
    .enum(['teacher', 'student', 'activity', 'rubric', 'lesson_plan', 'quiz'])
    .optional(),
})

type ChatMode = 'teacher' | 'student' | 'activity' | 'rubric' | 'lesson_plan' | 'quiz' | undefined

/** Maps the db Role string to the two roles getSystemPrompt accepts. */
function resolveRole(dbRole: string): 'TEACHER' | 'STUDENT' {
  return dbRole.toUpperCase() === 'TEACHER' ? 'TEACHER' : 'STUDENT'
}

/** Builds the system prompt based on mode. */
function buildSystemPrompt(
  mode: ChatMode,
  dbRole: string,
  curriculumContext: CurriculumContext | undefined
): string {
  switch (mode) {
    case 'activity':
      return ACTIVITY_PROMPT
    case 'rubric':
      return RUBRIC_PROMPT
    case 'lesson_plan':
      return LESSON_PLAN_PROMPT
    case 'quiz':
      return QUIZ_PROMPT
    default: {
      const role = resolveRole(dbRole)
      // getSystemPrompt accepts { level?, grade?, area? } — map from CurriculumContext
      const ctx = curriculumContext
        ? {
            level: curriculumContext.educationLevel,
            grade: curriculumContext.grade,
            area: curriculumContext.area,
          }
        : undefined
      return getSystemPrompt(role, ctx)
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = chatBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { message, conversationId, curriculumContext, mode } = parsed.data
    const userId = session.user.id

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let conversation = conversationId
      ? await db.conversation.findFirst({
          where: { id: conversationId, userId },
          include: { messages: { orderBy: { createdAt: 'asc' } } },
        })
      : null

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          userId,
          title: message.slice(0, 80),
          messages: { create: [] },
        },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      })
    }

    const activeConversationId = conversation.id

    const userMessage = await db.message.create({
      data: {
        conversationId: activeConversationId,
        role: 'user',
        content: message,
      },
    })

    const ragFilter: { level?: string; grade?: string; area?: string } | undefined =
      curriculumContext
        ? {
            level: curriculumContext.educationLevel,
            grade: curriculumContext.grade,
            area: curriculumContext.area,
          }
        : undefined

    const { context, sources } = await retrieveContext(message, 5, ragFilter)

    const systemPrompt = buildSystemPrompt(mode as ChatMode, user.role, curriculumContext)

    const historyMessages = conversation.messages
      .slice(-10)
      .map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

    const userMessageWithContext = context
      ? `${message}\n\n---\nContexto curricular relevante (CNB Guatemala):\n${context}`
      : message

    const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: systemPrompt },
      ...historyMessages,
      { role: 'user', content: userMessageWithContext },
    ]

    const stream = await openai.chat.completions.create({
      model: MODELS.chat,
      messages: openaiMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 2048,
    })

    let assistantContent = ''

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? ''
            if (delta) {
              assistantContent += delta
              const event = `data: ${JSON.stringify({ delta, done: false })}\n\n`
              controller.enqueue(encoder.encode(event))
            }
          }

          const assistantMessage = await db.message.create({
            data: {
              conversationId: activeConversationId,
              role: 'assistant',
              content: assistantContent,
              sources: sources as unknown as object[],
            },
          })

          const finalEvent = `data: ${JSON.stringify({
            done: true,
            sources,
            conversationId: activeConversationId,
            messageId: assistantMessage.id,
          })}\n\n`
          controller.enqueue(encoder.encode(finalEvent))
        } catch {
          const errorEvent = `data: ${JSON.stringify({ error: 'Stream error', done: true })}\n\n`
          controller.enqueue(encoder.encode(errorEvent))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Conversation-Id': activeConversationId,
        'X-User-Message-Id': userMessage.id,
      },
    })
  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
