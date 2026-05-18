import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'Hace un momento'
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`
  if (diffHours < 24) return `Hace ${diffHours} h`
  if (diffDays === 1) return 'Ayer'
  if (diffDays < 7) return `Hace ${diffDays} días`

  return date.toLocaleDateString('es-GT', {
    day: 'numeric',
    month: 'short',
    year: diffDays > 365 ? 'numeric' : undefined,
  })
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

interface ConversationWithLastMessage {
  id: string
  title: string | null
  updatedAt: Date
  _count: { messages: number }
  messages: { role: string; content: string }[]
}

function ConversationItem({ conversation }: { conversation: ConversationWithLastMessage }) {
  const lastMessage = conversation.messages[0]
  const previewText = lastMessage
    ? truncate(lastMessage.content, 80)
    : 'Conversación sin mensajes'

  const displayTitle = conversation.title
    ? truncate(conversation.title, 50)
    : lastMessage
    ? truncate(lastMessage.content, 50)
    : 'Conversación'

  return (
    <Link
      href={`/talk?conversationId=${conversation.id}`}
      className="flex items-start gap-3 bg-white rounded-2xl border border-gray-200 px-4 py-3.5 hover:border-brand-300 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-all active:scale-[0.98] group"
      aria-label={`Continuar conversación: ${displayTitle}`}
    >
      <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center mt-0.5">
        <ChatBubbleIcon className="w-5 h-5 text-brand-600" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 truncate">{displayTitle}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{previewText}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-gray-400">
            {formatRelativeDate(conversation.updatedAt)}
          </span>
          <span className="text-gray-300" aria-hidden="true">·</span>
          <span className="text-xs text-gray-400">
            {conversation._count.messages}{' '}
            {conversation._count.messages === 1 ? 'mensaje' : 'mensajes'}
          </span>
        </div>
      </div>

      <ChevronRightIcon className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-brand-500 transition-colors mt-0.5" />
    </Link>
  )
}

export default async function HistoryPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/login')
  }

  const conversations = await db.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 50,
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        select: { role: true, content: true },
      },
      _count: {
        select: { messages: true },
      },
    },
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Historial</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {conversations.length > 0
            ? `${conversations.length} conversación${conversations.length !== 1 ? 'es' : ''}`
            : 'Sin conversaciones'}
        </p>
      </header>

      <div className="flex-1 px-4 py-5">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
              <ChatBubbleIcon className="w-10 h-10 text-brand-400" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-gray-700">
                Aún no tienes conversaciones
              </p>
              <p className="text-sm text-gray-500 max-w-xs">
                ¡Empieza hablando con Sócrates!
              </p>
            </div>
            <Link
              href="/talk"
              className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
            >
              Iniciar conversación
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
