export type VoiceState =
  | 'idle'
  | 'requesting-permission'
  | 'listening'
  | 'transcribing'
  | 'retrieving'
  | 'reasoning'
  | 'speaking'
  | 'paused'
  | 'error'

export interface VoiceError {
  code: string
  message: string
}

export interface VoiceConfig {
  maxDurationMs: number
  language: string
}

export interface TranscriptionResult {
  text: string
  confidence?: number
}

export interface SynthesisOptions {
  text: string
  voice?: string
  speed?: number
}
