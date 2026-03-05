const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const userId = '2aa2acfd-ebf0-422a-9fc9-660311292be6' // María Estudiante
  
  // Obtener cursos publicados
  const cursos = await prisma.curso.findMany({
    where: { estado: 'PUBLICADO' }
  })

  console.log(`Encontrados ${cursos.length} cursos publicados.`)

  for (const curso of cursos) {
    try {
      // Crear inscripción
      await prisma.inscripcion.upsert({
        where: {
          usuario_id_curso_id: {
            usuario_id: userId,
            curso_id: curso.id
          }
        },
        update: {
            estado: 'ACTIVO'
        },
        create: {
          usuario_id: userId,
          curso_id: curso.id,
          estado: 'ACTIVO'
        }
      })

      // Crear progreso aleatorio
      const progreso = Math.floor(Math.random() * 100)
      await prisma.progresoCurso.upsert({
        where: {
          usuario_id_curso_id: {
            usuario_id: userId,
            curso_id: curso.id
          }
        },
        update: {
            porcentaje_progreso: progreso
        },
        create: {
            usuario_id: userId,
            curso_id: curso.id,
            porcentaje_progreso: progreso
        }
      })

      console.log(`Usuario inscrito en: ${curso.titulo} con progreso ${progreso}%`)
    } catch (e) {
      console.error(`Error procesando curso ${curso.titulo}:`, e.message)
    }
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
