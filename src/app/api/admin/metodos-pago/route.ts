export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/admin/metodos-pago
 * Lista todos los métodos de pago manual (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const metodos = await prisma.metodoPagoManual.findMany({
      orderBy: [{ orden: 'asc' }, { creado_en: 'asc' }]
    })

    return ApiResponse.success(request, { metodos })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/admin/metodos-pago
 * Crea un nuevo método de pago manual (solo ADMIN)
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const body = await request.json()
    const { nombre, nombre_banco, numero_cuenta, cci, ruc, descripcion, imagen_url, orden } = body

    if (!nombre || !numero_cuenta) {
      return ApiResponse.error(request, 'nombre y numero_cuenta son obligatorios', 400)
    }

    const metodo = await prisma.metodoPagoManual.create({
      data: {
        nombre,
        nombre_banco: nombre_banco || null,
        numero_cuenta,
        cci: cci || null,
        ruc: ruc || null,
        descripcion: descripcion || null,
        imagen_url: imagen_url || null,
        orden: orden ?? 0
      }
    })

    return ApiResponse.success(request, { metodo }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
