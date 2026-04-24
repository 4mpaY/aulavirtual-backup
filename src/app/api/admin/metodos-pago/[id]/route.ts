export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * PUT /api/admin/metodos-pago/[id]
 * Actualiza un método de pago manual (solo ADMIN)
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const metodo = await prisma.metodoPagoManual.findUnique({ where: { id: params.id } })

    if (!metodo) {
      return ApiResponse.error(request, 'Método de pago no encontrado', 404)
    }

    const body = await request.json()
    const { nombre, nombre_banco, numero_cuenta, cci, ruc, descripcion, imagen_url, orden, estado } = body

    const actualizado = await prisma.metodoPagoManual.update({
      where: { id: params.id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(nombre_banco !== undefined && { nombre_banco }),
        ...(numero_cuenta !== undefined && { numero_cuenta }),
        ...(cci !== undefined && { cci }),
        ...(ruc !== undefined && { ruc }),
        ...(descripcion !== undefined && { descripcion }),
        ...(imagen_url !== undefined && { imagen_url }),
        ...(orden !== undefined && { orden }),
        ...(estado !== undefined && { estado })
      }
    })

    return ApiResponse.success(request, { metodo: actualizado })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/admin/metodos-pago/[id]
 * Desactiva un método de pago manual (soft delete) (solo ADMIN)
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const metodo = await prisma.metodoPagoManual.findUnique({ where: { id: params.id } })

    if (!metodo) {
      return ApiResponse.error(request, 'Método de pago no encontrado', 404)
    }

    await prisma.metodoPagoManual.update({
      where: { id: params.id },
      data: { estado: false }
    })

    return ApiResponse.success(request, { message: 'Método de pago desactivado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
