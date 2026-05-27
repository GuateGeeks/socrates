export interface CnbToolArgs {
  consulta: string
  nivel?: string
  grado?: string | number
  area?: string
}

interface CnbQueryBody {
  query: string
  topK: number
  filter?: {
    level?: string
    grade?: string
    area?: string
  }
}

export interface CnbToolSource {
  title: string
  excerpt: string
  area?: string
  grade?: string
}

const AREA_ALIASES: Record<string, string> = {
  'comunicacion y lenguaje': 'Comunicación y Lenguaje',
  'comunicacion lenguaje': 'Comunicación y Lenguaje',
  'comunicación y lenguaje': 'Comunicación y Lenguaje',
  'comunicación lenguaje': 'Comunicación y Lenguaje',
  lenguaje: 'Comunicación y Lenguaje',
  'lenguaje y literatura': 'Comunicación y Lenguaje',
  literatura: 'Comunicación y Lenguaje',
  espanol: 'Comunicación y Lenguaje',
  español: 'Comunicación y Lenguaje',
  idioma: 'Comunicación y Lenguaje',
  'idioma español': 'Comunicación y Lenguaje',
  matematica: 'Matemáticas',
  matematicas: 'Matemáticas',
  matemática: 'Matemáticas',
  matemáticas: 'Matemáticas',
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
}

function compactFilter(filter: CnbQueryBody['filter']): CnbQueryBody['filter'] | undefined {
  if (!filter) return undefined

  const compacted = Object.fromEntries(
    Object.entries(filter).filter(([, value]) => typeof value === 'string' && value.length > 0),
  ) as NonNullable<CnbQueryBody['filter']>

  return Object.keys(compacted).length > 0 ? compacted : undefined
}

function buildQueryBody(args: CnbToolArgs, filter?: CnbQueryBody['filter']): CnbQueryBody {
  const compactedFilter = compactFilter(filter)

  return {
    query: args.consulta,
    topK: 5,
    ...(compactedFilter ? { filter: compactedFilter } : {}),
  }
}

export function normalizeCnbArea(area?: string): string | undefined {
  if (!area) return undefined

  const trimmed = area.trim()
  if (!trimmed) return undefined

  return AREA_ALIASES[normalizeKey(trimmed)] ?? trimmed
}

export function normalizeCnbGrade(grade?: string | number): string | undefined {
  if (typeof grade === 'number' && Number.isFinite(grade)) {
    return String(grade)
  }

  if (typeof grade !== 'string') return undefined

  const trimmed = grade.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function buildCnbQueryAttempts(args: CnbToolArgs): CnbQueryBody[] {
  const normalizedArea = normalizeCnbArea(args.area)
  const normalizedGrade = normalizeCnbGrade(args.grado)
  const narrowFilter = compactFilter({
    level: args.nivel,
    grade: normalizedGrade,
    area: normalizedArea,
  })
  const gradeFilter = compactFilter({
    level: args.nivel,
    grade: normalizedGrade,
  })

  const attempts = [
    buildQueryBody(args, narrowFilter),
    buildQueryBody(args, gradeFilter),
    buildQueryBody(args),
  ]

  return attempts.filter((attempt, index, all) => {
    const serialized = JSON.stringify(attempt)
    return all.findIndex((candidate) => JSON.stringify(candidate) === serialized) === index
  })
}

export function formatCnbSources(sources: CnbToolSource[]): string {
  if (!sources.length) {
    return 'No se encontró información específica en el CNB para esta consulta.'
  }

  return sources
    .map(
      (source, index) =>
        `[Fuente ${index + 1}: ${source.title}${source.area ? ` - ${source.area}` : ''}${source.grade ? `, ${source.grade}° grado` : ''}]\n${source.excerpt}`,
    )
    .join('\n\n---\n\n')
}

export function formatCnbToolError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('Invalid JSON input')) {
    return 'Los argumentos no llegaron con formato válido. No repitas la misma llamada; responde con orientación general y pide un dato específico si hace falta.'
  }

  return 'Error al consultar el CNB. Responde con información general y aclara que no se pudo verificar la fuente en este momento.'
}
