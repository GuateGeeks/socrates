import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { z } from 'zod'
import { authConfig } from './auth.config'

const credentialsSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await db.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, role: true, passwordHash: true },
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)
        if (!passwordMatch) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
})
