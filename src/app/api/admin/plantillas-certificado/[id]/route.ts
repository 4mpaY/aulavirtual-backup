export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getConfigs } from '@/utils/libs/config'

/**
 * GET /api/admin/plantillas-certificado/[id]
 * Obtiene una plantilla de certificado personalizada (solo ADMIN)
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const plantilla = await prisma.plantillaCertificadoPersonalizada.findUnique({ where: { id: params.id } })

    if (!plantilla) {
      return ApiResponse.error(request, 'Plantilla no encontrada', 404)
    }

    return ApiResponse.success(request, { plantilla })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PATCH /api/admin/plantillas-certificado/[id]
 * Actualiza nombre, imágenes, campos posicionados o estado activo (solo ADMIN)
 */
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const plantilla = await prisma.plantillaCertificadoPersonalizada.findUnique({ where: { id: params.id } })

    if (!plantilla) {
      return ApiResponse.error(request, 'Plantilla no encontrada', 404)
    }

    const body = await request.json()
    const { nombre, cara_frente_url, cara_reverso_url, reverso_activo, campos, activo } = body

    const actualizada = await prisma.plantillaCertificadoPersonalizada.update({
      where: { id: params.id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(cara_frente_url !== undefined && { cara_frente_url }),
        ...(cara_reverso_url !== undefined && { cara_reverso_url: cara_reverso_url || null }),
        ...(reverso_activo !== undefined && { reverso_activo: Boolean(reverso_activo) }),
        ...(campos !== undefined && { campos: Array.isArray(campos) ? campos : [] }),
        ...(activo !== undefined && { activo: Boolean(activo) })
      }
    })

    return ApiResponse.success(request, { plantilla: actualizada })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/admin/plantillas-certificado/[id]
 * Elimina una plantilla personalizada (solo ADMIN).
 * Si está en uso (como diseño general o en algún curso), se rechaza:
 * el camino soportado para "retirar" una plantilla en uso es desactivarla
 * (PATCH { activo: false }), lo cual la oculta de los selectores sin
 * romper certificados que la referencien (getGenerator cae a 'clasico').
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const plantilla = await prisma.plantillaCertificadoPersonalizada.findUnique({ where: { id: params.id } })

    if (!plantilla) {
      return ApiResponse.error(request, 'Plantilla no encontrada', 404)
    }

    const [cursosQueLaUsan, configs] = await Promise.all([
      prisma.curso.count({ where: { certificado_plantilla: params.id } }),
      getConfigs()
    ])

    const esDisenoGeneral = configs.CERTIFICADO_PLANTILLA === params.id

    if (cursosQueLaUsan > 0 || esDisenoGeneral) {
      return ApiResponse.error(
        request,
        'Esta plantilla está en uso (como diseño general o en algún curso). Desactívala en vez de eliminarla, o cambia antes las referencias.',
        409
      )
    }

    await prisma.plantillaCertificadoPersonalizada.delete({ where: { id: params.id } })

    return ApiResponse.success(request, { message: 'Plantilla eliminada correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
