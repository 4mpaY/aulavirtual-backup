import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'

/**
 * PATCH /api/admin/entregas-trabajo/[entregaId]
 * Permite a un profesor o administrador calificar y dejar retroalimentación
 * sobre la entrega de un trabajo por parte de un estudiante.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { entregaId: string } }
) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { entregaId } = params

    // 1. Obtener la entrega y verificar pertenencia al curso para seguridad
    const entrega = await prisma.entregaTrabajo.findUnique({
      where: { id: entregaId },
      include: {
        trabajo: {
          include: {
            leccion: {
              include: {
                modulo: {
                  select: {
                    curso_id: true,
                    curso: {
                      select: {
                        profesor_id: true
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

    if (!entrega) {
      return ApiResponse.error(request, 'Entrega no encontrada', 404)
    }

    // Si el rol es PROFESOR, validar que sea el profesor que dicta el curso
    if (user.rol === 'PROFESOR' && entrega.trabajo.leccion.modulo.curso.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    // 2. Validar cuerpo de la petición
    const body = await request.json()
    const { nota, comentario_docente } = body

    if (nota === undefined || nota === null) {
      return ApiResponse.error(request, 'La calificación (nota) es requerida', 400)
    }

    const notaNum = Number(nota)

    if (isNaN(notaNum) || notaNum < 0 || notaNum > 20) {
      return ApiResponse.error(request, 'La nota debe ser un número entero o decimal entre 0 y 20', 400)
    }

    // 3. Registrar calificación y comentarios
    const entregaActualizada = await prisma.entregaTrabajo.update({
      where: { id: entregaId },
      data: {
        nota: notaNum,
        comentario_docente: comentario_docente || null
      }
    })

    return ApiResponse.success(request, { entrega: entregaActualizada })
  } catch (error) {
    return handleApiError(error, request)
  }
}
