import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { TranscriptProvider } from '@/contexts/TranscriptContext'
import { EventProvider } from '@/contexts/EventContext'
import { RealtimeTalkClient } from '@/components/realtime/RealtimeTalkClient'
import type { SocratesRole } from '@/lib/realtime/agents'

export default async function TalkPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = (session.user.role ?? 'STUDENT') as SocratesRole
  const name = session.user.name ?? session.user.email ?? null

  return (
    <TranscriptProvider>
      <EventProvider>
        <RealtimeTalkClient userRole={role} userName={name} />
      </EventProvider>
    </TranscriptProvider>
  )
}
