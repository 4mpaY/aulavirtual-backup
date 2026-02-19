import prisma from '@/utils/libs/prisma'
import { crearLeccionSchema } from '@/schemas/leccion.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * POST /api/cursos/[id]/modulos/[moduloId]/lecciones
 * Crear una lección dentro de un módulo
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string; moduloId: string } }
) {
  try {
    const auth = await requireAdmin(request)
    if (!auth.authorized) return auth.error

    const { id: cursoId, moduloId } = params
    const body = await request.json()

    const validation = validateRequest(crearLeccionSchema, body, request)
    if (!validation.success) return validation.error

    // Verificar que el módulo existe y pertenece al curso
    const modulo = await prisma.modulo.findFirst({
      where: { id: moduloId, curso_id: cursoId }
    })

    if (!modulo) {
      return ApiResponse.error(request, 'Módulo no encontrado en este curso', 404)
    }

    // Calcular el siguiente orden
    const ultimaLeccion = await prisma.leccion.findFirst({
      where: { modulo_id: moduloId },
      orderBy: { orden: 'desc' }
    })

    const orden = (ultimaLeccion?.orden ?? -1) + 1

    const nuevaLeccion = await prisma.leccion.create({
      data: {
        titulo: validation.data.titulo,
        contenido: validation.data.contenido || null,
        duracion: validation.data.duracion || null,
        enlace_reunion: validation.data.enlace_reunion || null,
        orden,
        estado: 'BORRADOR',
        modulo_id: moduloId
      }
    })

    return ApiResponse.success(request, { leccion: nuevaLeccion }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
