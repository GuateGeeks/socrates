'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EDUCATION_LEVELS,
  GRADES_BY_LEVEL,
  CNB_AREAS,
  type CurriculumContext,
  type EducationLevel,
} from '@/types/curriculum'

interface ContextSelectorProps {
  isOpen: boolean
  onClose: () => void
  currentContext: CurriculumContext
  onSave: (context: CurriculumContext) => void
}

const EDUCATION_LEVEL_KEYS = Object.keys(EDUCATION_LEVELS) as EducationLevel[]

export function ContextSelector({
  isOpen,
  onClose,
  currentContext,
  onSave,
}: ContextSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(
    currentContext.educationLevel,
  )
  const [selectedGrade, setSelectedGrade] = useState<string>(currentContext.grade)
  const [selectedArea, setSelectedArea] = useState<string>(currentContext.area)

  // Reset local state when the sheet opens with fresh currentContext
  useEffect(() => {
    if (isOpen) {
      setSelectedLevel(currentContext.educationLevel)
      setSelectedGrade(currentContext.grade)
      setSelectedArea(currentContext.area)
    }
  }, [isOpen, currentContext])

  // When level changes, reset grade to the first available option for that level
  function handleLevelChange(level: EducationLevel) {
    setSelectedLevel(level)
    const grades = GRADES_BY_LEVEL[level]
    setSelectedGrade(grades[0] ?? '')
  }

  function handleSave() {
    onSave({
      educationLevel: selectedLevel,
      grade: selectedGrade,
      area: selectedArea,
    })
    onClose()
  }

  const gradesForLevel = GRADES_BY_LEVEL[selectedLevel] ?? []

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden="true"
            onClick={onClose}
          />

          {/* Bottom sheet */}
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Seleccionar contexto curricular"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="w-full max-w-md bg-white rounded-t-2xl shadow-xl overflow-hidden">
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300" aria-hidden="true" />
              </div>

              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900 text-center">
                  Contexto Curricular
                </h2>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto max-h-[70vh] px-4 py-4 space-y-6">
                {/* Step 1: Education level */}
                <section>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Nivel educativo
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {EDUCATION_LEVEL_KEYS.map((level) => {
                      const isActive = level === selectedLevel
                      return (
                        <label
                          key={level}
                          className={[
                            'flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer',
                            'transition-colors duration-150 min-h-[44px]',
                            isActive
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                          ].join(' ')}
                        >
                          <input
                            type="radio"
                            name="educationLevel"
                            value={level}
                            checked={isActive}
                            onChange={() => handleLevelChange(level)}
                            className="sr-only"
                          />
                          <span
                            className={[
                              'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                              isActive ? 'border-brand-500' : 'border-gray-400',
                            ].join(' ')}
                            aria-hidden="true"
                          >
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-brand-500" />
                            )}
                          </span>
                          <span className="text-sm font-medium">
                            {EDUCATION_LEVELS[level]}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </section>

                {/* Step 2: Grade */}
                <section>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Grado</h3>
                  <div className="flex flex-wrap gap-2">
                    {gradesForLevel.map((grade) => {
                      const isActive = grade === selectedGrade
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => setSelectedGrade(grade)}
                          className={[
                            'px-4 py-2 rounded-lg text-sm font-medium border-2 min-h-[44px]',
                            'transition-colors duration-150',
                            isActive
                              ? 'border-brand-500 bg-brand-500 text-white'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                          ].join(' ')}
                          aria-pressed={isActive}
                        >
                          {grade}
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* Step 3: Area */}
                <section>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Área curricular
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {CNB_AREAS.map((area) => {
                      const isActive = area === selectedArea
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => setSelectedArea(area)}
                          className={[
                            'flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left',
                            'transition-colors duration-150 min-h-[44px]',
                            isActive
                              ? 'border-brand-500 bg-brand-50 text-brand-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                          ].join(' ')}
                          aria-pressed={isActive}
                        >
                          <span
                            className={[
                              'w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                              isActive ? 'border-brand-500' : 'border-gray-400',
                            ].join(' ')}
                            aria-hidden="true"
                          >
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-brand-500" />
                            )}
                          </span>
                          <span className="text-sm font-medium">{area}</span>
                        </button>
                      )
                    })}
                  </div>
                </section>
              </div>

              {/* Footer actions */}
              <div className="px-4 py-4 border-t border-gray-100 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-700 min-h-[44px] hover:bg-gray-50 transition-colors duration-150"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 px-4 py-3 rounded-xl bg-brand-500 text-sm font-medium text-white min-h-[44px] hover:bg-brand-600 transition-colors duration-150"
                >
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
