import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/configs/auth'
import prisma from '@/utils/libs/prisma'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const notificaciones = await prisma.notificacion.findMany({
      where: { usuario_id: session.user.id },
      orderBy: { creado_en: 'desc' },
      take: 20
    })

    return NextResponse.json(notificaciones)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Error al obtener notificaciones' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id, todas } = await request.json()

    if (todas) {
      await prisma.notificacion.updateMany({
        where: { usuario_id: session.user.id, leida: false },
        data: { leida: true }
      })
    } else if (id) {
      await prisma.notificacion.update({
        where: { id, usuario_id: session.user.id },
        data: { leida: true }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Error al actualizar notificaciones' }, { status: 500 })
  }
}
