import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { getAuthSession } from '@/utils/libs/auth-helpers'

export async function DELETE(
  _req: Request,
  props: { params: Promise<{ id: string; annotacionId: string }> }
) {
  const params = await props.params;
  const session = await getAuthSession()

  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const annotacion = await prisma.ebookAnnotacion.findUnique({
    where: { id: params.annotacionId },
  })

  if (!annotacion || annotacion.usuario_id !== session.user.id) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  await prisma.ebookAnnotacion.delete({ where: { id: params.annotacionId } })

  return NextResponse.json({ ok: true })
}
