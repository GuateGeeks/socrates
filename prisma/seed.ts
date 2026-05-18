import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const SALT_ROUNDS = 10

  const [adminHash, teacherHash, studentHash] = await Promise.all([
    bcrypt.hash('Admin1234!', SALT_ROUNDS),
    bcrypt.hash('Teacher1234!', SALT_ROUNDS),
    bcrypt.hash('Student1234!', SALT_ROUNDS),
  ])

  const admin = await prisma.user.upsert({
    where: { email: 'admin@guategeeks.gt' },
    update: {},
    create: {
      email: 'admin@guategeeks.gt',
      name: 'Admin',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@example.gt' },
    update: {},
    create: {
      email: 'teacher@example.gt',
      name: 'Teacher',
      passwordHash: teacherHash,
      role: 'TEACHER',
      context: {
        create: {
          educationLevel: 'PRIMARY',
          grade: '4',
          area: 'Matemáticas',
        },
      },
    },
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@example.gt' },
    update: {},
    create: {
      email: 'student@example.gt',
      name: 'Student',
      passwordHash: studentHash,
      role: 'STUDENT',
      context: {
        create: {
          educationLevel: 'PRIMARY',
          grade: '4',
          area: 'Matemáticas',
        },
      },
    },
  })

  console.log('Seeded users:', {
    admin: admin.email,
    teacher: teacher.email,
    student: student.email,
  })
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
