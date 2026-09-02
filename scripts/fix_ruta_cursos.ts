import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Sincronizando inscripciones a rutas con cursos...')

  const inscripcionesRuta = await prisma.inscripcionRuta.findMany({
    include: {
      ruta: {
        include: {
          cursos: true
        }
      }
    }
  })

  console.log(`Se encontraron ${inscripcionesRuta.length} inscripciones a rutas.`)

  for (const ir of inscripcionesRuta) {
    const usuarioId = ir.usuario_id
    const cursosDeRuta = ir.ruta.cursos

    const inscripcionesActuales = await prisma.inscripcion.findMany({
      where: { usuario_id: usuarioId },
      select: { curso_id: true }
    })

    const cursosActualesIds = new Set(inscripcionesActuales.map(i => i.curso_id))
    const cursosFaltantes = cursosDeRuta.filter(c => !cursosActualesIds.has(c.curso_id))

    if (cursosFaltantes.length > 0) {
      console.log(`Agregando ${cursosFaltantes.length} cursos al usuario ${usuarioId} de la ruta ${ir.ruta.titulo}`)
      
      await Promise.all(
        cursosFaltantes.map(c => 
          prisma.inscripcion.create({
            data: {
              usuario_id: usuarioId,
              curso_id: c.curso_id,
              estado: 'ACTIVO',
              inscrito_en: new Date()
            }
          })
        )
      )
    }
  }

  console.log('Proceso terminado exitosamente.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
