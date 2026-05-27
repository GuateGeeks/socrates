import { z } from 'zod'

export const MODERATION_CATEGORIES = ['OFFENSIVE', 'OFF_BRAND', 'VIOLENCE', 'NONE'] as const
export type ModerationCategory = (typeof MODERATION_CATEGORIES)[number]
export const ModerationCategoryZod = z.enum([...MODERATION_CATEGORIES])

export type SessionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED'

export interface GuardrailResultType {
  status: 'IN_PROGRESS' | 'DONE'
  testText?: string
  category?: ModerationCategory
  rationale?: string
}

export interface TranscriptItem {
  itemId: string
  type: 'MESSAGE' | 'BREADCRUMB'
  role?: 'user' | 'assistant'
  title?: string
  data?: Record<string, any>
  expanded: boolean
  timestamp: string
  createdAtMs: number
  status: 'IN_PROGRESS' | 'DONE'
  isHidden: boolean
  guardrailResult?: GuardrailResultType
}

export interface LoggedEvent {
  id: string
  direction: 'client' | 'server'
  expanded: boolean
  timestamp: string
  eventName: string
  eventData: Record<string, any>
}

export const GuardrailOutputZod = z.object({
  moderationRationale: z.string(),
  moderationCategory: ModerationCategoryZod,
  testText: z.string().optional(),
})

export type GuardrailOutput = z.infer<typeof GuardrailOutputZod>
