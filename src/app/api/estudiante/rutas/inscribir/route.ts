import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { getCurrentUser } from '@/utils/libs/auth-helpers'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { ruta_id } = await req.json()

    if (!ruta_id) {
      return NextResponse.json({ error: 'ID de ruta requerido' }, { status: 400 })
    }

    const userId = user.id

    // Verificar si la ruta existe
    // Use any as prisma types may not be generated yet
    const prismaAny = prisma as any

    const rutaExistente = await prismaAny.rutaAprendizaje.findUnique({
      where: { id: ruta_id }
    })

    if (!rutaExistente) {
      return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 })
    }

    // Verificar si ya está inscrito
    const inscripcionExistente = await prismaAny.inscripcionRuta.findUnique({
      where: {
        usuario_id_ruta_id: {
          usuario_id: userId,
          ruta_id: ruta_id
        }
      }
    })

    if (inscripcionExistente) {
      return NextResponse.json({ error: 'Ya estás inscrito a esta ruta' }, { status: 400 })
    }

    // Crear la inscripción
    await prismaAny.inscripcionRuta.create({
      data: {
        usuario_id: userId,
        ruta_id: ruta_id
      }
    })

    return NextResponse.json({ success: true, message: 'Inscripción exitosa a la ruta' })
  } catch (error: any) {
    console.error('Error al inscribir a la ruta:', error)
    
return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
