import { openai, MODELS } from './openai'

export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: MODELS.embedding,
    input: text.slice(0, 8000),
  })
  return response.data[0].embedding
}

export function chunkText(text: string, chunkSize = 512, overlap = 64): string[] {
  const paragraphs = text.split(/\n\n+/)
  const chunks: string[] = []
  let current = ''

  for (const para of paragraphs) {
    if ((current + para).length > chunkSize && current.length > 0) {
      chunks.push(current.trim())
      const words = current.split(' ')
      current = words.slice(-Math.floor(overlap / 5)).join(' ') + '\n\n' + para
    } else {
      current = current ? current + '\n\n' + para : para
    }
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks.filter((c) => c.length > 50)
}
