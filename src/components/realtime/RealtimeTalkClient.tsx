'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Transcript } from './Transcript'
import { BottomToolbar } from './BottomToolbar'
import { useRealtimeSession } from '@/hooks/useRealtimeSession'
import { useTranscript } from '@/contexts/TranscriptContext'
import { useEvent } from '@/contexts/EventContext'
import { createEducationalGuardrail } from '@/lib/realtime/guardrails'
import { getSocratesAgents, type SocratesRole } from '@/lib/realtime/agents'
import { extractRealtimeEphemeralKey } from '@/lib/realtime/clientSecret'
import { useCurriculum } from '@/hooks/useCurriculum'
import { ContextSelector } from '@/components/context/ContextSelector'
import { EDUCATION_LEVELS } from '@/types/curriculum'
import type { SessionStatus } from '@/types/realtime'
import { useAudioDownload } from '@/hooks/useAudioDownload'

interface RealtimeTalkClientProps {
  userRole: SocratesRole
  userName?: string | null
}

export function RealtimeTalkClient({ userRole, userName }: RealtimeTalkClientProps) {
  const { addTranscriptMessage, addTranscriptBreadcrumb } = useTranscript()
  const { logClientEvent, logServerEvent } = useEvent()
  const { context, updateContext, saveToServer } = useCurriculum()

  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DISCONNECTED')
  const [selectedAgentName, setSelectedAgentName] = useState<string>('')
  const [userText, setUserText] = useState('')
  const [isPTTActive, setIsPTTActive] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('ptt') === 'true' : false,
  )
  const [isPTTUserSpeaking, setIsPTTUserSpeaking] = useState(false)
  const [isAudioPlaybackEnabled, setIsAudioPlaybackEnabled] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('audio') !== 'false' : true,
  )
  const [isEventsPaneExpanded, setIsEventsPaneExpanded] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('logs') === 'true' : false,
  )
  const [isContextOpen, setIsContextOpen] = useState(false)

  const handoffTriggeredRef = useRef(false)
  const hasSentInitialGreetingRef = useRef(false)
  const hasAttemptedAutoConnectRef = useRef(false)
  const isConnectingRef = useRef(false)
  const isPTTUserSpeakingRef = useRef(false)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const [sdkAudioElement, setSdkAudioElement] = useState<HTMLAudioElement>()

  useEffect(() => {
    const el = document.createElement('audio')
    el.autoplay = true
    el.style.display = 'none'
    document.body.appendChild(el)
    audioElementRef.current = el
    setSdkAudioElement(el)

    return () => {
      el.pause()
      el.remove()
      if (audioElementRef.current === el) {
        audioElementRef.current = null
      }
    }
  }, [])

  const setMicrophoneEnabled = useCallback((enabled: boolean) => {
    microphoneStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = enabled
    })
  }, [])

  const { connect, disconnect, sendUserText, sendEvent, mute, interrupt } = useRealtimeSession({
    onConnectionChange: (s) => setSessionStatus(s as SessionStatus),
    onAgentHandoff: (agentName) => {
      handoffTriggeredRef.current = true
      setSelectedAgentName(agentName)
      addTranscriptBreadcrumb(`Agente: ${agentName}`)
    },
  })

  const { startRecording, stopRecording, downloadRecording } = useAudioDownload()

  // Persist preferences
  useEffect(() => { localStorage.setItem('ptt', String(isPTTActive)) }, [isPTTActive])
  useEffect(() => { localStorage.setItem('audio', String(isAudioPlaybackEnabled)) }, [isAudioPlaybackEnabled])
  useEffect(() => { localStorage.setItem('logs', String(isEventsPaneExpanded)) }, [isEventsPaneExpanded])

  // Audio playback toggle
  useEffect(() => {
    const el = audioElementRef.current
    if (!el) return
    if (isAudioPlaybackEnabled) {
      el.muted = false
      el.play().catch(() => {})
    } else {
      el.muted = true
      el.pause()
    }
  }, [isAudioPlaybackEnabled])

  // Mic input policy. Audio playback and microphone capture are separate concerns.
  useEffect(() => {
    if (sessionStatus !== 'CONNECTED') return

    setMicrophoneEnabled(!isPTTActive || isPTTUserSpeaking)
    try { mute(isPTTActive && !isPTTUserSpeaking) } catch {}
  }, [isPTTActive, isPTTUserSpeaking, mute, sessionStatus, setMicrophoneEnabled])

  // Start/stop recording
  useEffect(() => {
    if (sessionStatus === 'CONNECTED' && audioElementRef.current?.srcObject) {
      startRecording(audioElementRef.current.srcObject as MediaStream)
    }
    return () => stopRecording()
  }, [sessionStatus, startRecording, stopRecording])

  const connectToRealtime = useCallback(async () => {
    if (!sdkAudioElement) return
    if (isConnectingRef.current) return
    if (sessionStatus !== 'DISCONNECTED') return
    isConnectingRef.current = true
    hasSentInitialGreetingRef.current = false
    setSessionStatus('CONNECTING')
    try {
      const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = microphoneStream
      microphoneStream.getAudioTracks().forEach((track) => {
        track.enabled = !isPTTActive
      })

      logClientEvent({ url: '/api/realtime/session' }, 'fetch_session_token_request')
      const res = await fetch('/api/realtime/session')
      const data = await res.json()
      logServerEvent(data, 'fetch_session_token_response')

      const ephemeralKey = extractRealtimeEphemeralKey(data)

      if (!ephemeralKey) {
        console.error('No ephemeral key. OpenAI response:', JSON.stringify(data))
        microphoneStreamRef.current?.getTracks().forEach((track) => track.stop())
        microphoneStreamRef.current = null
        setSessionStatus('DISCONNECTED')
        return
      }

      const agents = getSocratesAgents(userRole)
      setSelectedAgentName(agents[0].name)

      await connect({
        getEphemeralKey: async () => ephemeralKey,
        initialAgents: agents,
        audioElement: sdkAudioElement,
        mediaStream: microphoneStream,
        outputGuardrails: [createEducationalGuardrail()],
        extraContext: { addTranscriptBreadcrumb },
      })
    } catch (err) {
      console.error('Connect error:', err)
      microphoneStreamRef.current?.getTracks().forEach((track) => track.stop())
      microphoneStreamRef.current = null
      setSessionStatus('DISCONNECTED')
    } finally {
      isConnectingRef.current = false
    }
  }, [
    addTranscriptBreadcrumb,
    connect,
    logClientEvent,
    logServerEvent,
    isPTTActive,
    sdkAudioElement,
    sessionStatus,
    userRole,
  ])

  const disconnectFromRealtime = () => {
    disconnect()
    hasSentInitialGreetingRef.current = false
    isConnectingRef.current = false
    isPTTUserSpeakingRef.current = false
    microphoneStreamRef.current?.getTracks().forEach((track) => track.stop())
    microphoneStreamRef.current = null
    setSessionStatus('DISCONNECTED')
    setIsPTTUserSpeaking(false)
  }

  const onToggleConnection = () => {
    if (sessionStatus === 'CONNECTED' || sessionStatus === 'CONNECTING') {
      disconnectFromRealtime()
    } else {
      void connectToRealtime()
    }
  }

  // Auto-connect on mount
  useEffect(() => {
    if (hasAttemptedAutoConnectRef.current) return
    hasAttemptedAutoConnectRef.current = true
    void connectToRealtime()
  }, [connectToRealtime])

  // Realtime voice turn detection. PTT gates the microphone track; VAD still closes the turn.
  useEffect(() => {
    if (sessionStatus !== 'CONNECTED') return
    sendEvent({
      type: 'session.update',
      session: {
        audio: {
          input: {
            turn_detection: {
              type: 'server_vad',
              threshold: 0.75,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
              create_response: true,
            },
          },
        },
      },
    })
  }, [sendEvent, sessionStatus])

  // Trigger greeting on connect
  useEffect(() => {
    if (sessionStatus !== 'CONNECTED') return
    if (hasSentInitialGreetingRef.current) return

    hasSentInitialGreetingRef.current = true
    handoffTriggeredRef.current = false

    const id = uuidv4().slice(0, 32)
    addTranscriptMessage(id, 'user', 'hola', true)
    sendEvent({ type: 'conversation.item.create', item: { id, type: 'message', role: 'user', content: [{ type: 'input_text', text: 'hola' }] } })
    sendEvent({ type: 'response.create' })
  }, [addTranscriptMessage, sendEvent, sessionStatus])

  const handleSendTextMessage = () => {
    if (!userText.trim() || sessionStatus !== 'CONNECTED') return
    interrupt()
    try { sendUserText(userText.trim()) } catch {}
    setUserText('')
  }

  const handleTalkButtonDown = () => {
    if (sessionStatus !== 'CONNECTED') return
    if (isPTTUserSpeakingRef.current) return
    isPTTUserSpeakingRef.current = true
    interrupt()
    setIsPTTUserSpeaking(true)
    setMicrophoneEnabled(true)
    try { mute(false) } catch {}
    sendEvent({ type: 'input_audio_buffer.clear' })
  }

  const handleTalkButtonUp = () => {
    if (sessionStatus !== 'CONNECTED' || !isPTTUserSpeakingRef.current) return
    isPTTUserSpeakingRef.current = false
    setIsPTTUserSpeaking(false)
    window.setTimeout(() => {
      if (isPTTActive && !isPTTUserSpeakingRef.current) {
        setMicrophoneEnabled(false)
        try { mute(true) } catch {}
      }
    }, 650)
  }

  const levelLabel = EDUCATION_LEVELS[context.educationLevel]
  const contextLabel = `${levelLabel} · ${context.grade}° · ${context.area}`

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">Sócrates</span>
          {selectedAgentName && (
            <span className="text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded-full px-2 py-0.5 font-mono">
              {selectedAgentName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-sm text-gray-500 hidden sm:block">{userName}</span>
          )}
          <button
            type="button"
            onClick={() => setIsContextOpen(true)}
            className="text-xs border border-gray-300 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {contextLabel}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 gap-2 px-2 py-2 overflow-hidden">
        <Transcript
          userText={userText}
          setUserText={setUserText}
          onSendMessage={handleSendTextMessage}
          canSend={sessionStatus === 'CONNECTED'}
          downloadRecording={downloadRecording}
        />

        {/* Events pane */}
        {isEventsPaneExpanded && (
          <div className="w-80 bg-white rounded-xl border border-gray-200 overflow-auto p-3 text-xs font-mono text-gray-500 flex-shrink-0">
            <p className="font-semibold text-gray-700 mb-2">Registros</p>
            <p className="text-gray-400 text-center mt-8">Registros de eventos disponibles en la consola del navegador.</p>
          </div>
        )}
      </div>

      <BottomToolbar
        sessionStatus={sessionStatus}
        onToggleConnection={onToggleConnection}
        isPTTActive={isPTTActive}
        setIsPTTActive={setIsPTTActive}
        isPTTUserSpeaking={isPTTUserSpeaking}
        handleTalkButtonDown={handleTalkButtonDown}
        handleTalkButtonUp={handleTalkButtonUp}
        isEventsPaneExpanded={isEventsPaneExpanded}
        setIsEventsPaneExpanded={setIsEventsPaneExpanded}
        isAudioPlaybackEnabled={isAudioPlaybackEnabled}
        setIsAudioPlaybackEnabled={setIsAudioPlaybackEnabled}
        codec="opus"
        onCodecChange={() => {}}
      />

      <ContextSelector
        isOpen={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        currentContext={context}
        onSave={(ctx) => {
          updateContext(ctx)
          void saveToServer(ctx).catch((error) => {
            addTranscriptBreadcrumb('No se pudo guardar el contexto curricular', {
              message: error instanceof Error ? error.message : 'Error desconocido',
            })
          })
          setIsContextOpen(false)
        }}
      />
    </div>
  )
}
