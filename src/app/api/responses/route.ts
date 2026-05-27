import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { auth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    if (body.text?.format?.type === 'json_schema') {
      const response = await openai.responses.parse({ ...(body as any), stream: false })
      return NextResponse.json(response)
    } else {
      const response = await openai.responses.create({ ...(body as any), stream: false })
      return NextResponse.json(response)
    }
  } catch (err) {
    console.error('responses proxy error', err)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
