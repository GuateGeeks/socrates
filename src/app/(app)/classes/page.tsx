import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
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
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function ChecklistIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <polyline points="3 6 4 7 6 5" />
      <polyline points="3 12 4 13 6 11" />
      <polyline points="3 18 4 19 6 17" />
    </svg>
  )
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  if (diffMinutes < 1) return 'ahora mismo'
  if (diffMinutes < 60) return `hace ${diffMinutes} min`
  if (diffHours < 24) return `hace ${diffHours} h`
  if (diffDays === 1) return 'ayer'
  if (diffDays < 7) return `hace ${diffDays} días`

  return date.toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

interface QuickAccessCard {
  label: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
}

const QUICK_ACCESS_CARDS: QuickAccessCard[] = [
  {
    label: 'Crear Actividad Rápida',
    description: 'Genera una actividad para tu clase en segundos',
    href: '/create',
    icon: <SparkleIcon />,
    color: 'bg-brand-50 text-brand-600 border-brand-100',
  },
  {
    label: 'Generar Plan de Clase',
    description: 'Plan completo con competencias e indicadores',
    href: '/create?type=lesson_plan',
    icon: <DocumentIcon />,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    label: 'Crear Rúbrica',
    description: 'Diseña criterios de evaluación claros',
    href: '/create?type=rubric',
    icon: <ChecklistIcon />,
    color: 'bg-violet-50 text-violet-600 border-violet-100',
  },
]

export default async function ClassesPage() {
  const session = await auth()

  if (!session || session.user.role !== 'TEACHER') {
    redirect('/talk')
  }

  const recentConversations = await db.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    take: 5,
    select: {
      id: true,
      title: true,
      updatedAt: true,
      messages: {
        orderBy: { createdAt: 'asc' },
        take: 1,
        select: { content: true, role: true },
      },
    },
  })

  return (
    <div className="px-4 pt-6 pb-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mis Clases</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestión y herramientas para docentes</p>
        </div>
        <button
          type="button"
          aria-label="Crear clase"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
        >
          <PlusIcon />
        </button>
      </div>

      {/* Coming soon banner */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
        <p className="text-sm font-medium text-amber-800">Gestión de clases — Próximamente en v1.1</p>
        <p className="text-xs text-amber-700 mt-0.5">
          Asistencia, progreso de alumnos y organización por grupos llegarán en la siguiente versión.
        </p>
      </div>

      {/* Quick access section */}
      <section aria-labelledby="quick-access-heading">
        <h2 id="quick-access-heading" className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Acceso rápido
        </h2>
        <div className="space-y-2">
          {QUICK_ACCESS_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={[
                'flex items-center gap-3 rounded-xl border px-4 py-3',
                'hover:shadow-sm active:scale-[0.98] transition-all',
                card.color,
              ].join(' ')}
            >
              <span className="flex-shrink-0">{card.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight">{card.label}</p>
                <p className="text-xs opacity-75 mt-0.5 leading-snug">{card.description}</p>
              </div>
              <span className="flex-shrink-0 opacity-50">
                <ChevronRightIcon />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent conversations section */}
      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Conversaciones recientes
        </h2>

        {recentConversations.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-100 px-4 py-8 text-center">
            <p className="text-sm text-gray-400">Aún no tienes conversaciones.</p>
            <p className="text-xs text-gray-400 mt-1">
              Ve a{' '}
              <Link href="/talk" className="text-brand-500 hover:underline">
                Hablar
              </Link>{' '}
              para comenzar.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {recentConversations.map((conv) => {
              const firstUserMessage = conv.messages.find((m) => m.role === 'user')
              const displayTitle =
                conv.title ??
                (firstUserMessage ? truncate(firstUserMessage.content, 60) : 'Conversación sin título')

              return (
                <li key={conv.id}>
                  <div className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug truncate">
                        {displayTitle}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatRelativeDate(conv.updatedAt)}
                      </p>
                    </div>
                    <Link
                      href={`/talk?conversationId=${conv.id}`}
                      className="flex-shrink-0 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex items-center"
                    >
                      Continuar
                    </Link>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
