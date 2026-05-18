import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { openai, MODELS } from '@/lib/openai'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart/form-data' }, { status: 400 })
  }

  const audio = formData.get('audio')

  if (!(audio instanceof File)) {
    return NextResponse.json({ error: 'Missing or invalid audio file field' }, { status: 400 })
  }

  if (audio.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'File exceeds 25MB limit' }, { status: 400 })
  }

  if (!audio.type.startsWith('audio/')) {
    return NextResponse.json({ error: 'File must be an audio type' }, { status: 400 })
  }

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: MODELS.transcription,
      language: 'es',
      response_format: 'json',
    })

    return NextResponse.json({ text: transcription.text, language: 'es' })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 })
  }
}
