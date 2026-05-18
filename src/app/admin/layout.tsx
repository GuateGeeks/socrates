import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) redirect('/login')
  if (session.user.role !== 'ADMIN') redirect('/talk')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-brand-500">
            Panel de Administración
          </h1>
        </div>
      </header>
      <main className="max-w-md mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
