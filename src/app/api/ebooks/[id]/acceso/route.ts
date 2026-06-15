export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'

/**
 * POST /api/ebooks/[id]/acceso — Otorga acceso a un ebook (gratis o tras pago)
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const ebook = await prisma.ebook.findUnique({ where: { id: params.id } })

    if (!ebook) return NextResponse.json({ error: 'Ebook no encontrado' }, { status: 404 })
    if (ebook.estado !== 'PUBLICADO') return NextResponse.json({ error: 'Ebook no disponible' }, { status: 400 })

    if (!ebook.es_gratis) {
      return NextResponse.json({ error: 'Este ebook requiere pago' }, { status: 403 })
    }

    const acceso = await prisma.ebookAcceso.upsert({
      where: { usuario_id_ebook_id: { usuario_id: auth.user.id, ebook_id: ebook.id } },
      create: { usuario_id: auth.user.id, ebook_id: ebook.id },
      update: {},
    })

    return NextResponse.json({ acceso }, { status: 201 })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * GET /api/ebooks/[id]/acceso — Verifica si el usuario tiene acceso
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const acceso = await prisma.ebookAcceso.findUnique({
      where: { usuario_id_ebook_id: { usuario_id: auth.user.id, ebook_id: params.id } },
    })

    return NextResponse.json({ tiene_acceso: !!acceso })
  } catch (error) {
    return handleApiError(error, request)
  }
}
