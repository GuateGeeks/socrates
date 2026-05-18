import { Queue } from 'bullmq'
import IORedis from 'ioredis'

export const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

export const indexingQueue = new Queue('document-indexing', { connection })

export interface IndexingJob {
  documentId: string
  content: string
  title: string
  level?: string
  grade?: string
  area?: string
}

export async function enqueueIndexing(job: IndexingJob): Promise<void> {
  await indexingQueue.add('index-document', job, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
  })
}
