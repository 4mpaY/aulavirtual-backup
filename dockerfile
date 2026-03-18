# Fase 1: Base (Instalación de herramientas necesarias)
FROM node:20-alpine AS base

# Dependencias necesarias para Prisma y Alpine
RUN apk add --no-cache libc6-compat openssl

# Habilitar pnpm
RUN corepack enable pnpm

# Fase 2: Dependencias
FROM base AS deps
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Instalar TODAS las dependencias congelando el lockfile
RUN pnpm install --frozen-lockfile

# Fase 3: Construcción de la aplicación (Builder)
FROM base AS builder
WORKDIR /app

# Copiar las dependencias de la fase anterior
COPY --from=deps /app/node_modules ./node_modules
# Copiar el resto del código fuente
COPY . .

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Generar el cliente de Prisma para producción
RUN pnpm run db:client:generate

# Compilar Next.js (esto generará .next/standalone si next.config.js está bien configurado)
RUN pnpm run build

# Fase 4: Producción (Runner ultra-ligero)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Definir puerto por defecto (Coolify lo usará)
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Crear un usuario y grupo sin privilegios de root por seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar carpeta public entera (para que Coolify la mantenga a salvo)
COPY --from=builder /app/public ./public

# Crear el directorio uploads y asignar permisos para subir imgs y pdfs
RUN mkdir -p /app/public/uploads && chown nextjs:nodejs /app/public/uploads

# Configurar permisos para la caché de pre-renderizado de Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# -- COPIAR EL STANDALONE DE NEXT.JS --
# standalone contiene el propio motor de Node.js minimizado y solo los paquetes estrictamente necesarios.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar la carpeta Prisma por si se necesitan ejecutar comandos como migeraciones desde bash en el VPS
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Utilizar el nuevo usuario por seguridad
USER nextjs

EXPOSE 3000

# El build standalone genera un servidor propio con nombre server.js
CMD ["node", "server.js"]
