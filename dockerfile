# Fase 1: base
FROM node:20-slim AS base

RUN apt-get update && apt-get install -y \
    openssl \
    libc6 \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@9.0.0

# Fase 2: dependencias
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile
RUN pnpm rebuild sharp

# Fase 3: build
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Solo si tu app usa este valor en build-time
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN pnpm run db:client:generate
RUN rm -rf .next
RUN pnpm run build

# Fase 4: runtime
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update && apt-get install -y \
    openssl \
    libc6 \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd --gid 1001 nodejs && useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

COPY --from=builder /app/public ./public

RUN mkdir -p /app/public/uploads/cursos /app/public/uploads/perfil /app/public/uploads/firmas
RUN chown -R nextjs:nodejs /app/public

RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
