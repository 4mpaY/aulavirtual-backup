import { PrismaClient } from '@prisma/client'

const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL || ''

  if (!url || url.includes('connection_limit')) return url

  const separator = url.includes('?') ? '&' : '?'

  return `${url}${separator}connection_limit=10&pool_timeout=30`
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

// Reusar la instancia tanto en desarrollo como en producción
const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

globalForPrisma.prisma = prisma

export default prisma
