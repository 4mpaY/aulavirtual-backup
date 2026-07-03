export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { puedeAccederCurso } from '@/utils/libs/subscription-access'

/**
 * GET /api/estudiante/actividades/[actId]
 * Detalle de actividad para el estudiante (sin revelar respuestas correctas)
 */
export async function GET(request: Request, { params }: { params: { actId: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { actId } = params
    const { user } = auth

    const actividad = await prisma.actividad.findUnique({
      where: { id: actId },
      include: {
        curso: { select: { id: true, titulo: true, profesor_id: true } },
        preguntas: {
          orderBy: { orden: 'asc' },
          include: {
            opciones: {
              orderBy: { orden: 'asc' },
              select: { id: true, texto: true, orden: true }
            }
          }
        },
        entregas: {
          where: { usuario_id: user.id },
          take: 1
        }
      }
    })

    if (!actividad) {
      return ApiResponse.error(request, 'Actividad no encontrada', 404)
    }

    if (!actividad.esta_publicado) {
      return ApiResponse.error(request, 'Esta actividad no está disponible', 403)
    }

    const isAdmin = user.rol === 'ADMIN'
    const isCourseProfessor = user.rol === 'PROFESOR' && actividad.curso.profesor_id === user.id

    if (!isAdmin && !isCourseProfessor) {
      const { acceso } = await puedeAccederCurso(user.id, actividad.curso.id, user.rol, actividad.curso.profesor_id)

      if (!acceso) {
        return ApiResponse.error(request, 'No tienes acceso a esta actividad', 403)
      }
    }

    const ahora = new Date()
    const entrega = actividad.entregas[0] ?? null

    if (actividad.fecha_inicio && ahora < actividad.fecha_inicio && !entrega) {
      const fechaStr = actividad.fecha_inicio.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })

      return ApiResponse.error(request, `Esta actividad estará disponible desde el ${fechaStr}`, 403)
    }

    if (actividad.fecha_fin && ahora > actividad.fecha_fin && !entrega) {
      return ApiResponse.error(request, 'El plazo para esta actividad ha finalizado', 403)
    }

    const formatted = {
      id: actividad.id,
      titulo: actividad.titulo,
      instrucciones: actividad.instrucciones,
      tipo: actividad.tipo,
      puntaje_maximo: actividad.puntaje_maximo,
      fecha_inicio: actividad.fecha_inicio,
      fecha_fin: actividad.fecha_fin,
      preguntas: actividad.preguntas.map(p => ({
        id: p.id,
        texto: p.texto,
        tipo: p.tipo,
        puntos: p.puntos,
        orden: p.orden,
        opciones: p.opciones
      })),
      entrega: entrega
        ? {
            id: entrega.id,
            archivo_url: entrega.archivo_url,
            archivo_nombre: entrega.archivo_nombre,
            comentario_estudiante: entrega.comentario_estudiante,
            respuestas: entrega.respuestas,
            nota: entrega.nota,
            comentario_docente: entrega.comentario_docente,
            creado_en: entrega.creado_en,
            actualizado_en: entrega.actualizado_en
          }
        : null
    }

    return ApiResponse.success(request, { actividad: formatted })
  } catch (error) {
    return handleApiError(error, request)
  }
}
