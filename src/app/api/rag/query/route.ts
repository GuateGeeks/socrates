import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { retrieveContext } from '@/lib/rag'

const queryBodySchema = z.object({
  query: z.string().min(1).max(2000),
  topK: z.number().int().min(1).max(20).optional().default(5),
  filter: z
    .object({
      level: z.string().optional(),
      grade: z.string().optional(),
      area: z.string().optional(),
    })
    .optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = queryBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { query, topK, filter } = parsed.data

    const { context, sources } = await retrieveContext(query, topK, filter)

    return NextResponse.json({ sources, context })
  } catch (error) {
    console.error('RAG query route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
