import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/cupones/[id]
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const cupon = await prisma.cupon.findUnique({
      where: { id: params.id }
    })

    if (!cupon) {
      return ApiResponse.error(request, 'Cupón no encontrado', 404)
    }

    return ApiResponse.success(request, cupon)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PATCH /api/cupones/[id]
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const data = await request.json()

    // No permitir cambiar el código si ya existe otro con ese nombre
    if (data.codigo) {
      const cuponExistente = await prisma.cupon.findFirst({
        where: { 
          codigo: data.codigo.toUpperCase(),
          id: { not: params.id }
        }
      })
      if (cuponExistente) {
        return ApiResponse.error(request, 'Ya existe otro cupón con ese código', 400)
      }
      data.codigo = data.codigo.toUpperCase()
    }

    const cuponActualizado = await prisma.cupon.update({
      where: { id: params.id },
      data: {
        ...data,
        valor: data.valor ? Number(data.valor) : undefined,
        limite_uso: data.limite_uso !== undefined ? (data.limite_uso ? Number(data.limite_uso) : null) : undefined,
        fecha_expiracion: data.fecha_expiracion ? new Date(data.fecha_expiracion) : undefined
      }
    })

    return ApiResponse.success(request, cuponActualizado)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/cupones/[id]
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    // TODO: ¿Deberíamos borrarlo o solo desactivarlo? 
    // Por ahora borrado físico, pero si tiene pedidos asociados lanzará error de FK, lo cual es correcto.
    await prisma.cupon.delete({
      where: { id: params.id }
    })

    return ApiResponse.success(request, { message: 'Cupón eliminado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
