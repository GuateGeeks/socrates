import type { NextAuthConfig } from 'next-auth'
import type { Role } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: { id: string; role: Role } & import('next-auth').DefaultSession['user']
  }
  interface User {
    role: Role
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    role: Role
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as { role: Role }).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
