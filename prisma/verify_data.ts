import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  console.log('🔍 Verificando detalle de todos los cursos...')
  
  const courses = await prisma.curso.findMany({
    include: {
      modulos: {
        include: {
          lecciones: true
        }
      }
    }
  })
  
  courses.forEach(c => {
    console.log(`\nCurso: ${c.titulo} (Slug: ${c.slug}, Estado: ${c.estado})`)
    console.log(`Módulos: ${c.modulos.length}`)
    c.modulos.forEach(m => {
      console.log(`  - Módulo: ${m.titulo} (${m.lecciones.length} lecciones)`)
    })
  })
}

verify().finally(() => prisma.$disconnect())
