export const REALTIME_CLIENT_SECRET_URL = 'https://api.openai.com/v1/realtime/client_secrets'
export const REALTIME_MODEL = 'gpt-realtime'
export const REALTIME_TRANSCRIPTION_MODEL = 'gpt-4o-mini-transcribe'

export function buildRealtimeClientSecretRequestBody() {
  return {
    expires_after: {
      anchor: 'created_at',
      seconds: 600,
    },
    session: {
      type: 'realtime',
      model: REALTIME_MODEL,
      audio: {
        input: {
          transcription: {
            model: REALTIME_TRANSCRIPTION_MODEL,
          },
        },
      },
    },
  } as const
}

export function extractRealtimeEphemeralKey(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined

  const response = data as {
    value?: unknown
    client_secret?: { value?: unknown }
    session?: { client_secret?: { value?: unknown } }
  }

  if (typeof response.value === 'string') return response.value
  if (typeof response.session?.client_secret?.value === 'string') {
    return response.session.client_secret.value
  }
  if (typeof response.client_secret?.value === 'string') {
    return response.client_secret.value
  }

  return undefined
}
