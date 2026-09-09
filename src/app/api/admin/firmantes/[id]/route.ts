export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getConfigs } from '@/utils/libs/config'

/**
 * GET /api/admin/firmantes/[id]
 * Obtiene un firmante (solo ADMIN)
 */
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const firmante = await prisma.firmante.findUnique({ where: { id: params.id } })

    if (!firmante) {
      return ApiResponse.error(request, 'Firmante no encontrado', 404)
    }

    return ApiResponse.success(request, { firmante })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * PATCH /api/admin/firmantes/[id]
 * Actualiza nombre, cargo, firma, sello o estado activo (solo ADMIN)
 */
export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const firmante = await prisma.firmante.findUnique({ where: { id: params.id } })

    if (!firmante) {
      return ApiResponse.error(request, 'Firmante no encontrado', 404)
    }

    const body = await request.json()
    const { nombre, cargo, firma, sello, activo } = body

    const actualizado = await prisma.firmante.update({
      where: { id: params.id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(cargo !== undefined && { cargo: cargo || null }),
        ...(firma !== undefined && { firma: firma || null }),
        ...(sello !== undefined && { sello: sello || null }),
        ...(activo !== undefined && { activo: Boolean(activo) })
      }
    })

    return ApiResponse.success(request, { firmante: actualizado })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * DELETE /api/admin/firmantes/[id]
 * Elimina un firmante (solo ADMIN).
 * Si está en uso (como Firmante 1/2 de algún curso, o como firmante global por
 * defecto), se rechaza: el camino soportado para "retirar" un firmante en uso
 * es desactivarlo (PATCH { activo: false }), lo cual lo oculta de los
 * selectores sin romper certificados que lo referencien.
 */
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const firmante = await prisma.firmante.findUnique({ where: { id: params.id } })

    if (!firmante) {
      return ApiResponse.error(request, 'Firmante no encontrado', 404)
    }

    const [cursosQueLoUsan, configs] = await Promise.all([
      prisma.curso.count({ where: { OR: [{ firmante_1_id: params.id }, { firmante_2_id: params.id }] } }),
      getConfigs()
    ])

    const esDefaultGlobal =
      configs.CERTIFICADO_FIRMANTE_1_ID === params.id || configs.CERTIFICADO_FIRMANTE_2_ID === params.id

    if (cursosQueLoUsan > 0 || esDefaultGlobal) {
      return ApiResponse.error(
        request,
        'Este firmante está en uso (como Firmante 1/2 por defecto o en algún curso). Desactívalo en vez de eliminarlo, o cambia antes las referencias.',
        409
      )
    }

    await prisma.firmante.delete({ where: { id: params.id } })

    return ApiResponse.success(request, { message: 'Firmante eliminado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
