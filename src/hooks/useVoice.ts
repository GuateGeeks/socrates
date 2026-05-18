'use client'

import { useState, useEffect, useRef, useCallback, useReducer } from 'react'
import type { VoiceState } from '@/types/voice'

interface UseVoiceReturn {
  state: VoiceState
  transcript: string
  error: string | null
  startListening: () => Promise<void>
  stopListening: () => void
  resetState: () => void
}

type VoiceAction =
  | { type: 'REQUEST_PERMISSION' }
  | { type: 'START_LISTENING' }
  | { type: 'STOP_LISTENING' }
  | { type: 'START_TRANSCRIBING' }
  | { type: 'TRANSCRIPTION_SUCCESS'; payload: string }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' }

interface VoiceReducerState {
  state: VoiceState
  transcript: string
  error: string | null
}

const initialReducerState: VoiceReducerState = {
  state: 'idle',
  transcript: '',
  error: null,
}

function voiceReducer(
  current: VoiceReducerState,
  action: VoiceAction,
): VoiceReducerState {
  switch (action.type) {
    case 'REQUEST_PERMISSION':
      return { ...current, state: 'requesting-permission', error: null }
    case 'START_LISTENING':
      return { ...current, state: 'listening', error: null }
    case 'STOP_LISTENING':
      return { ...current, state: 'transcribing' }
    case 'START_TRANSCRIBING':
      return { ...current, state: 'transcribing' }
    case 'TRANSCRIPTION_SUCCESS':
      return {
        ...current,
        state: 'idle',
        transcript: action.payload,
        error: null,
      }
    case 'ERROR':
      return { ...current, state: 'error', error: action.payload }
    case 'RESET':
      return initialReducerState
    default:
      return current
  }
}

export function useVoice(onTranscript: (text: string) => void): UseVoiceReturn {
  const [reducerState, dispatch] = useReducer(voiceReducer, initialReducerState)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      stopMediaTracks()
    }
  }, [])

  const stopMediaTracks = useCallback(() => {
    if (mediaRecorderRef.current) {
      const recorder = mediaRecorderRef.current
      if (recorder.state !== 'inactive') {
        recorder.stop()
      }
      mediaRecorderRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  const startListening = useCallback(async () => {
    if (!isMountedRef.current) return

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      dispatch({ type: 'ERROR', payload: 'Micrófono no soportado en este navegador.' })
      return
    }

    if (typeof window.MediaRecorder === 'undefined') {
      dispatch({ type: 'ERROR', payload: 'Grabación de audio no soportada en este navegador.' })
      return
    }

    dispatch({ type: 'REQUEST_PERMISSION' })

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (err) {
      if (!isMountedRef.current) return
      const isDenied =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')
      dispatch({
        type: 'ERROR',
        payload: isDenied
          ? 'Permiso de micrófono denegado. Habilítalo en la configuración del navegador.'
          : 'No se pudo acceder al micrófono.',
      })
      return
    }

    if (!isMountedRef.current) {
      stream.getTracks().forEach((t) => t.stop())
      return
    }

    streamRef.current = stream
    chunksRef.current = []

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : ''

    const recorder = mimeType
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream)

    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    recorder.onstop = async () => {
      if (!isMountedRef.current) return

      dispatch({ type: 'START_TRANSCRIBING' })

      const audioBlob = new Blob(chunksRef.current, {
        type: recorder.mimeType || 'audio/webm',
      })
      chunksRef.current = []

      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')

      try {
        const response = await fetch('/api/voice/transcribe', {
          method: 'POST',
          body: formData,
        })

        if (!isMountedRef.current) return

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Error desconocido')
          dispatch({
            type: 'ERROR',
            payload: `Error al transcribir: ${errorText}`,
          })
          return
        }

        const data = (await response.json()) as { text?: string }

        if (!isMountedRef.current) return

        const text = data.text?.trim() ?? ''
        if (!text) {
          dispatch({ type: 'ERROR', payload: 'No se detectó voz. Intenta de nuevo.' })
          return
        }

        dispatch({ type: 'TRANSCRIPTION_SUCCESS', payload: text })
        onTranscript(text)
      } catch {
        if (!isMountedRef.current) return
        dispatch({ type: 'ERROR', payload: 'Error de red al transcribir el audio.' })
      }
    }

    recorder.onerror = () => {
      if (!isMountedRef.current) return
      dispatch({ type: 'ERROR', payload: 'Error durante la grabación de audio.' })
    }

    recorder.start(100)
    dispatch({ type: 'START_LISTENING' })
  }, [onTranscript])

  const stopListening = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop()
      dispatch({ type: 'STOP_LISTENING' })
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  const resetState = useCallback(() => {
    stopMediaTracks()
    dispatch({ type: 'RESET' })
  }, [stopMediaTracks])

  return {
    state: reducerState.state,
    transcript: reducerState.transcript,
    error: reducerState.error,
    startListening,
    stopListening,
    resetState,
  }
}
