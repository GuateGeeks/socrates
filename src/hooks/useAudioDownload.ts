'use client'

import { useRef, useCallback } from 'react'

export function useAudioDownload() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback((remoteStream: MediaStream) => {
    try {
      const mediaRecorder = new MediaRecorder(remoteStream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.start(100)
    } catch (err) {
      console.warn('[useAudioDownload] Could not start recording:', err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop()
    }
    mediaRecorderRef.current = null
  }, [])

  const downloadRecording = useCallback(() => {
    if (!chunksRef.current.length) return
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `socrates-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  return { startRecording, stopRecording, downloadRecording }
}
