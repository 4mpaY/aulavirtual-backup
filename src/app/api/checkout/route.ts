import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/checkout
 * Procesa la inscripción a un curso
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { cursoId } = await request.json()

    if (!cursoId) {
      return ApiResponse.error(request, 'El ID del curso es requerido', 400)
    }

    // 1. Verificar que el curso exista
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return ApiResponse.error(request, 'El curso no existe', 404)
    }

    // 2. Verificar si el usuario ya está inscrito
    const inscripcionExistente = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: cursoId
        }
      }
    })

    if (inscripcionExistente) {
      return ApiResponse.error(request, 'Ya estás inscrito en este curso', 400)
    }

    // 3. Crear la inscripción y el pedido (si corresponde)
    const result = await prisma.$transaction(async tx => {
      // Crear pedido si no es gratuito (o siempre para registro)
      const pedido = await tx.pedido.create({
        data: {
          usuario_id: auth.user.id,
          total: curso.precio,
          moneda: curso.moneda,
          estado: 'COMPLETADO',
          metodo_pago: 'OTRO', // Por ahora simplificado
          pagado_en: new Date(),
          detalles: {
            create: {
              curso_id: cursoId,
              precio_unitario: curso.precio,
              subtotal: curso.precio,
              total: curso.precio
            }
          }
        }
      })

      // Crear inscripción vinculada al pedido
      const inscripcion = await tx.inscripcion.create({
        data: {
          usuario_id: auth.user.id,
          curso_id: cursoId,
          pedido_id: pedido.id,
          estado: 'ACTIVO'
        }
      })

      return { pedido, inscripcion }
    })

    return ApiResponse.success(
      request,
      {
        message: 'Inscripción completada con éxito',
        ...result
      },
      201
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
