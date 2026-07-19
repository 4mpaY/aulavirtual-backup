export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'

const COLORS = {
  CLASE_VIVO: '#1565C0',
  EXAMEN: '#C62828',
  CURSO_INICIO: '#2E7D32',
  CURSO_FIN: '#E65100',
  EVENTO_EXTERNO: '#6A1B9A'
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const userId = auth.user.id
    const rol = auth.user.rol
    const eventos: any[] = []

    // Eventos externos (agenda personal) — independientes del rol, solo del propio usuario
    const eventosExternos = await prisma.eventoExterno.findMany({
      where: { usuario_id: userId }
    })

    for (const ev of eventosExternos) {
      eventos.push({
        id: `evento-externo-${ev.id}`,
        title: ev.titulo,
        start: ev.fecha_inicio.toISOString(),
        end: ev.fecha_fin?.toISOString() ?? undefined,
        allDay: ev.todo_el_dia,
        color: ev.color ?? COLORS.EVENTO_EXTERNO,
        extendedProps: {
          tipo: 'EVENTO_EXTERNO',
          eventoExternoId: ev.id,
          descripcion: ev.descripcion ?? undefined,
          color: ev.color ?? undefined,
          todoElDia: ev.todo_el_dia
        }
      })
    }

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

    if (cursoIds.length === 0) return ApiResponse.success(request, eventos)

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
