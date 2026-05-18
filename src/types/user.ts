import type { CnbSource, CurriculumContext } from './curriculum'

export type UserRole = 'TEACHER' | 'STUDENT' | 'ADMIN'

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: UserRole
}

export interface UserSession {
  user: SessionUser
  expires: string
}

export interface TeacherContext {
  schoolName?: string
  classNames?: string[]
}

export interface StudentContext {
  grade?: string
  section?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  audioUrl?: string
  sources?: CnbSource[]
  createdAt: Date
}

export interface ChatRequest {
  message: string
  conversationId?: string
  curriculumContext?: CurriculumContext
}

export interface ChatResponse {
  answer: string
  sources: CnbSource[]
  conversationId: string
  messageId: string
  spokenSummary?: string
}
