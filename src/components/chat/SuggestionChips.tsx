'use client'

import { useCallback } from 'react'
import type { UserRole } from '@/types/user'

interface SuggestionChipsProps {
  role?: UserRole
  onSelect: (suggestion: string) => void
  disabled?: boolean
}

const TEACHER_SUGGESTIONS: string[] = [
  'Crea una actividad de 30 minutos.',
  'Explica esta competencia.',
  'Genera una rúbrica sencilla.',
]

const STUDENT_SUGGESTIONS: string[] = [
  'Explícame con un ejemplo.',
  'Hazme una pregunta.',
  'Repasemos paso a paso.',
]

function getSuggestions(role?: UserRole): string[] {
  if (role === 'STUDENT') return STUDENT_SUGGESTIONS
  // TEACHER, ADMIN, and undefined all get teacher suggestions
  return TEACHER_SUGGESTIONS
}

interface ChipProps {
  label: string
  onClick: (label: string) => void
  disabled: boolean
}

function Chip({ label, onClick, disabled }: ChipProps) {
  const handleClick = useCallback(() => {
    onClick(label)
  }, [label, onClick])

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={[
        'flex-shrink-0 inline-flex items-center',
        'h-11 px-4 rounded-full',
        'text-sm font-medium whitespace-nowrap',
        'bg-gray-100 text-gray-700',
        'border border-gray-200',
        'transition-colors duration-150',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-200 active:bg-gray-300 cursor-pointer',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function SuggestionChips({ role, onSelect, disabled = false }: SuggestionChipsProps) {
  const suggestions = getSuggestions(role)

  return (
    <div
      className="flex gap-2 overflow-x-auto px-2 py-1 scrollbar-none"
      style={{ scrollbarWidth: 'none' }}
      role="list"
      aria-label="Sugerencias"
    >
      {suggestions.map((suggestion) => (
        <div key={suggestion} role="listitem">
          <Chip
            label={suggestion}
            onClick={onSelect}
            disabled={disabled}
          />
        </div>
      ))}
    </div>
  )
}
