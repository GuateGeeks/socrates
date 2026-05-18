import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

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

function QuizIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function StepsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

function RepeatIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
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

interface PracticeCard {
  label: string
  description: string
  prompt: string
  icon: React.ReactNode
  gradient: string
  textColor: string
}

const PRACTICE_CARDS: PracticeCard[] = [
  {
    label: 'Comenzar Quiz',
    description: 'Pon a prueba lo que sabes',
    prompt: 'Hazme un quiz sobre el tema que estamos estudiando',
    icon: <QuizIcon />,
    gradient: 'from-brand-500 to-brand-600',
    textColor: 'text-white',
  },
  {
    label: 'Ejercicios Guiados',
    description: 'Aprende paso a paso con ejemplos',
    prompt: 'Dame ejercicios de práctica paso a paso',
    icon: <StepsIcon />,
    gradient: 'from-emerald-500 to-emerald-600',
    textColor: 'text-white',
  },
  {
    label: 'Repasar Tema',
    description: 'Repasa con preguntas y respuestas',
    prompt: 'Ayúdame a repasar el tema con preguntas y respuestas',
    icon: <RepeatIcon />,
    gradient: 'from-violet-500 to-violet-600',
    textColor: 'text-white',
  },
]

export default async function PracticePage() {
  const session = await auth()

  if (!session || session.user.role !== 'STUDENT') {
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
      <div>
        <h1 className="text-xl font-bold text-gray-900">Práctica</h1>
        <p className="text-sm text-gray-500 mt-0.5">Elige cómo quieres aprender hoy</p>
      </div>

      {/* Motivational message */}
      <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 px-4 py-3 flex gap-3 items-start">
        <span className="text-xl leading-none mt-0.5" role="img" aria-label="Bombillo">
          💡
        </span>
        <p className="text-sm text-amber-800 font-medium leading-snug">
          ¡Sigue aprendiendo, cada pregunta te hace más inteligente!
        </p>
      </div>

      {/* Practice cards */}
      <section aria-labelledby="practice-heading">
        <h2 id="practice-heading" className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Actividades de práctica
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {PRACTICE_CARDS.map((card) => {
            const href = `/talk?prompt=${encodeURIComponent(card.prompt)}`
            return (
              <Link
                key={card.label}
                href={href}
                className={[
                  'flex items-center gap-4 rounded-xl px-4 py-4 bg-gradient-to-r shadow-sm',
                  'hover:shadow-md active:scale-[0.98] transition-all',
                  card.gradient,
                  card.textColor,
                ].join(' ')}
              >
                <span className="flex-shrink-0 opacity-90">{card.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold leading-tight">{card.label}</p>
                  <p className="text-xs opacity-80 mt-0.5">{card.description}</p>
                </div>
                <span className="flex-shrink-0 opacity-70">
                  <ChevronRightIcon />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Recent study sessions */}
      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Sesiones de estudio recientes
        </h2>

        {recentConversations.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-100 px-4 py-8 text-center">
            <p className="text-sm text-gray-400">Aún no tienes sesiones de estudio.</p>
            <p className="text-xs text-gray-400 mt-1">
              Comienza con una de las actividades de arriba o ve a{' '}
              <Link href="/talk" className="text-brand-500 hover:underline">
                Hablar
              </Link>
              .
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {recentConversations.map((conv) => {
              const firstUserMessage = conv.messages.find((m) => m.role === 'user')
              const displayTitle =
                conv.title ??
                (firstUserMessage ? truncate(firstUserMessage.content, 60) : 'Sesión de estudio')

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
