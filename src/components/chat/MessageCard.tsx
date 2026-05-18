'use client'

import { useState, useCallback } from 'react'
import type { ChatMessage } from '@/types/user'
import type { CnbSource } from '@/types/curriculum'
import { SourceCard } from './SourceCard'

interface MessageCardProps {
  message: ChatMessage
  onSpeakRequest?: (text: string) => void
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'ahora'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `hace ${diffHr} h`
  const diffDay = Math.floor(diffHr / 24)
  return `hace ${diffDay} d`
}

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
      <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.061Z" />
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function isStreaming(message: ChatMessage): boolean {
  // A message is considered streaming if it has no sources yet and no content,
  // or if content is present but sources have not been received (assistant only)
  return message.role === 'assistant' && message.content.length === 0
}

function renderInline(text: string, key: number): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[Fuente:[^\]]*\])/)
  return (
    <span key={key}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={i}>{part.slice(1, -1)}</em>
        if (part.startsWith('[Fuente:'))
          return <span key={i} className="text-xs text-brand-600 font-medium">{part}</span>
        return part
      })}
    </span>
  )
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0
  let k = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) { i++; continue }

    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const Tag = level === 1 ? 'h2' : 'h3'
      const cls = level === 1
        ? 'text-sm font-bold mt-2 mb-0.5 text-gray-900'
        : 'text-sm font-semibold mt-1.5 mb-0.5 text-gray-800'
      nodes.push(<Tag key={k++} className={cls}>{renderInline(headingMatch[2], 0)}</Tag>)
      i++; continue
    }

    if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
      const isOrdered = !!line.match(/^\d+\.\s+/)
      const items: string[] = []
      while (i < lines.length && (lines[i].match(/^[-*]\s+/) || lines[i].match(/^\d+\.\s+/))) {
        items.push(lines[i].replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))
        i++
      }
      const Tag = isOrdered ? 'ol' : 'ul'
      const cls = isOrdered
        ? 'list-decimal list-inside space-y-0.5 my-1 text-sm'
        : 'list-disc list-inside space-y-0.5 my-1 text-sm'
      nodes.push(
        <Tag key={k++} className={cls}>
          {items.map((item, j) => <li key={j}>{renderInline(item, j)}</li>)}
        </Tag>
      )
      continue
    }

    nodes.push(<p key={k++} className="text-sm leading-relaxed">{renderInline(line, 0)}</p>)
    i++
  }

  return <div className="space-y-1">{nodes}</div>
}

function BlinkingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-4 bg-gray-500 ml-0.5 align-middle animate-pulse"
      aria-hidden="true"
    />
  )
}

function SourcesSection({ sources }: { sources: CnbSource[] }) {
  const [expanded, setExpanded] = useState(false)

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors min-h-[44px] px-1"
        aria-expanded={expanded}
      >
        <span>
          {sources.length} fuente{sources.length !== 1 ? 's' : ''} del CNB
        </span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="mt-2 flex flex-col gap-2">
          {sources.map((source, index) => (
            <SourceCard key={source.chunkId} source={source} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MessageCard({ message, onSpeakRequest }: MessageCardProps) {
  const isUser = message.role === 'user'
  const streaming = !isUser && isStreaming(message)

  const handleSpeak = useCallback(() => {
    onSpeakRequest?.(message.content)
  }, [message.content, onSpeakRequest])

  if (isUser) {
    return (
      <div className="flex justify-end px-2">
        <div className="flex flex-col items-end gap-1 max-w-[85%]">
          <div className="bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed break-words shadow-sm">
            {message.content}
          </div>
          <span className="text-xs text-gray-400 px-1">
            {relativeTime(message.createdAt)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start px-2">
      <div className="flex flex-col items-start gap-1 max-w-[85%]">
        <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100 text-sm leading-relaxed text-gray-800 break-words">
          {streaming ? (
            <BlinkingCursor />
          ) : (
            <>
              {renderMarkdown(message.content)}
              {message.content.length > 0 && !message.sources && (
                <BlinkingCursor />
              )}

              {message.sources && message.sources.length > 0 && (
                <SourcesSection sources={message.sources} />
              )}

              {message.content.length > 0 && onSpeakRequest && (
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSpeak}
                    aria-label="Escuchar respuesta"
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-600 transition-colors min-h-[44px] px-2"
                  >
                    <SpeakerIcon className="w-4 h-4" />
                    <span>Escuchar</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <span className="text-xs text-gray-400 px-1">
          {relativeTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
