'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido').min(1, 'El correo es requerido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

type FieldErrors = Partial<Record<'email' | 'password', string>>

export default function LoginPage() {
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
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const parsed = loginSchema.safeParse(raw)
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
      const result = await signIn('credentials', {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      })

      if (result?.error) {
        setGeneralError('Correo o contraseña incorrectos.')
        return
      }

      router.push('/talk')
      router.refresh()
    })
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Iniciar sesión
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
            autoComplete="current-password"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 disabled:opacity-50"
            placeholder="••••••••"
            disabled={isPending}
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
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
          {isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="font-medium text-brand-500 hover:text-brand-600">
          Crear cuenta
        </Link>
      </p>
    </div>
  )
}
