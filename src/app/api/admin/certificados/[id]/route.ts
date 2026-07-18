import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'

    const id = params.id

    const certificado = await prisma.certificado.findUnique({
      where: { id }
    })

    if (!certificado) {
      return ApiResponse.error(request, 'Certificado no encontrado', 404)
    }

    if (type === 'imported') {
      const datos = certificado.datos as any || {}
      if (datos.archivo_pdf) {
        delete datos.archivo_pdf
        await prisma.certificado.update({
          where: { id },
          data: { datos }
        })
      }
    } else {
      await prisma.certificado.delete({
        where: { id }
      })
    }

    return ApiResponse.success(request, { message: 'Certificado eliminado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
