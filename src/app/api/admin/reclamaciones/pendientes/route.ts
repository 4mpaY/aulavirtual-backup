import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/reclamaciones/pendientes
 * Devuelve la cantidad de reclamaciones pendientes (solo admin)
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return NextResponse.json({ count: 0 })
    }

    const count = await prisma.reclamacion.count({
      where: { estado: 'PENDIENTE' }
    })

    return NextResponse.json({ count })
  } catch (error) {
    return handleApiError(error, request)
  }
}
