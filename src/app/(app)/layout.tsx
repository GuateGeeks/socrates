import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BottomNav } from '@/components/navigation/BottomNav'
import type { UserRole } from '@/types/user'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role as UserRole

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pb-20">{children}</main>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-md">
          <BottomNav role={role} />
        </div>
      </div>
    </div>
  )
}
