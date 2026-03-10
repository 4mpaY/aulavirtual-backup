import prisma from '@/utils/libs/prisma'
import { crearPedidoManualSchema } from '@/schemas/pedido.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * POST /api/pedidos/manual
 * Crear un pedido manual para un estudiante (solo ADMIN)
 */
export async function POST(request: Request) {
  try {
    // 1. Verificar que el usuario sea ADMIN

    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const body = await request.json()

    // 2. Validar datos con Zod
    const validation = validateRequest(crearPedidoManualSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { usuario_id, curso_id, precio, metodo_pago, mensaje } = validation.data

    // 3. Verificar que el curso existe y obtener su moneda
    const curso = await prisma.curso.findUnique({
      where: { id: curso_id }
    })

    if (!curso) {
      return ApiResponse.error(request, 'El curso no existe', 404)
    }

    // 4. Verificar que el estudiante existe
    const estudiante = await prisma.usuario.findUnique({
      where: { id: usuario_id }
    })

    if (!estudiante) {
      return ApiResponse.error(request, 'El estudiante no existe', 404)
    }

    // 5. Verificar si ya está inscrito
    const inscripcionExistente = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id,
          curso_id
        }
      }
    })

    if (inscripcionExistente) {
      return ApiResponse.error(request, 'El estudiante ya está inscrito en este curso', 400)
    }

    // 6. Crear Pedido, Detalle e Inscripción en una transacción
    const result = await prisma.$transaction(async tx => {
      // Crear el pedido
      const pedido = await tx.pedido.create({
        data: {
          usuario_id: usuario_id,
          total: precio,
          moneda: curso.moneda || 'PEN',
          estado: 'COMPLETADO',
          metodo_pago: metodo_pago,
          mensaje: mensaje || `Pedido manual generado por administrador`,
          pagado_en: new Date(),
          detalles: {
            create: {
              curso_id: curso_id,
              precio_unitario: precio,
              subtotal: precio,
              total: precio
            }
          }
        }
      })

      // Crear la inscripción
      const inscripcion = await tx.inscripcion.create({
        data: {
          usuario_id: usuario_id,
          curso_id: curso_id,
          pedido_id: pedido.id,
          estado: 'ACTIVO',
          inscrito_en: new Date()
        }
      })

      return { pedido, inscripcion }
    })

    return ApiResponse.success(
      request,
      {
        message: 'Pedido manual creado con éxito y acceso concedido al curso',
        data: result
      },
      201
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
