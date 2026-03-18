const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const curso = await prisma.curso.findUnique({
    where: { slug: 'iso-55000-fundamentos-gestion-activos' },
    include: {
      modulos: {
        include: {
          lecciones: true
        }
      }
    }
  })

  if (curso) {
    console.log('✅ Curso encontrado:', curso.titulo)
    console.log('Módulos:', curso.modulos.length)
    console.log('Lecciones en el primer módulo:', curso.modulos[0]?.lecciones.length)
  } else {
    console.log('❌ Curso NO encontrado.')
  }
}

main().finally(() => prisma.$disconnect())
