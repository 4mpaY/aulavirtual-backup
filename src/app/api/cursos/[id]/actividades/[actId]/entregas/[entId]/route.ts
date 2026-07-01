export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * PATCH /api/cursos/[id]/actividades/[actId]/entregas/[entId]
 * Calificar una entrega
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string; actId: string; entId: string } }
) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId, entId } = params
    const body = await request.json()
    const { nota, comentario_docente } = body

    const actividad = await prisma.actividad.findUnique({
      where: { id: actId },
      include: { curso: { select: { id: true, profesor_id: true } } }
    })

    if (!actividad || actividad.curso_id !== cursoId) {
      return ApiResponse.error(request, 'Actividad no encontrada', 404)
    }

    if (auth.user.rol === 'PROFESOR' && actividad.curso.profesor_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso', 403)
    }

    const entrega = await prisma.entregaActividad.findUnique({ where: { id: entId } })

    if (!entrega || entrega.actividad_id !== actId) {
      return ApiResponse.error(request, 'Entrega no encontrada', 404)
    }

    if (nota === undefined || nota === null || nota === '') {
      return ApiResponse.error(request, 'La nota es requerida para calificar', 400)
    }

    const notaNum = Number(nota)

    if (!Number.isFinite(notaNum) || notaNum < 0 || notaNum > actividad.puntaje_maximo) {
      return ApiResponse.error(
        request,
        `La nota debe estar entre 0 y ${actividad.puntaje_maximo}`,
        400
      )
    }

    const updated = await prisma.entregaActividad.update({
      where: { id: entId },
      data: {
        nota: notaNum,
        ...(comentario_docente !== undefined && { comentario_docente: comentario_docente || null })
      },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, avatar: true, correo: true } }
      }
    })

    return ApiResponse.success(request, { entrega: updated })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * GET /api/cursos/[id]/actividades/[actId]/entregas/[entId]
 * Detalle de una entrega para revisión
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string; actId: string; entId: string } }
) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId, entId } = params

    const check = await prisma.actividad.findUnique({
      where: { id: actId },
      include: {
        curso: { select: { id: true, profesor_id: true } },
        preguntas: {
          orderBy: { orden: 'asc' },
          include: { opciones: { orderBy: { orden: 'asc' } } }
        }
      }
    })

    if (!check || check.curso_id !== cursoId) {
      return ApiResponse.error(request, 'Actividad no encontrada', 404)
    }

    if (auth.user.rol === 'PROFESOR' && check.curso.profesor_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso', 403)
    }

    const entrega = await prisma.entregaActividad.findUnique({
      where: { id: entId },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, avatar: true, correo: true } }
      }
    })

    if (!entrega || entrega.actividad_id !== actId) {
      return ApiResponse.error(request, 'Entrega no encontrada', 404)
    }

    return ApiResponse.success(request, {
      entrega,
      actividad: {
        id: check.id,
        titulo: check.titulo,
        tipo: check.tipo,
        instrucciones: check.instrucciones,
        puntaje_maximo: check.puntaje_maximo,
        preguntas: check.preguntas
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
