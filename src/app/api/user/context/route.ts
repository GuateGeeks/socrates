import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const contextSchema = z.object({
  educationLevel: z
    .enum(['INITIAL', 'PRESCHOOL', 'PRIMARY', 'MIDDLE_SCHOOL', 'HIGH_SCHOOL'])
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

  return NextResponse.json(context)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = contextSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const context = await db.curriculumContext.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: {
      userId: session.user.id,
      educationLevel: parsed.data.educationLevel ?? 'PRIMARY',
      grade: parsed.data.grade ?? '4',
      area: parsed.data.area ?? 'Matemáticas',
    },
  })

  return NextResponse.json(context)
}
