import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const MODELS = {
  chat: 'gpt-4o',
  embedding: 'text-embedding-3-small',
  transcription: 'whisper-1',
  tts: 'tts-1',
  ttsVoice: 'nova',
} as const
