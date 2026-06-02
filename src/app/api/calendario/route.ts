export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'

const COLORS = {
  CLASE_VIVO: '#1565C0',
  EXAMEN: '#C62828',
  CURSO_INICIO: '#2E7D32',
  CURSO_FIN: '#E65100'
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { searchParams } = new URL(request.url)
    const ahora = new Date()
    const desde = searchParams.get('desde')
      ? new Date(searchParams.get('desde')!)
      : new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
    const hasta = searchParams.get('hasta')
      ? new Date(searchParams.get('hasta')!)
      : new Date(ahora.getFullYear(), ahora.getMonth() + 4, 0)

    const userId = auth.user.id
    const rol = auth.user.rol
    const eventos: any[] = []

    let cursoIds: string[] = []

    if (rol === 'ESTUDIANTE') {
      const inscripciones = await prisma.inscripcion.findMany({
        where: { usuario_id: userId },
        select: { curso_id: true }
      })

      cursoIds = inscripciones.map(i => i.curso_id)
    } else {
      const whereClause = rol === 'ADMIN' ? {} : { profesor_id: userId }
      const cursos = await prisma.curso.findMany({
        where: whereClause,
        select: { id: true }
      })

      cursoIds = cursos.map(c => c.id)
    }

    if (cursoIds.length === 0) return ApiResponse.success(request, [])

    // Fechas de inicio y fin de cursos
    const cursos = await prisma.curso.findMany({
      where: { id: { in: cursoIds } },
      select: { id: true, titulo: true, slug: true, fecha_inicio: true, fecha_fin: true }
    })

    for (const curso of cursos) {
      if (curso.fecha_inicio) {
        eventos.push({
          id: `curso-ini-${curso.id}`,
          title: `Inicio: ${curso.titulo}`,
          start: curso.fecha_inicio.toISOString(),
          allDay: true,
          color: COLORS.CURSO_INICIO,
          extendedProps: { tipo: 'CURSO_INICIO', curso: curso.titulo, cursoSlug: curso.slug }
        })
      }

      if (curso.fecha_fin) {
        eventos.push({
          id: `curso-fin-${curso.id}`,
          title: `Fin: ${curso.titulo}`,
          start: curso.fecha_fin.toISOString(),
          allDay: true,
          color: COLORS.CURSO_FIN,
          extendedProps: { tipo: 'CURSO_FIN', curso: curso.titulo, cursoSlug: curso.slug }
        })
      }
    }

    // Clases en vivo
    const modulos = await prisma.modulo.findMany({
      where: { curso_id: { in: cursoIds } },
      select: { id: true }
    })
    const moduloIds = modulos.map(m => m.id)

    if (moduloIds.length > 0) {
      const lecciones = await prisma.leccion.findMany({
        where: {
          modulo_id: { in: moduloIds },
          es_en_vivo: true,
          fecha_programada: { not: null }
        },
        include: {
          modulo: { select: { curso: { select: { titulo: true, slug: true } } } }
        }
      })

      for (const lec of lecciones) {
        eventos.push({
          id: `clase-${lec.id}`,
          title: lec.titulo,
          start: lec.fecha_programada!.toISOString(),
          end: lec.fecha_fin?.toISOString() ?? undefined,
          color: COLORS.CLASE_VIVO,
          extendedProps: {
            tipo: 'CLASE_VIVO',
            curso: lec.modulo.curso.titulo,
            cursoSlug: lec.modulo.curso.slug,
            leccionId: lec.id,
            enlace: lec.enlace_reunion,
            descripcion: lec.contenido
          }
        })
      }
    }

    // Exámenes con fecha
    const examenes = await prisma.examen.findMany({
      where: {
        curso_id: { in: cursoIds },
        esta_publicado: true,
        fecha_inicio: { not: null }
      },
      include: { curso: { select: { titulo: true, slug: true } } }
    })

    for (const ex of examenes) {
      eventos.push({
        id: `examen-${ex.id}`,
        title: ex.titulo,
        start: ex.fecha_inicio!.toISOString(),
        end: ex.fecha_fin?.toISOString() ?? undefined,
        color: COLORS.EXAMEN,
        extendedProps: {
          tipo: 'EXAMEN',
          curso: ex.curso.titulo,
          cursoSlug: ex.curso.slug,
          examenId: ex.id,
          descripcion: ex.descripcion,
          puntajeAprobacion: ex.puntaje_aprobacion
        }
      })
    }

    return ApiResponse.success(request, eventos)
  } catch (error) {
    return handleApiError(error, request)
  }
}
