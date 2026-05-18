'use client'

import { useState, useEffect, useCallback } from 'react'
import type { CurriculumContext, EducationLevel } from '@/types/curriculum'

const STORAGE_KEY = 'socrates-curriculum-context'

const DEFAULT_CONTEXT: CurriculumContext = {
  educationLevel: 'primary',
  grade: '4',
  area: 'Matemáticas',
}

interface UseCurriculumReturn {
  context: CurriculumContext
  setLevel: (level: EducationLevel) => void
  setGrade: (grade: string) => void
  setArea: (area: string) => void
  updateContext: (ctx: Partial<CurriculumContext>) => void
  saveToServer: () => Promise<void>
}

function loadFromStorage(): CurriculumContext {
  if (typeof window === 'undefined') return DEFAULT_CONTEXT

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_CONTEXT

    const parsed: unknown = JSON.parse(stored)
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'educationLevel' in parsed &&
      'grade' in parsed &&
      'area' in parsed
    ) {
      return parsed as CurriculumContext
    }
  } catch {
    // Storage unavailable or corrupted — fall back to defaults
  }

  return DEFAULT_CONTEXT
}

function saveToStorage(ctx: CurriculumContext): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx))
  } catch {
    // Storage unavailable — ignore
  }
}

export function useCurriculum(
  initialContext?: Partial<CurriculumContext>
): UseCurriculumReturn {
  const [context, setContext] = useState<CurriculumContext>(() => ({
    ...loadFromStorage(),
    ...initialContext,
  }))

  // Sync any server-provided initial overrides on mount
  useEffect(() => {
    if (!initialContext) return
    setContext((prev) => ({ ...prev, ...initialContext }))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Persist to localStorage whenever context changes
  useEffect(() => {
    saveToStorage(context)
  }, [context])

  const setLevel = useCallback((level: EducationLevel): void => {
    setContext((prev) => ({ ...prev, educationLevel: level }))
  }, [])

  const setGrade = useCallback((grade: string): void => {
    setContext((prev) => ({ ...prev, grade }))
  }, [])

  const setArea = useCallback((area: string): void => {
    setContext((prev) => ({ ...prev, area }))
  }, [])

  const updateContext = useCallback((ctx: Partial<CurriculumContext>): void => {
    setContext((prev) => ({ ...prev, ...ctx }))
  }, [])

  const saveToServer = useCallback(async (): Promise<void> => {
    const response = await fetch('/api/user/context', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Error desconocido' }))
      throw new Error(
        (data as { error?: string }).error ??
          `Error al guardar el contexto: HTTP ${response.status}`
      )
    }
  }, [context])

  return {
    context,
    setLevel,
    setGrade,
    setArea,
    updateContext,
    saveToServer,
  }
}
