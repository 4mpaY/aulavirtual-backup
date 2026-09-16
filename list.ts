import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const escuelas = await prisma.escuela.findMany()
  console.log('Escuelas completas:', JSON.stringify(escuelas, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
