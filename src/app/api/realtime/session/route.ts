import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  buildRealtimeClientSecretRequestBody,
  extractRealtimeEphemeralKey,
  REALTIME_CLIENT_SECRET_URL,
} from '@/lib/realtime/clientSecret'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(REALTIME_CLIENT_SECRET_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(buildRealtimeClientSecretRequestBody()),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[/api/realtime/session] OpenAI error:', response.status, JSON.stringify(data))
      return NextResponse.json(
        { error: data?.error?.message ?? 'OpenAI session creation failed' },
        { status: response.status },
      )
    }

    const ephemeralKey = extractRealtimeEphemeralKey(data)

    return NextResponse.json({
      ...data,
      client_secret: {
        ...(typeof data?.client_secret === 'object' && data.client_secret ? data.client_secret : {}),
        value: ephemeralKey,
      },
    })
  } catch (error) {
    console.error('[/api/realtime/session] Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
