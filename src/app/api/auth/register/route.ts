import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().min(1),
  password: z.string().min(8),
  role: z.enum(['TEACHER', 'STUDENT']),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido.' }, { status: 400 })
  }

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos.', details: parsed.error.flatten().fieldErrors },
      { status: 422 },
    )
  }

  const { name, email, password, role } = parsed.data

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
      })

      await tx.curriculumContext.create({
        data: {
          userId: user.id,
        },
      })
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con ese correo electrónico.' },
        { status: 409 },
      )
    }
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Intenta de nuevo.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
