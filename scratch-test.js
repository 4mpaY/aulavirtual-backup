const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    const cursoInclude = {
      profesor: {
        select: { id: true, nombre: true, apellido: true, avatar: true }
      },
      categoria: {
        select: { id: true, nombre: true }
      },
      firmante_1: {
        select: { id: true, nombre: true, cargo: true }
      },
      firmante_2: {
        select: { id: true, nombre: true, cargo: true }
      },
      modulos: {
        orderBy: { orden: 'asc' },
        include: {
          lecciones: {
            orderBy: { orden: 'asc' },
            select: {
              id: true,
              titulo: true,
              orden: true,
              duracion: true,
              video_url: true,
              recursos: true,
              es_vista_previa: true,
              contenido: true,
              estado: true,
              es_en_vivo: true,
              es_pdf: true,
              fecha_programada: true,
              enlace_reunion: true,
            }
          },
          examenes: {
            orderBy: { orden: 'asc' },
            select: {
              id: true,
              titulo: true,
              tipo: true,
              peso: true,
              progreso_minimo: true,
              orden: true,
              puntaje_aprobacion: true,
              intentos_maximos: true,
              esta_publicado: true,
              limite_tiempo: true,
              modulo_id: true,
              _count: { select: { preguntas: true } }
            }
          },
          actividades: {
            orderBy: { orden: 'asc' },
            select: {
              id: true,
              titulo: true,
              tipo: true,
              orden: true,
              puntaje_maximo: true,
              esta_publicado: true,
              modulo_id: true,
              _count: { select: { preguntas: true, entregas: true } }
            }
          }
        }
      },
      _count: {
        select: { modulos: true, inscripciones: true }
      }
    }
    const curso = await prisma.curso.findFirst({
      include: cursoInclude
    })
    console.log("Success:", !!curso)
  } catch (e) {
    console.error("Prisma error:", e)
  }
}
main()
