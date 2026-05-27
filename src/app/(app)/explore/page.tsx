'use client'

import { useState, useCallback } from 'react'
import { SourceCard } from '@/components/chat/SourceCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { EDUCATION_LEVELS } from '@/types/curriculum'
import type { EducationLevel, CnbSource } from '@/types/curriculum'

function SearchIcon({ className }: { className?: string }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
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
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}

const LEVEL_ICONS: Record<EducationLevel, string> = {
  initial: '🌱',
  preschool: '🎨',
  primary: '📚',
  middle_school: '🔬',
  high_school: '🎓',
}

interface RagQueryResponse {
  results: CnbSource[]
}

async function queryRag(query: string, level?: EducationLevel): Promise<CnbSource[]> {
  const response = await fetch('/api/rag/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, level, topK: 6 }),
  })

  if (!response.ok) {
    throw new Error(`Error al buscar: ${response.status}`)
  }

  const data = (await response.json()) as RagQueryResponse
  return data.results ?? []
}

export default function ExplorePage() {
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<CnbSource[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = useCallback(async () => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    setIsSearching(true)
    setSearchError(null)
    setHasSearched(true)

    try {
      const found = await queryRag(trimmed, selectedLevel ?? undefined)
      setResults(found)
    } catch (err) {
      setSearchError(
        err instanceof Error ? err.message : 'Error al realizar la búsqueda.',
      )
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery, selectedLevel])

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        void handleSearch()
      }
    },
    [handleSearch],
  )

  const handleLevelSelect = useCallback((level: EducationLevel) => {
    setSelectedLevel((prev) => (prev === level ? null : level))
    setHasSearched(false)
    setResults([])
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setResults([])
    setHasSearched(false)
    setSearchError(null)
  }, [])

  const levels = Object.entries(EDUCATION_LEVELS) as [EducationLevel, string][]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Explorar CNB</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Explora el Currículo Nacional Base de Guatemala
        </p>
      </header>

      <div className="flex-1 px-4 py-5 space-y-6">
        {/* Search bar */}
        <div className="relative">
          <label htmlFor="cnb-search" className="sr-only">
            Buscar en el CNB
          </label>
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            id="cnb-search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar en el CNB... p. ej. 'competencias de matemáticas'"
            className="w-full rounded-2xl border border-gray-300 bg-white pl-10 pr-10 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-colors"
            aria-label="Buscar en el CNB"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <XIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={() => void handleSearch()}
          disabled={!searchQuery.trim() || isSearching}
          className="w-full rounded-2xl bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? 'Buscando...' : 'Buscar en el CNB'}
        </button>

        {/* Level filter cards */}
        <section aria-labelledby="levels-heading">
          <h2 id="levels-heading" className="text-sm font-semibold text-gray-700 mb-3">
            Filtrar por nivel
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {levels.map(([level, label]) => {
              const isActive = selectedLevel === level
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleLevelSelect(level)}
                  className={[
                    'flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
                    isActive
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-gray-50',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {LEVEL_ICONS[level]}
                  </span>
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </button>
              )
            })}
          </div>
          {selectedLevel && (
            <p className="mt-2 text-xs text-brand-600 font-medium">
              Filtrando por: {EDUCATION_LEVELS[selectedLevel]}
            </p>
          )}
        </section>

        {/* Search results */}
        {isSearching && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {searchError && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {searchError}
          </div>
        )}

        {hasSearched && !isSearching && !searchError && (
          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="text-sm font-semibold text-gray-700 mb-3">
              {results.length > 0
                ? `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`
                : 'Sin resultados'}
            </h2>

            {results.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">
                  No se encontraron documentos para{' '}
                  <span className="font-medium">&quot;{searchQuery}&quot;</span>.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Intenta con otros términos o cambia el nivel seleccionado.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((source) => (
                  <SourceCard key={source.chunkId} source={source} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Upcoming features note */}
        {!hasSearched && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-5 text-center">
            <p className="text-sm font-medium text-amber-800">
              Próximamente: exploración completa del CNB
            </p>
            <p className="text-xs text-amber-600 mt-1">
              Navega por grados, áreas y competencias de manera interactiva.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
