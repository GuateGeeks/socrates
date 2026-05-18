'use client'

import { useState, useRef } from 'react'
import { CNB_AREAS, EDUCATION_LEVELS } from '@/types/curriculum'
import type { EducationLevel } from '@/types/curriculum'

interface DocumentUploadFormProps {
  onSuccess?: () => void
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

const EDUCATION_LEVEL_KEYS = Object.keys(EDUCATION_LEVELS) as EducationLevel[]

const PRISMA_LEVEL_MAP: Record<EducationLevel, string> = {
  initial: 'INITIAL',
  preschool: 'PRESCHOOL',
  primary: 'PRIMARY',
  middle_school: 'MIDDLE_SCHOOL',
  high_school: 'HIGH_SCHOOL',
}

export function DocumentUploadForm({ onSuccess }: DocumentUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('uploading')
    setErrorMessage(null)

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: 'Error desconocido' }))
        throw new Error((body as { error?: string }).error ?? `Error ${response.status}`)
      }

      setStatus('success')
      formRef.current?.reset()
      setFileName(null)
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir el documento'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    setFileName(file?.name ?? null)
    if (status !== 'idle') {
      setStatus('idle')
      setErrorMessage(null)
    }
  }

  const isUploading = status === 'uploading'

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="Formulario de carga de documento CNB"
    >
      {/* Title */}
      <div>
        <label htmlFor="doc-title" className="block text-sm font-medium text-gray-700 mb-1">
          Título <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="doc-title"
          name="title"
          type="text"
          required
          disabled={isUploading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 disabled:bg-gray-50"
          placeholder="Ej. CNB Primaria — Matemáticas"
        />
      </div>

      {/* Level */}
      <div>
        <label htmlFor="doc-level" className="block text-sm font-medium text-gray-700 mb-1">
          Nivel educativo
        </label>
        <select
          id="doc-level"
          name="level"
          disabled={isUploading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 disabled:bg-gray-50 bg-white"
        >
          <option value="">— Sin especificar —</option>
          {EDUCATION_LEVEL_KEYS.map((key) => (
            <option key={key} value={PRISMA_LEVEL_MAP[key]}>
              {EDUCATION_LEVELS[key]}
            </option>
          ))}
        </select>
      </div>

      {/* Grade */}
      <div>
        <label htmlFor="doc-grade" className="block text-sm font-medium text-gray-700 mb-1">
          Grado / Ciclo
        </label>
        <input
          id="doc-grade"
          name="grade"
          type="text"
          disabled={isUploading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 disabled:bg-gray-50"
          placeholder="Ej. 4, Párvulos 2, Ciclo Básico"
        />
      </div>

      {/* Area */}
      <div>
        <label htmlFor="doc-area" className="block text-sm font-medium text-gray-700 mb-1">
          Área curricular
        </label>
        <select
          id="doc-area"
          name="area"
          disabled={isUploading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50 disabled:bg-gray-50 bg-white"
        >
          <option value="">— Sin especificar —</option>
          {CNB_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* File input */}
      <div>
        <label htmlFor="doc-file" className="block text-sm font-medium text-gray-700 mb-1">
          Archivo <span aria-hidden="true" className="text-red-500">*</span>
          <span className="ml-1 font-normal text-gray-400">(PDF, TXT, MD)</span>
        </label>
        <label
          htmlFor="doc-file"
          className={[
            'flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed px-4 py-6 cursor-pointer transition-colors',
            isUploading
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-brand-400 hover:bg-brand-50',
          ].join(' ')}
        >
          {fileName ? (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-800 truncate max-w-[240px]">{fileName}</p>
              <p className="text-xs text-gray-400 mt-1">Archivo seleccionado</p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-2 text-gray-400"
                aria-hidden="true"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm text-gray-500">Toca para seleccionar un archivo</p>
              <p className="text-xs text-gray-400 mt-1">.pdf, .txt, .md</p>
            </div>
          )}
        </label>
        <input
          id="doc-file"
          name="file"
          type="file"
          required
          accept=".pdf,.txt,.md"
          disabled={isUploading}
          onChange={handleFileChange}
          className="sr-only"
        />
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5 text-emerald-600"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <p className="text-sm font-medium text-emerald-800">
            Documento en cola para indexación
          </p>
        </div>
      )}

      {status === 'error' && errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-shrink-0 mt-0.5 text-red-600"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isUploading}
        className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors min-h-[44px]"
      >
        {isUploading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-spin"
              aria-hidden="true"
            >
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
            Subiendo…
          </span>
        ) : (
          'Subir documento'
        )}
      </button>
    </form>
  )
}
