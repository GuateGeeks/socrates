import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { toClientEducationLevel, toDbEducationLevel } from '@/lib/curriculumLevels'
import { z } from 'zod'
import type { EducationLevel as DbEducationLevel } from '@prisma/client'

const contextSchema = z.object({
  educationLevel: z
    .enum([
      'initial',
      'preschool',
      'primary',
      'middle_school',
      'high_school',
      'INITIAL',
      'PRESCHOOL',
      'PRIMARY',
      'MIDDLE_SCHOOL',
      'HIGH_SCHOOL',
    ])
    .optional(),
  grade: z.string().min(1).max(20).optional(),
  area: z.string().min(1).max(100).optional(),
})

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const context = await db.curriculumContext.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(
    context
      ? {
          ...context,
          educationLevel: toClientEducationLevel(context.educationLevel),
        }
      : null,
  )
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = contextSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const educationLevel = toDbEducationLevel(parsed.data.educationLevel) as
    | DbEducationLevel
    | undefined

  const context = await db.curriculumContext.upsert({
    where: { userId: session.user.id },
    update: {
      ...parsed.data,
      educationLevel,
    },
    create: {
      userId: session.user.id,
      educationLevel: educationLevel ?? 'PRIMARY',
      grade: parsed.data.grade ?? '4',
      area: parsed.data.area ?? 'Matemáticas',
    },
  })

  return NextResponse.json({
    ...context,
    educationLevel: toClientEducationLevel(context.educationLevel),
  })
}
