'use client'

import { useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import { DownloadIcon, ClipboardCopyIcon } from '@radix-ui/react-icons'
import { useTranscript } from '@/contexts/TranscriptContext'
import { TranscriptItem } from '@/types/realtime'
import { GuardrailChip } from './GuardrailChip'

interface TranscriptProps {
  userText: string
  setUserText: (val: string) => void
  onSendMessage: () => void
  canSend: boolean
  downloadRecording: () => void
}

function isBracketedMessage(text: string): boolean {
  return /^\[.+\]$/.test(text.trim())
}

function MessageBubble({ item }: { item: TranscriptItem }) {
  const isUser = item.role === 'user'
  const text = item.title ?? ''
  const isBracketed = isBracketedMessage(text)

  if (isBracketed) {
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1`}>
        <span className="text-xs italic text-gray-400 px-2">{text}</span>
      </div>
    )
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-gray-900 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
        }`}
      >
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
            code: ({ children }) => (
              <code className="bg-black/10 rounded px-1 py-0.5 text-xs font-mono">{children}</code>
            ),
            pre: ({ children }) => (
              <pre className="bg-black/10 rounded p-2 text-xs font-mono overflow-x-auto my-1">
                {children}
              </pre>
            ),
          }}
        >
          {text}
        </ReactMarkdown>

        {item.guardrailResult && (
          <div className="mt-1.5">
            <GuardrailChip guardrailResult={item.guardrailResult} />
          </div>
        )}
      </div>
    </div>
  )
}

function BreadcrumbItem({ item }: { item: TranscriptItem }) {
  const { toggleTranscriptItemExpand } = useTranscript()

  return (
    <div className="mb-1 px-2">
      <button
        type="button"
        onClick={() => toggleTranscriptItemExpand(item.itemId)}
        className="inline-flex items-center gap-1 text-xs text-gray-400 font-mono hover:text-gray-600 transition-colors"
        aria-expanded={item.expanded}
      >
        <span aria-hidden="true">{item.expanded ? '▼' : '▶'}</span>
        <span>{item.title}</span>
        <span className="text-gray-300 ml-1">{item.timestamp}</span>
      </button>

      {item.expanded && item.data && (
        <pre className="mt-1 ml-4 text-xs text-gray-500 font-mono bg-gray-50 border border-gray-100 rounded p-2 overflow-x-auto whitespace-pre-wrap break-words max-w-full">
          {JSON.stringify(item.data, null, 2)}
        </pre>
      )}
    </div>
  )
}

export function Transcript({
  userText,
  setUserText,
  onSendMessage,
  canSend,
  downloadRecording,
}: TranscriptProps) {
  const { transcriptItems } = useTranscript()
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const visibleItems = transcriptItems.filter((item) => !item.isHidden)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleItems.length, transcriptItems])

  const handleCopyTranscript = useCallback(() => {
    const lines = visibleItems
      .filter((item) => item.type === 'MESSAGE' && item.title)
      .map((item) => {
        const speaker = item.role === 'user' ? 'Tú' : 'Sócrates'
        return `[${item.timestamp}] ${speaker}: ${item.title}`
      })
      .join('\n')
    navigator.clipboard.writeText(lines).catch(() => {})
  }, [visibleItems])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSend && userText.trim()) {
        onSendMessage()
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header toolbar */}
      <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-gray-100 shrink-0">
        <button
          type="button"
          onClick={handleCopyTranscript}
          title="Copiar transcripción"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-50"
        >
          <ClipboardCopyIcon className="w-3.5 h-3.5" />
          Copiar
        </button>
        <button
          type="button"
          onClick={downloadRecording}
          title="Descargar grabación"
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors px-2 py-1 rounded hover:bg-gray-50"
        >
          <DownloadIcon className="w-3.5 h-3.5" />
          Descargar
        </button>
      </div>

      {/* Messages area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5"
        aria-label="Transcripción de la conversación"
        aria-live="polite"
        aria-atomic="false"
      >
        {visibleItems.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-300 select-none">La conversación aparecerá aquí</p>
          </div>
        )}

        {visibleItems.map((item: TranscriptItem) => {
          if (item.type === 'BREADCRUMB') {
            return <BreadcrumbItem key={item.itemId} item={item} />
          }
          return <MessageBubble key={item.itemId} item={item} />
        })}

        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={userText}
            onChange={(e) => setUserText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            disabled={!canSend}
            rows={1}
            className={`flex-1 resize-none rounded-xl border px-3 py-2 text-sm leading-relaxed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/20 ${
              canSend
                ? 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
                : 'border-gray-100 bg-gray-50 text-gray-400 placeholder-gray-300 cursor-not-allowed'
            }`}
            style={{ maxHeight: '120px', overflowY: 'auto' }}
            aria-label="Mensaje"
          />

          <button
            type="button"
            onClick={onSendMessage}
            disabled={!canSend || !userText.trim()}
            className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-xl transition-colors ${
              canSend && userText.trim()
                ? 'bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800'
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Enviar mensaje"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
