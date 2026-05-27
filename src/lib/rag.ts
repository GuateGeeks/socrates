import { db } from './db'
import { embedText } from './embeddings'
import { toClientEducationLevel, toDbEducationLevel } from './curriculumLevels'
import type { CnbSource, EducationLevel } from '@/types/curriculum'

interface RagResult {
  context: string
  sources: CnbSource[]
}

interface RawChunkRow {
  id: string
  content: string
  documentId: string
  metadata: unknown
  chunkIndex: number
  distance: number
  title: string
  level: string | null
  grade: string | null
  area: string | null
}

export async function retrieveContext(
  query: string,
  topK = 5,
  filter?: { level?: string; grade?: string; area?: string }
): Promise<RagResult> {
  const embedding = await embedText(query)
  const embeddingLiteral = `[${embedding.join(',')}]`

  // Parameterized filter values — null means "no filter" for that column.
  // PostgreSQL: (${level}::text IS NULL OR d.level = ${level}) allows safe optional filtering.
  const levelParam = toDbEducationLevel(filter?.level) ?? null
  const gradeParam = filter?.grade ?? null
  const areaParam = filter?.area ?? null

  const rows = await db.$queryRaw<RawChunkRow[]>`
    SELECT
      dc.id,
      dc.content,
      dc."documentId",
      dc.metadata,
      dc."chunkIndex",
      dc.embedding <-> ${embeddingLiteral}::vector AS distance,
      d.title,
      d.level,
      d.grade,
      d.area
    FROM "DocumentChunk" dc
    JOIN "Document" d ON d.id = dc."documentId"
    WHERE dc.embedding IS NOT NULL
      AND (${levelParam}::text IS NULL OR d.level::text = ${levelParam}::text)
      AND (${gradeParam}::text IS NULL OR d.grade = ${gradeParam}::text)
      AND (${areaParam}::text IS NULL OR d.area = ${areaParam}::text)
    ORDER BY dc.embedding <-> ${embeddingLiteral}::vector
    LIMIT ${topK}
  `

  const sources: CnbSource[] = rows.map((row: RawChunkRow) => {
    const rawScore = 1 - row.distance
    const relevanceScore = Math.max(0, Math.min(1, rawScore))

    return {
      documentId: row.documentId,
      chunkId: row.id,
      title: row.title,
      level: (toClientEducationLevel(row.level) ?? 'primary') as EducationLevel,
      grade: row.grade ?? undefined,
      area: row.area ?? undefined,
      excerpt: row.content.slice(0, 300),
      relevanceScore,
    }
  })

  const context = rows
    .map((row: RawChunkRow) => {
      const header = [
        `[Fuente: ${row.title}`,
        row.level ? ` | Nivel: ${row.level}` : '',
        row.grade ? ` | Grado: ${row.grade}` : '',
        row.area ? ` | Área: ${row.area}` : '',
        ']',
      ].join('')
      return `${header}\n${row.content}`
    })
    .join('\n\n---\n\n')

  return { context, sources }
}
