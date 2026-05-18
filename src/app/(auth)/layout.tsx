import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-brand-500 tracking-tight">
            Sócrates
          </span>
          <p className="mt-1 text-sm text-gray-500">Plataforma educativa</p>
        </div>
        <div className="bg-white rounded-2xl shadow-md px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  )
}
