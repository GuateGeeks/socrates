import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const conversations = await db.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { content: true, role: true, createdAt: true },
      },
      _count: { select: { messages: true } },
    },
  })

  return NextResponse.json(conversations)
}
