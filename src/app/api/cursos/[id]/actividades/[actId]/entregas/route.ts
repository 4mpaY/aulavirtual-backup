export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/cursos/[id]/actividades/[actId]/entregas
 * Lista todas las entregas de una actividad (admin/profesor)
 */
export async function GET(request: Request, { params }: { params: { id: string; actId: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { id: cursoId, actId } = params
    const actividad = await prisma.actividad.findUnique({ where: { id: actId } })

    if (!actividad || actividad.curso_id !== cursoId) {
      return ApiResponse.error(request, 'Actividad no encontrada', 404)
    }

    const entregas = await prisma.entregaActividad.findMany({
      where: { actividad_id: actId },
      orderBy: { creado_en: 'desc' },
      include: {
        usuario: { select: { id: true, nombre: true, apellido: true, avatar: true, correo: true } }
      }
    })

    // Students enrolled but haven't submitted
    const inscripciones = await prisma.inscripcion.findMany({
      where: { curso_id: cursoId, estado: 'ACTIVO' },
      select: { usuario: { select: { id: true, nombre: true, apellido: true, avatar: true, correo: true } } }
    })

    const entregaIds = new Set(entregas.map(e => e.usuario_id))

    const pendientes = inscripciones
      .map(i => i.usuario)
      .filter(u => !entregaIds.has(u.id))

    return ApiResponse.success(request, { entregas, pendientes })
  } catch (error) {
    return handleApiError(error, request)
  }
}
