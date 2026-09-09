export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { culqiSuscripcion } from '@/utils/libs/culqi-suscripcion'

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return ApiResponse.error(request, 'No tienes permisos', 403)
    }

    const suscripcion = await prisma.suscripcion.findUnique({ where: { id: params.id } })

    if (!suscripcion) return ApiResponse.error(request, 'Suscripción no encontrada', 404)

    if (suscripcion.culqi_suscripcion_id) {
      try {
        await culqiSuscripcion.cancelarSuscripcion(suscripcion.culqi_suscripcion_id)
      } catch (e: any) {
        console.error('Error cancelando en Culqi:', e?.message)
      }
    }

    await prisma.suscripcion.update({
      where: { id: params.id },
      data: { estado: 'CANCELADA', fecha_cancelacion: new Date() }
    })

    return ApiResponse.success(request, { message: 'Suscripción cancelada' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
