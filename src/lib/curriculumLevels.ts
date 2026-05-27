import type { EducationLevel } from '@/types/curriculum'

export const CLIENT_TO_DB_EDUCATION_LEVEL: Record<EducationLevel, string> = {
  initial: 'INITIAL',
  preschool: 'PRESCHOOL',
  primary: 'PRIMARY',
  middle_school: 'MIDDLE_SCHOOL',
  high_school: 'HIGH_SCHOOL',
}

export const DB_TO_CLIENT_EDUCATION_LEVEL: Record<string, EducationLevel> = {
  INITIAL: 'initial',
  PRESCHOOL: 'preschool',
  PRIMARY: 'primary',
  MIDDLE_SCHOOL: 'middle_school',
  HIGH_SCHOOL: 'high_school',
}

export function toDbEducationLevel(level?: string | null): string | undefined {
  if (!level) return undefined
  return CLIENT_TO_DB_EDUCATION_LEVEL[level as EducationLevel] ?? level
}

export function toClientEducationLevel(level?: string | null): EducationLevel | undefined {
  if (!level) return undefined
  return DB_TO_CLIENT_EDUCATION_LEVEL[level] ?? (level as EducationLevel)
}
