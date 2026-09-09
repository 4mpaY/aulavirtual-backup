import prisma from '@/utils/libs/prisma'
import { crearModuloSchema } from '@/schemas/modulo.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * POST /api/cursos/[id]/modulos
 * Crear un módulo dentro de un curso
 */
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    const { user } = auth

    const { id: cursoId } = params
    const body = await request.json()

    const validation = validateRequest(crearModuloSchema, body, request)

    if (!validation.success) return validation.error

    // Verificar que el curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    // Si es PROFESOR, solo puede crear módulos si es el dueño
    if (user.rol === 'PROFESOR' && curso.profesor_id !== user.id) {
      return ApiResponse.error(request, 'No tienes permiso para gestionar este curso', 403)
    }

    // Calcular el siguiente orden
    const ultimoModulo = await prisma.modulo.findFirst({
      where: { curso_id: cursoId },
      orderBy: { orden: 'desc' }
    })

    const orden = (ultimoModulo?.orden ?? -1) + 1

    const nuevoModulo = await prisma.modulo.create({
      data: {
        titulo: validation.data.titulo,
        descripcion: validation.data.descripcion || null,
        orden,
        curso_id: cursoId
      },
      include: {
        lecciones: {
          orderBy: { orden: 'asc' }
        }
      }
    })

    return ApiResponse.success(request, { modulo: nuevoModulo }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
