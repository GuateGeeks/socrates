import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { DocumentUploadForm } from './DocumentUploadForm'
import { EDUCATION_LEVELS } from '@/types/curriculum'
import type { EducationLevel as PrismaEducationLevel } from '@prisma/client'
import type { EducationLevel } from '@/types/curriculum'

const PRISMA_TO_CURRICULUM_LEVEL: Record<PrismaEducationLevel, EducationLevel> = {
  INITIAL: 'initial',
  PRESCHOOL: 'preschool',
  PRIMARY: 'primary',
  MIDDLE_SCHOOL: 'middle_school',
  HIGH_SCHOOL: 'high_school',
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('es-GT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

interface StatCardProps {
  label: string
  value: number | string
  description?: string
  accent?: 'brand' | 'emerald' | 'amber' | 'violet'
}

function StatCard({ label, value, description, accent = 'brand' }: StatCardProps) {
  const accentClasses = {
    brand: 'text-brand-600 bg-brand-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    violet: 'text-violet-600 bg-violet-50',
  } as const

  return (
    <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accentClasses[accent].split(' ')[0]}`}>{value}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  )
}

export default async function AdminPage() {
  const session = await auth()
  const adminName = session?.user?.name ?? 'Administrador'

  const [totalConversations, totalUsers, documents] = await Promise.all([
    db.conversation.count(),
    db.user.count(),
    db.document.findMany({
      take: 20,
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        title: true,
        level: true,
        grade: true,
        area: true,
        indexed: true,
        chunkCount: true,
        uploadedAt: true,
      },
    }),
  ])

  const totalDocuments = documents.length
  const indexedDocuments = documents.filter((d) => d.indexed).length
  const pendingDocuments = totalDocuments - indexedDocuments

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <p className="text-sm text-gray-500">Bienvenido,</p>
        <h2 className="text-lg font-bold text-gray-900">{adminName}</h2>
      </div>

      {/* Stats */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Resumen del sistema
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Documentos"
            value={totalDocuments}
            description={`${indexedDocuments} indexados`}
            accent="brand"
          />
          <StatCard
            label="En Cola"
            value={pendingDocuments}
            description="Pendientes de indexar"
            accent="amber"
          />
          <StatCard
            label="Conversaciones"
            value={totalConversations}
            description="Total histórico"
            accent="emerald"
          />
          <StatCard
            label="Usuarios"
            value={totalUsers}
            description="Registrados"
            accent="violet"
          />
        </div>
      </section>

      {/* Upload section */}
      <section aria-labelledby="upload-heading">
        <h2 id="upload-heading" className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Cargar Documento CNB
        </h2>
        <div className="rounded-xl bg-white border border-gray-100 p-4 shadow-sm">
          <DocumentUploadForm />
        </div>
      </section>

      {/* Indexing status */}
      <section aria-labelledby="indexing-heading">
        <h2 id="indexing-heading" className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Estado de Indexación
        </h2>

        {documents.length === 0 ? (
          <div className="rounded-xl bg-white border border-gray-100 px-4 py-8 text-center shadow-sm">
            <p className="text-sm text-gray-400">No hay documentos cargados aún.</p>
            <p className="text-xs text-gray-400 mt-1">
              Usa el formulario de arriba para subir el primer documento CNB.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {documents.map((doc) => {
              const levelKey = doc.level ? PRISMA_TO_CURRICULUM_LEVEL[doc.level] : null
              const levelLabel = levelKey ? EDUCATION_LEVELS[levelKey] : null

              return (
                <li
                  key={doc.id}
                  className="rounded-xl bg-white border border-gray-100 px-4 py-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug truncate">
                        {doc.title}
                      </p>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                        {levelLabel && (
                          <span className="text-xs text-gray-500">{levelLabel}</span>
                        )}
                        {doc.grade && (
                          <span className="text-xs text-gray-500">Grado {doc.grade}</span>
                        )}
                        {doc.area && (
                          <span className="text-xs text-gray-500">{doc.area}</span>
                        )}
                        <span className="text-xs text-gray-400">{formatDate(doc.uploadedAt)}</span>
                      </div>
                      {doc.indexed && doc.chunkCount > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {doc.chunkCount} fragmentos indexados
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      {doc.indexed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Indexado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="animate-spin"
                            aria-hidden="true"
                          >
                            <line x1="12" y1="2" x2="12" y2="6" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                            <line x1="2" y1="12" x2="6" y2="12" />
                            <line x1="18" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                          </svg>
                          Pendiente
                        </span>
                      )}
                    </div>
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
