import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const cursos = await prisma.curso.findMany({
    orderBy: [
      { orden: 'asc' },
      { creado_en: 'asc' } // Para desempatar los duplicados
    ]
  })

  for (let i = 0; i < cursos.length; i++) {
    await prisma.curso.update({
      where: { id: cursos[i].id },
      data: { orden: i + 1 }
    })
  }

  console.log('Órdenes de cursos reasignados secuencialmente')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
