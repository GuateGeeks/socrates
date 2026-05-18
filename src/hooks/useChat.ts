'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage } from '@/types/user'
import type { CurriculumContext, CnbSource } from '@/types/curriculum'

interface UseChatReturn {
  messages: ChatMessage[]
  conversationId: string | null
  isLoading: boolean
  error: string | null
  sendMessage: (text: string, context?: CurriculumContext) => Promise<void>
  clearConversation: () => void
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

interface SseDeltaChunk {
  delta: string
  done: false
}

interface SseFinalChunk {
  done: true
  sources?: CnbSource[]
  conversationId?: string
  messageId?: string
  error?: string
}

type SseChunk = SseDeltaChunk | SseFinalChunk

const SPOKEN_SUMMARY_RE = /\n*\*?spoken[_ ]summary\*?:?\s*[\s\S]*$/i

function cleanContent(raw: string): string {
  return raw.replace(SPOKEN_SUMMARY_RE, '').trim()
}

export function useChat(onAssistantMessage?: (msg: ChatMessage) => void): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const onAssistantMessageRef = useRef(onAssistantMessage)
  useEffect(() => { onAssistantMessageRef.current = onAssistantMessage }, [onAssistantMessage])

  const sendMessage = useCallback(
    async (text: string, context?: CurriculumContext): Promise<void> => {
      if (!text.trim() || isLoading) return

      // Cancel any in-flight request
      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setError(null)

      // Optimistic user message
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text.trim(),
        createdAt: new Date(),
      }

      const assistantMessageId = generateId()
      const assistantPlaceholder: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage, assistantPlaceholder])
      setIsLoading(true)

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            conversationId,
            curriculumContext: context,
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }))
          throw new Error(errorData.error ?? `HTTP ${response.status}`)
        }

        if (!response.body) {
          throw new Error('La respuesta no contiene datos de transmisión.')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          const lines = buffer.split('\n')
          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue

            const jsonStr = trimmed.slice('data:'.length).trim()
            if (!jsonStr) continue

            let chunk: SseChunk
            try {
              chunk = JSON.parse(jsonStr) as SseChunk
            } catch {
              continue
            }

            if (chunk.done) {
              const final = chunk as SseFinalChunk
              if (final.error) {
                throw new Error(final.error)
              }
              if (final.conversationId) {
                setConversationId(final.conversationId)
              }
              setMessages((prev) => {
                const updated = prev.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: cleanContent(msg.content), sources: final.sources ?? msg.sources }
                    : msg
                )
                const completedMsg = updated.find((m) => m.id === assistantMessageId)
                if (completedMsg) {
                  setTimeout(() => onAssistantMessageRef.current?.(completedMsg), 0)
                }
                return updated
              })
            } else {
              const delta = (chunk as SseDeltaChunk).delta
              if (delta) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + delta }
                      : msg
                  )
                )
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return

        const message =
          err instanceof Error ? err.message : 'Error al comunicarse con el servidor.'
        setError(message)

        // Remove the empty assistant placeholder on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId)
        )
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, isLoading]
  )

  const clearConversation = useCallback((): void => {
    abortControllerRef.current?.abort()
    setMessages([])
    setConversationId(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    messages,
    conversationId,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  }
}
