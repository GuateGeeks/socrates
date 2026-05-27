FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production web app (Next.js standalone)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next-app/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next-app/static ./.next-app/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

# Worker (BullMQ, needs tsx + full source)
FROM base AS worker
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

CMD ["npx", "tsx", "src/worker.ts"]
