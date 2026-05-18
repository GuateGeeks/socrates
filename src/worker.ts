import { Worker, type Job } from 'bullmq'
import { connection } from '@/lib/queue'
import { db } from '@/lib/db'
import { embedText, chunkText } from '@/lib/embeddings'
import type { IndexingJob } from '@/lib/queue'

const CHUNK_SIZE = 512
const CHUNK_OVERLAP = 64
const RATE_LIMIT_DELAY_MS = 100

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function processIndexingJob(job: Job<IndexingJob>): Promise<void> {
  const { documentId, content, title, level, grade, area } = job.data

  console.log(`Starting indexing for document ${documentId}: "${title}"`)

  const chunks = chunkText(content, CHUNK_SIZE, CHUNK_OVERLAP)
  console.log(`Split into ${chunks.length} chunks`)

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]

    const embedding = await embedText(chunk)

    const embeddingStr = `[${embedding.join(',')}]`
    const id = crypto.randomUUID()
    const metadata = JSON.stringify({
      documentId,
      title,
      level: level ?? null,
      grade: grade ?? null,
      area: area ?? null,
      chunkIndex: i,
    })

    await db.$executeRaw`
      INSERT INTO "DocumentChunk" (id, "documentId", content, embedding, metadata, "chunkIndex", "createdAt")
      VALUES (
        ${id},
        ${documentId},
        ${chunk},
        ${embeddingStr}::vector,
        ${metadata}::jsonb,
        ${i},
        NOW()
      )
    `

    console.log(`Indexed chunk ${i + 1}/${chunks.length} for document ${documentId}`)

    if (i < chunks.length - 1) {
      await sleep(RATE_LIMIT_DELAY_MS)
    }
  }

  await db.document.update({
    where: { id: documentId },
    data: {
      indexed: true,
      chunkCount: chunks.length,
    },
  })

  console.log(`Completed indexing document ${documentId}: ${chunks.length} chunks stored`)
}

const worker = new Worker<IndexingJob>('index-document', processIndexingJob, {
  connection,
  concurrency: 1,
})

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed for document ${job.data.documentId}`)
})

worker.on('failed', (job, error) => {
  const docId = job?.data.documentId ?? 'unknown'
  console.error(`Job ${job?.id} failed for document ${docId}:`, error)
})

worker.on('error', (error) => {
  console.error('Worker error:', error)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing worker...')
  await worker.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing worker...')
  await worker.close()
  process.exit(0)
})

export { worker }
