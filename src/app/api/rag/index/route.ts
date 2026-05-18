import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { embedText } from '@/lib/embeddings'
import { randomUUID } from 'crypto'

const indexBodySchema = z.object({
  documentId: z.string().min(1),
  content: z.string().min(1),
  chunkIndex: z.number().int().min(0),
  metadata: z.record(z.unknown()).default({}),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = indexBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { documentId, content, chunkIndex, metadata } = parsed.data

    const document = await db.document.findUnique({
      where: { id: documentId },
      select: { id: true },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const embedding = await embedText(content)
    const embeddingString = `[${embedding.join(',')}]`
    const id = randomUUID()

    await db.$executeRaw`
      INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, metadata, "chunkIndex", "createdAt")
      VALUES (${id}, ${documentId}, ${content}, ${embeddingString}::vector, ${JSON.stringify(metadata)}::jsonb, ${chunkIndex}, NOW())
    `

    await db.document.update({
      where: { id: documentId },
      data: { chunkCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, chunkId: id })
  } catch (error) {
    console.error('RAG index route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
