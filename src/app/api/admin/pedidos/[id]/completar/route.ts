export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { completeOrder } from '@/utils/libs/order-service'

/**
 * POST /api/admin/pedidos/[id]/completar
 * El admin completa un pedido manual tras verificar el voucher (solo ADMIN)
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const pedido = await prisma.pedido.findUnique({
      where: { id: params.id }
    })

    if (!pedido) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    if (pedido.estado === 'COMPLETADO') {
      return ApiResponse.error(request, 'El pedido ya está completado', 400)
    }

    if (pedido.estado === 'CANCELADO') {
      return ApiResponse.error(request, 'No se puede completar un pedido cancelado', 400)
    }

    const result = await completeOrder(params.id, {
      metodo_pago: 'TRANSFERENCIA',
      transaccion_id: undefined,
      respuesta_pago: { completado_por_admin: auth.user.id, completado_en: new Date().toISOString() }
    })

    return ApiResponse.success(request, {
      message: 'Pedido completado correctamente',
      pedido: result.pedido,
      inscripciones: result.inscripciones
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
