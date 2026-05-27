'use client'

import { useState } from 'react'
import { GuardrailResultType, ModerationCategory } from '@/types/realtime'

interface GuardrailChipProps {
  guardrailResult: GuardrailResultType
}

const CATEGORY_LABELS: Record<ModerationCategory, string> = {
  OFFENSIVE: 'Contenido Ofensivo',
  OFF_BRAND: 'Fuera de Tema Educativo',
  VIOLENCE: 'Contenido Violento',
  NONE: 'Aprobado',
}

export function GuardrailChip({ guardrailResult }: GuardrailChipProps) {
  const [expanded, setExpanded] = useState(false)

  const { status, category, rationale, testText } = guardrailResult

  if (status === 'IN_PROGRESS') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 border border-gray-200">
        <svg
          className="animate-spin h-3 w-3 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Verificando...
      </span>
    )
  }

  const isApproved = category === 'NONE' || category === undefined
  const categoryLabel = category ? CATEGORY_LABELS[category] : 'Aprobado'

  if (isApproved) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
        <span aria-hidden="true">✓</span>
        {categoryLabel}
      </span>
    )
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer text-left"
        aria-expanded={expanded}
      >
        <span aria-hidden="true">✗</span>
        <span>{categoryLabel}</span>
        {rationale && (
          <span className="text-red-500 truncate max-w-[200px]">— {rationale}</span>
        )}
        <span className="ml-1 text-red-400" aria-hidden="true">
          {expanded ? '▲' : '▼'}
        </span>
      </button>

      {expanded && testText && (
        <div className="mt-1 px-2 py-1.5 rounded text-xs bg-red-50 border border-red-100 text-red-800 font-mono whitespace-pre-wrap break-words max-w-xs">
          {testText}
        </div>
      )}
    </div>
  )
}
