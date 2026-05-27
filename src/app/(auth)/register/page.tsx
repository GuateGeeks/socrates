'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  role: z.enum(['TEACHER', 'STUDENT'] as const, {
    error: 'Selecciona un rol válido',
  }),
})

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'role', string>>

export default function RegisterPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setGeneralError(null)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const raw = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as string,
    }

    const parsed = registerSchema.safeParse(raw)
    if (!parsed.success) {
      const errors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors
        errors[field] = issue.message
      }
      setFieldErrors(errors)
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        })

        const body = await response.json()

        if (!response.ok) {
          setGeneralError(body.error ?? 'Error al crear la cuenta. Intenta de nuevo.')
          return
        }

        router.push('/login?registered=1')
      } catch {
        setGeneralError('Error de conexión. Intenta de nuevo.')
      }
    })
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Crear cuenta
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
            placeholder="Tu nombre"
            disabled={isPending}
          />
          {fieldErrors.name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
            placeholder="correo@ejemplo.com"
            disabled={isPending}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
            placeholder="••••••••"
            disabled={isPending}
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Soy…
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 hover:border-brand-400 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700 transition-colors">
              <input
                type="radio"
                name="role"
                value="TEACHER"
                defaultChecked
                className="sr-only"
                disabled={isPending}
              />
              <span className="text-lg">🎓</span>
              <span className="font-medium">Docente</span>
            </label>
            <label className="relative flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 hover:border-brand-400 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-700 transition-colors">
              <input
                type="radio"
                name="role"
                value="STUDENT"
                className="sr-only"
                disabled={isPending}
              />
              <span className="text-lg">📚</span>
              <span className="font-medium">Estudiante</span>
            </label>
          </div>
          {fieldErrors.role && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.role}</p>
          )}
        </div>

        {generalError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-700">{generalError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="font-medium text-brand-500 hover:text-brand-600">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
