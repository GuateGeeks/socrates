# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Socrates** — mobile-first, voice-oriented educational assistant for Guatemalan teachers and students built by GuateGeeks. Answers are grounded in the Guatemalan National Base Curriculum (CNB) via RAG. Full spec: `socrates_spec_v_1_guategeeks_english.md`.

## Commands

```bash
# Dev
npm run dev          # Next.js dev server on :3000
npm run worker       # BullMQ indexing worker (separate process, requires Redis)

# Quality
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm test             # tsx --test src/lib/*.test.ts src/lib/realtime/*.test.ts

# Database
npm run db:migrate   # prisma migrate dev
npm run db:generate  # prisma generate (after schema changes)
npm run db:seed      # seed initial data
npm run db:studio    # Prisma Studio UI

# Docker (full stack)
docker compose up    # app + worker + postgres (pgvector/pg16) + redis
```

## Required Environment Variables

Copy `.env.example` → `.env`. Key vars:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis for BullMQ |
| `NEXTAUTH_SECRET` | NextAuth signing key (`openssl rand -base64 32`) |
| `OPENAI_API_KEY` | Chat, embeddings, TTS, STT, Realtime API |
| `SOCRATES_API_KEY` | Shared secret for external RAG proxy (jarvis-ui) |

## Architecture

### Stack

Next.js 15 (App Router) + React 19, NextAuth v5, Prisma + PostgreSQL + pgvector, BullMQ + Redis, OpenAI SDK + `@openai/agents`.

### Key Data Flow

**RAG pipeline:**
1. Admin uploads CNB PDF via `/admin` → `POST /api/admin/documents`
2. Document metadata saved to `Document` table; content enqueued to BullMQ (`INDEXING_QUEUE_NAME`)
3. `npm run worker` (`src/worker.ts`) picks jobs, chunks text (512 tokens, 64 overlap), generates `text-embedding-3-small` embeddings, stores in `DocumentChunk` with `vector(1536)` column
4. Chat queries hit `POST /api/chat/route.ts` → `retrieveContext()` in `src/lib/rag.ts` does cosine similarity search via raw Prisma `$queryRaw` (pgvector `<->` operator), returns `CnbSource[]` attached to messages

**Voice / Realtime flow:**
1. `GET /api/realtime/session` issues ephemeral key from OpenAI Realtime API
2. Client (`src/hooks/useRealtimeSession.ts`) opens WebRTC connection via `@openai/agents` `RealtimeSession`
3. Agent definitions in `src/lib/realtime/agents.ts` — `teacherAgent` and `studentAgent` with bi-directional handoff; both carry `consultar_cnb` tool that POSTs to `/api/rag/query`
4. Role selects initial agent: `TEACHER`/`ADMIN` → `teacherAgent` first, `STUDENT` → `studentAgent` first

**Classic voice fallback (`src/hooks/useVoice.ts`):**
`POST /api/voice/transcribe` (Whisper) → `POST /api/chat` (RAG + GPT) → `POST /api/voice/synthesize` (TTS) → streamed audio via `AudioPlayer`

### Auth

NextAuth v5 credentials-only (bcrypt). Session carries `{ id, email, name, role }`. Three roles: `TEACHER`, `STUDENT`, `ADMIN`. Middleware (`src/middleware.ts`) gates all routes; `/admin/*` requires `ADMIN`. Public paths: `/login`, `/register`, `/api/auth`, `/api/health`, `/api/rag/search`.

### Route Groups

- `(auth)` — login/register pages, no bottom nav
- `(app)` — authenticated app shell with bottom nav (Talk, Explore, Create, History + role-specific tab)
- `admin` — document upload + indexing status, ADMIN only

### Important Conventions

- `src/lib/curriculumLevels.ts` maps between DB enum values (`PRIMARY`) and API string values (`primary`). Always use `toDbEducationLevel` / `toClientEducationLevel` when crossing that boundary — the RAG filter SQL depends on it.
- `src/lib/realtime/clientSecret.ts` holds model constants (`REALTIME_MODEL`, `REALTIME_TRANSCRIPTION_MODEL`) and the ephemeral key request builder.
- `src/lib/prompts.ts` holds system prompt templates for classic chat mode (non-realtime).
- Prisma `DocumentChunk.embedding` is typed as `Unsupported("vector(1536)")` — always use `$queryRaw`/`$executeRaw` for embedding operations, never the typed client.
