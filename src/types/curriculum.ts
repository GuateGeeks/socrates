export type EducationLevel = 'initial' | 'preschool' | 'primary' | 'middle_school' | 'high_school'

export type CurriculumArea = string

export interface CurriculumContext {
  educationLevel: EducationLevel
  grade: string
  area: CurriculumArea
}

export interface Competency {
  id: string
  code: string
  description: string
  level: EducationLevel
  grade: string
  area: CurriculumArea
}

export interface AchievementIndicator {
  id: string
  description: string
  competencyId: string
}

export interface CnbSource {
  documentId: string
  chunkId: string
  title: string
  level: EducationLevel
  grade?: string
  area?: string
  competency?: string
  indicator?: string
  excerpt: string
  relevanceScore: number
}

export interface CnbChunk {
  id: string
  content: string
  metadata: {
    documentId: string
    title: string
    level?: EducationLevel
    grade?: string
    area?: string
    chunkIndex: number
  }
}

export const EDUCATION_LEVELS: Record<EducationLevel, string> = {
  initial: 'Educación Inicial',
  preschool: 'Preprimaria',
  primary: 'Primaria',
  middle_school: 'Básico',
  high_school: 'Diversificado',
}

export const GRADES_BY_LEVEL: Record<EducationLevel, string[]> = {
  initial: ['0'],
  preschool: ['Párvulos 1', 'Párvulos 2', 'Párvulos 3'],
  primary: ['1', '2', '3', '4', '5', '6'],
  middle_school: ['1', '2', '3'],
  high_school: ['4', '5', '6'],
}

export const CNB_AREAS: CurriculumArea[] = [
  'Comunicación y Lenguaje',
  'Matemáticas',
  'Ciencias Naturales y Tecnología',
  'Ciencias Sociales y Formación Ciudadana',
  'Expresión Artística',
  'Educación Física',
]
