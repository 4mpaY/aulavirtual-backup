import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Marcando cursos como completados para jose@gmail.com...')

  const usuario = await prisma.usuario.findUnique({
    where: { correo: 'jose@gmail.com' }
  })

  if (!usuario) {
    console.error('No se encontró el usuario jose@gmail.com')
    return
  }

  // Obtener inscripciones a ruta del usuario
  const inscripcionesRuta = await prisma.inscripcionRuta.findMany({
    where: { usuario_id: usuario.id },
    include: {
      ruta: {
        include: {
          cursos: {
            include: {
              curso: {
                include: {
                  modulos: {
                    include: {
                      lecciones: true
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  for (const ir of inscripcionesRuta) {
    console.log(`Procesando ruta: ${ir.ruta.titulo}`)
    for (const cursoEnRuta of ir.ruta.cursos) {
      const curso = cursoEnRuta.curso
      console.log(`- Completando curso: ${curso.titulo}`)

      // Marcar todas las lecciones como completadas
      for (const modulo of curso.modulos) {
        for (const leccion of modulo.lecciones) {
          await prisma.progresoLeccion.upsert({
            where: {
              usuario_id_leccion_id: {
                usuario_id: usuario.id,
                leccion_id: leccion.id
              }
            },
            create: {
              usuario_id: usuario.id,
              leccion_id: leccion.id,
              esta_completado: true,
              completado_en: new Date()
            },
            update: {
              esta_completado: true,
              completado_en: new Date()
            }
          })
        }
      }

      // Marcar el progreso del curso como 100%
      await prisma.progresoCurso.upsert({
        where: {
          usuario_id_curso_id: {
            usuario_id: usuario.id,
            curso_id: curso.id
          }
        },
        create: {
          usuario_id: usuario.id,
          curso_id: curso.id,
          porcentaje_progreso: 100
        },
        update: {
          porcentaje_progreso: 100
        }
      })

      // Marcar inscripción como COMPLETADO
      await prisma.inscripcion.update({
        where: {
          usuario_id_curso_id: {
            usuario_id: usuario.id,
            curso_id: curso.id
          }
        },
        data: {
          estado: 'COMPLETADO',
          completado_en: new Date()
        }
      })
    }
  }

  console.log('Todos los cursos de las rutas han sido completados.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
