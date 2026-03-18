import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const cursos = await prisma.curso.findMany({
    select: {
      titulo: true,
      slug: true,
      miniatura: true
    }
  })
  
  console.log('--- CURSOS Y MINIATURAS ---')
  cursos.forEach(c => {
    console.log(`- ${c.titulo}: ${c.miniatura || 'SIN IMAGEN'}`)
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
