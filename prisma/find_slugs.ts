const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const cursos = await prisma.curso.findMany({
    select: {
      titulo: true,
      slug: true,
      miniatura: true
    }
  })
  
  cursos.forEach(c => {
    if (c.miniatura && c.miniatura.startsWith('/uploads')) {
        console.log(`SLUG: ${c.slug} | TITULO: ${c.titulo}`)
    }
  })
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
