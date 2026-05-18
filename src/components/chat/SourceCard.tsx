'use client'

import { useState, useCallback } from 'react'
import type { CnbSource } from '@/types/curriculum'
import { EDUCATION_LEVELS } from '@/types/curriculum'

interface SourceCardProps {
  source: CnbSource
  index?: number
}

function relevanceColor(score: number): string {
  if (score >= 0.7) return 'bg-green-500'
  if (score >= 0.4) return 'bg-yellow-400'
  return 'bg-orange-400'
}

function relevanceWidth(score: number): string {
  const clamped = Math.min(Math.max(score, 0), 1)
  // Round to nearest 5% for Tailwind arbitrary value compatibility
  const pct = Math.round(clamped * 100)
  return `${pct}%`
}

export function SourceCard({ source, index }: SourceCardProps) {
  const [excerptExpanded, setExcerptExpanded] = useState(false)

  const toggleExcerpt = useCallback(() => {
    setExcerptExpanded((prev) => !prev)
  }, [])

  const levelLabel = EDUCATION_LEVELS[source.level] ?? source.level

  return (
    <div className="bg-blue-50 border-l-4 border-brand-500 rounded-r-lg overflow-hidden">
      {/* Relevance bar */}
      <div className="h-1 bg-gray-200">
        <div
          className={`h-full transition-all duration-300 ${relevanceColor(source.relevanceScore)}`}
          style={{ width: relevanceWidth(source.relevanceScore) }}
          role="presentation"
          aria-hidden="true"
        />
      </div>

      <div className="px-3 py-3">
        {/* Header row */}
        <div className="flex items-start gap-2">
          {index !== undefined && (
            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-white text-xs font-bold mt-0.5">
              {index + 1}
            </span>
          )}
          <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">
            {source.title}
          </p>
        </div>

        {/* Metadata badges */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
            <span className="font-medium text-gray-500">Nivel:</span>
            <span className="bg-brand-100 text-brand-700 rounded-full px-2 py-0.5 font-medium">
              {levelLabel}
            </span>
          </span>

          {source.grade && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
              <span className="font-medium text-gray-500">Grado:</span>
              <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {source.grade}
              </span>
            </span>
          )}

          {source.area && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600">
              <span className="font-medium text-gray-500">Área:</span>
              <span className="bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
                {source.area}
              </span>
            </span>
          )}
        </div>

        {/* Excerpt */}
        {source.excerpt && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-500 mb-1">Extracto:</p>
            <button
              type="button"
              onClick={toggleExcerpt}
              className="text-left w-full"
              aria-expanded={excerptExpanded}
            >
              <p
                className={`text-xs text-gray-600 leading-relaxed ${
                  excerptExpanded ? '' : 'line-clamp-3'
                }`}
              >
                {source.excerpt}
              </p>
              <span className="text-xs text-brand-600 hover:text-brand-700 transition-colors mt-1 block">
                {excerptExpanded ? 'Ver menos' : 'Ver más'}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
