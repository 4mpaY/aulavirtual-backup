import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.escuela.count()
  console.log(`Total escuelas en BD: ${count}`)

  const deleteVacias = await prisma.escuela.deleteMany({
    where: {
      nombre: ''
    }
  })
  console.log(`Borradas ${deleteVacias.count} escuelas sin nombre.`)
  
  // Borrar también las que digan "escuela 2" múltiples veces si hay duplicados
  const deleteDuplicadas = await prisma.escuela.deleteMany({
    where: {
      nombre: 'escuela 2'
    }
  })
  console.log(`Borradas ${deleteDuplicadas.count} escuelas "escuela 2".`)

  const finalCount = await prisma.escuela.count()
  console.log(`Total final escuelas en BD: ${finalCount}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
