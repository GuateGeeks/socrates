import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { enqueueIndexing } from '@/lib/queue'
type EducationLevel = 'INITIAL' | 'PRESCHOOL' | 'PRIMARY' | 'MIDDLE_SCHOOL' | 'HIGH_SCHOOL'

const EDUCATION_LEVELS = new Set<string>([
  'INITIAL',
  'PRESCHOOL',
  'PRIMARY',
  'MIDDLE_SCHOOL',
  'HIGH_SCHOOL',
])

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart/form-data' }, { status: 400 })
  }

  const file = formData.get('file')
  const title = formData.get('title')
  const levelRaw = formData.get('level')
  const grade = formData.get('grade')
  const area = formData.get('area')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing or invalid file field' }, { status: 400 })
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ error: 'Missing or invalid title field' }, { status: 400 })
  }

  const level =
    typeof levelRaw === 'string' && EDUCATION_LEVELS.has(levelRaw)
      ? (levelRaw as EducationLevel)
      : undefined

  let content: string
  try {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer()
      const pdfData = await pdfParse(Buffer.from(arrayBuffer))
      content = pdfData.text
    } else {
      content = await file.text()
    }
  } catch (error) {
    console.error('File parsing error:', error)
    return NextResponse.json({ error: 'Failed to parse file content' }, { status: 400 })
  }

  if (!content.trim()) {
    return NextResponse.json({ error: 'File contains no extractable text' }, { status: 400 })
  }

  try {
    const document = await db.document.create({
      data: {
        title: title.trim(),
        filename: file.name,
        level: level ?? null,
        grade: typeof grade === 'string' && grade.trim() ? grade.trim() : null,
        area: typeof area === 'string' && area.trim() ? area.trim() : null,
        indexed: false,
        chunkCount: 0,
      },
    })

    await enqueueIndexing({
      documentId: document.id,
      content,
      title: document.title,
      level: document.level ?? undefined,
      grade: document.grade ?? undefined,
      area: document.area ?? undefined,
    })

    return NextResponse.json({
      success: true,
      documentId: document.id,
      message: 'Documento en cola para indexación',
    })
  } catch (error) {
    console.error('Document creation error:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

export async function GET(): Promise<NextResponse> {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const documents = await db.document.findMany({
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        title: true,
        level: true,
        grade: true,
        area: true,
        uploadedAt: true,
        indexed: true,
        chunkCount: true,
      },
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Document listing error:', error)
    return NextResponse.json({ error: 'Failed to list documents' }, { status: 500 })
  }
}
