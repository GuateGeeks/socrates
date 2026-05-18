'use client'

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import type { UserRole } from '@/types/user'

interface CreationOption {
  id: string
  icon: string
  title: string
  description: string
  prompt: string
}

const TEACHER_OPTIONS: CreationOption[] = [
  {
    id: 'actividad',
    icon: '✏️',
    title: 'Actividad',
    description: 'Genera una actividad de clase',
    prompt:
      'Genera una actividad de clase alineada al CNB para el nivel y área seleccionados. Incluye objetivo, materiales, instrucciones y evaluación.',
  },
  {
    id: 'plan',
    icon: '📋',
    title: 'Plan de Clase',
    description: 'Plan completo con competencias',
    prompt:
      'Crea un plan de clase completo con competencias, indicadores de logro, contenidos, metodología y evaluación según el CNB.',
  },
  {
    id: 'rubrica',
    icon: '📊',
    title: 'Rúbrica',
    description: 'Rúbrica de evaluación',
    prompt:
      'Diseña una rúbrica de evaluación detallada con criterios, niveles de desempeño e indicadores alineados al CNB.',
  },
  {
    id: 'evaluacion',
    icon: '📝',
    title: 'Evaluación',
    description: 'Preguntas de evaluación',
    prompt:
      'Elabora un banco de preguntas de evaluación con diferentes niveles cognitivos (conocimiento, comprensión, aplicación, análisis) basadas en el CNB.',
  },
]

const STUDENT_OPTIONS: CreationOption[] = [
  {
    id: 'practica',
    icon: '🏋️',
    title: 'Práctica',
    description: 'Ejercicios de práctica',
    prompt:
      'Genera ejercicios de práctica para reforzar los temas que estoy estudiando según el CNB. Incluye ejemplos resueltos y ejercicios para resolver.',
  },
  {
    id: 'quiz',
    icon: '⚡',
    title: 'Quiz',
    description: 'Prueba rápida',
    prompt:
      'Crea una prueba rápida de 10 preguntas sobre el tema que estoy estudiando para evaluar mi comprensión del CNB.',
  },
]

interface CreateCardProps {
  option: CreationOption
  onTap: (option: CreationOption) => void
}

function CreateCard({ option, onTap }: CreateCardProps) {
  return (
    <button
      type="button"
      onClick={() => onTap(option)}
      className="w-full flex items-start gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4 text-left hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 active:scale-[0.98] transition-all"
      aria-label={`Crear ${option.title}: ${option.description}`}
    >
      <span className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-2xl" aria-hidden="true">
        {option.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-semibold text-gray-900">{option.title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{option.description}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  )
}

interface CreatePageClientProps {
  role: UserRole
}

export function CreatePageClient({ role }: CreatePageClientProps) {
  const router = useRouter()
  const isTeacher = role === 'TEACHER' || role === 'ADMIN'
  const options = isTeacher ? TEACHER_OPTIONS : STUDENT_OPTIONS

  const handleOptionTap = useCallback(
    (option: CreationOption) => {
      const params = new URLSearchParams({ prompt: option.prompt })
      router.push(`/talk?${params.toString()}`)
    },
    [router],
  )

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Crear</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {isTeacher
            ? 'Genera recursos educativos con ayuda del CNB'
            : 'Crea materiales de estudio personalizados'}
        </p>
      </header>

      <div className="flex-1 px-4 py-5 space-y-4">
        <p className="text-sm font-medium text-gray-600">
          {isTeacher
            ? '¿Qué deseas crear hoy?'
            : '¿Con qué te gustaría practicar?'}
        </p>

        <div className="space-y-3">
          {options.map((option) => (
            <CreateCard key={option.id} option={option} onTap={handleOptionTap} />
          ))}
        </div>

        <p className="text-xs text-center text-gray-400 pt-4">
          Al seleccionar una opción, Sócrates consultará el CNB para generar el contenido.
        </p>
      </div>
    </div>
  )
}
