export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * DELETE /api/admin/certificados/[id]
 * Eliminar un certificado (solo ADMIN)
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { id } = params

    const certificado = await prisma.certificado.findUnique({
      where: { id }
    })

    if (!certificado) {
      return ApiResponse.error(request, 'Certificado no encontrado', 404)
    }

    await prisma.certificado.delete({
      where: { id }
    })

    return ApiResponse.success(request, { message: 'Certificado eliminado con éxito' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
