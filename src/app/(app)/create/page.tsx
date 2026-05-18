import { auth } from '@/lib/auth'
import { CreatePageClient } from './CreatePageClient'

export default async function CreatePage() {
  const session = await auth()
  const role = session?.user?.role ?? 'STUDENT'

  return <CreatePageClient role={role} />
}
