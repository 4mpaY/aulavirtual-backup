import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { getAuthSession } from '@/utils/libs/auth-helpers'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const acceso = await prisma.ebookAcceso.findUnique({
    where: { usuario_id_ebook_id: { usuario_id: session.user.id, ebook_id: params.id } },
  })

  if (!acceso) return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })

  const annotaciones = await prisma.ebookAnnotacion.findMany({
    where: { usuario_id: session.user.id, ebook_id: params.id },
    orderBy: { creado_en: 'asc' },
  })

  return NextResponse.json(annotaciones)
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const acceso = await prisma.ebookAcceso.findUnique({
    where: { usuario_id_ebook_id: { usuario_id: session.user.id, ebook_id: params.id } },
  })

  if (!acceso) return NextResponse.json({ error: 'Sin acceso' }, { status: 403 })

  const body = await req.json()
  const { pagina, tipo, texto, color, posicion } = body

  if (!pagina || !tipo || !posicion) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  const annotacion = await prisma.ebookAnnotacion.create({
    data: {
      usuario_id: session.user.id,
      ebook_id: params.id,
      pagina,
      tipo,
      texto: texto ?? null,
      color: color ?? '#fbbf24',
      posicion,
    },
  })

  return NextResponse.json(annotacion, { status: 201 })
}
