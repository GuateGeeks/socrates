import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { indexingQueue } from '@/lib/queue'

export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const [waiting, active, completed, failed, totalDocs, indexedDocs, pendingDocs] =
      await Promise.all([
        indexingQueue.getWaitingCount(),
        indexingQueue.getActiveCount(),
        indexingQueue.getCompletedCount(),
        indexingQueue.getFailedCount(),
        db.document.count(),
        db.document.count({ where: { indexed: true } }),
        db.document.count({ where: { indexed: false } }),
      ])

    return NextResponse.json({
      queue: {
        waiting,
        active,
        completed,
        failed,
      },
      documents: {
        total: totalDocs,
        indexed: indexedDocs,
        pending: pendingDocs,
      },
    })
  } catch (error) {
    console.error('Status fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 })
  }
}
