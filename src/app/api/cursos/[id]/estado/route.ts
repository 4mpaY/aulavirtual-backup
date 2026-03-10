import prisma from '@/utils/libs/prisma'
import { cambiarEstadoCursoSchema } from '@/schemas/curso.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * PATCH /api/cursos/[id]/estado
 * Cambiar el estado del curso (BORRADOR → PUBLICADO → ARCHIVADO)
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth

    const { id } = params
    const body = await request.json()

    const validation = validateRequest(cambiarEstadoCursoSchema, body, request)

    if (!validation.success) return validation.error

    const { estado } = validation.data

    const curso = await prisma.curso.findUnique({
      where: { id },
      include: {
        modulos: {
          include: {
            lecciones: {
              where: { estado: 'PUBLICADO' }
            }
          }
        }
      }
    })

    if (!curso) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    // Si es PROFESOR, solo puede cambiar estado si es el dueño
    if (user.rol === 'PROFESOR' && curso.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    // Validar al publicar: requiere al menos 1 módulo con 1 lección publicada
    if (estado === 'PUBLICADO') {
      const tieneContenido = curso.modulos.some(m => m.lecciones.length > 0)

      if (curso.modulos.length === 0) {
        return ApiResponse.error(request, 'No se puede publicar: el curso debe tener al menos un módulo', 400)
      }

      if (!tieneContenido) {
        return ApiResponse.error(
          request,
          'No se puede publicar: debe haber al menos una lección publicada en algún módulo',
          400
        )
      }
    }

    const cursoActualizado = await prisma.curso.update({
      where: { id },
      data: { estado },
      include: {
        profesor: {
          select: { id: true, nombre: true, apellido: true, avatar: true }
        },
        categoria: {
          select: { id: true, nombre: true }
        },
        _count: {
          select: { modulos: true, inscripciones: true }
        }
      }
    })

    return ApiResponse.success(request, { curso: cursoActualizado })
  } catch (error) {
    return handleApiError(error, request)
  }
}
