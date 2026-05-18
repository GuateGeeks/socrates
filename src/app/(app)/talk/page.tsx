'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { VoiceButton } from '@/components/voice/VoiceButton'
import { VoiceWaveform } from '@/components/voice/VoiceWaveform'
import { AudioPlayer } from '@/components/voice/AudioPlayer'
import { MessageCard } from '@/components/chat/MessageCard'
import { SuggestionChips } from '@/components/chat/SuggestionChips'
import { ContextSelector } from '@/components/context/ContextSelector'
import { useVoice } from '@/hooks/useVoice'
import { useChat } from '@/hooks/useChat'
import { useCurriculum } from '@/hooks/useCurriculum'
import { EDUCATION_LEVELS } from '@/types/curriculum'
import type { ChatMessage } from '@/types/user'

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405z" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function getLastAssistantAudioUrl(messages: ChatMessage[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.role === 'assistant' && msg.audioUrl) {
      return msg.audioUrl
    }
  }
  return undefined
}

export default function TalkPage() {
  const { context, setLevel, setGrade, setArea } = useCurriculum()
  const [audioUrl, setAudioUrl] = useState<string>('')
  const prevAudioUrl = useRef<string>('')

  const handleAssistantMessage = useCallback(async (msg: import('@/types/user').ChatMessage) => {
    if (!msg.content) return
    const text = msg.content.split(/\s+/).slice(0, 120).join(' ')
    try {
      const res = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      if (prevAudioUrl.current) URL.revokeObjectURL(prevAudioUrl.current)
      const url = URL.createObjectURL(blob)
      prevAudioUrl.current = url
      setAudioUrl(url)
    } catch {
      // TTS failure is non-fatal
    }
  }, [])

  const { messages, isLoading, error, sendMessage } = useChat(handleAssistantMessage)
  const [isContextOpen, setIsContextOpen] = useState(false)
  const [textInput, setTextInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleTranscript = useCallback(
    (text: string) => {
      void sendMessage(text, context)
    },
    [sendMessage, context],
  )

  const { state: voiceState, startListening, stopListening } = useVoice(handleTranscript)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendText = useCallback(() => {
    const trimmed = textInput.trim()
    if (!trimmed || isLoading) return
    setTextInput('')
    void sendMessage(trimmed, context)
  }, [textInput, isLoading, sendMessage, context])

  const handleTextKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendText()
      }
    },
    [handleSendText],
  )

  const levelLabel = EDUCATION_LEVELS[context.educationLevel]
  const contextChipLabel = `${levelLabel} · ${context.grade}° · ${context.area}`
  const isListening = voiceState === 'listening'

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
        <span className="text-lg font-bold text-brand-500 tracking-tight flex-shrink-0">
          Sócrates
        </span>
        <button
          type="button"
          onClick={() => setIsContextOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-200 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-100 transition-colors min-w-0 flex-shrink"
          aria-label="Cambiar contexto curricular"
        >
          <span className="truncate">{contextChipLabel}</span>
          <ChevronDownIcon className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </header>

      {/* Curriculum context banner */}
      <div className="bg-brand-500 px-4 py-2.5 flex items-center justify-between gap-3">
        <p className="text-xs text-white/90 leading-snug min-w-0">
          <span className="font-semibold text-white">Consultando:</span>{' '}
          {levelLabel}
          {context.grade ? ` › ${context.grade}° Grado` : ''}
          {context.area ? ` › ${context.area}` : ''}
        </p>
        <button
          type="button"
          onClick={() => setIsContextOpen(true)}
          className="flex-shrink-0 text-xs font-semibold text-white underline underline-offset-2 hover:text-white/80 transition-colors"
        >
          Cambiar
        </button>
      </div>

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-3">
            <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-3xl" aria-hidden="true">💬</span>
            </div>
            <p className="text-base font-medium text-gray-600">
              Haz una pregunta al CNB...
            </p>
            <p className="text-sm text-gray-400 max-w-xs">
              Puedes hablar o escribir tu pregunta sobre el currículo nacional.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageCard key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">Consultando el CNB...</span>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Audio player — auto-plays TTS of last response */}
      {audioUrl && (
        <div className="px-4 py-2 bg-white border-t border-gray-100">
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      )}

      {/* Voice + text input area */}
      <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-4 pt-3 pb-safe-bottom pb-4 space-y-3">
        {/* Waveform (shown only when listening) */}
        {isListening && (
          <div className="flex justify-center">
            <VoiceWaveform isActive={isListening} />
          </div>
        )}

        {/* Voice button centered */}
        <div className="flex flex-col items-center">
          <VoiceButton
            state={voiceState}
            onPressStart={startListening}
            onPressEnd={stopListening}
          />
        </div>

        {/* Text input row */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleTextKeyDown}
            placeholder="También puedes escribir tu pregunta..."
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors max-h-32 overflow-y-auto"
            disabled={isLoading}
            aria-label="Escribe tu pregunta"
          />
          <button
            type="button"
            onClick={handleSendText}
            disabled={!textInput.trim() || isLoading}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Enviar mensaje"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Suggestion chips */}
        <SuggestionChips
          onSelect={(suggestion) => void sendMessage(suggestion, context)}
          disabled={isLoading}
        />
      </div>

      {/* Context selector modal */}
      <ContextSelector
        isOpen={isContextOpen}
        onClose={() => setIsContextOpen(false)}
        currentContext={context}
        onSave={(newContext) => {
          setLevel(newContext.educationLevel)
          setGrade(newContext.grade)
          setArea(newContext.area)
        }}
      />
    </div>
  )
}
