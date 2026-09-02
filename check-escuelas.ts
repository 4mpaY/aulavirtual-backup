import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const escuelas = await prisma.escuela.findMany()
  console.log('Escuelas in DB:', escuelas.length)
  console.log(escuelas)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
