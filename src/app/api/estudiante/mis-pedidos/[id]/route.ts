export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * GET /api/estudiante/mis-pedidos/[id]
 * Obtener el detalle de un pedido del usuario autenticado
 */
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) {
      return auth.error
    }

    const pedido = await prisma.pedido.findFirst({
      where: {
        id: params.id,
        usuario_id: auth.user.id
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
            avatar: true
          }
        },
        cupon: {
          select: { codigo: true, tipo: true, valor: true }
        },
        detalles: {
          include: {
            curso: {
              select: { titulo: true, miniatura: true, precio: true }
            }
          }
        },
        metodo_pago_manual: {
          select: {
            id: true,
            nombre: true,
            nombre_banco: true,
            numero_cuenta: true
          }
        }
      }
    })

    if (!pedido) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    return ApiResponse.success(request, { data: pedido })
  } catch (error) {
    return handleApiError(error, request)
  }
}
