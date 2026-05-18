import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { openai, MODELS } from '@/lib/openai'

const synthesizeSchema = z.object({
  text: z.string().min(1).max(4096),
  speed: z.number().min(0.25).max(4.0).optional(),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = synthesizeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { text, speed } = parsed.data

  try {
    const response = await openai.audio.speech.create({
      model: MODELS.tts,
      voice: MODELS.ttsVoice,
      input: text,
      speed: speed ?? 1.0,
      response_format: 'mp3',
    })

    const buffer = Buffer.from(await response.arrayBuffer())

    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(buffer.length),
    })

    return new NextResponse(buffer, { headers })
  } catch (error) {
    console.error('TTS synthesis error:', error)
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 })
  }
}
