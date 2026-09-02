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
      where: { id: ruta_id },
      include: { cursos: { select: { curso_id: true } } }
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

    // Buscar inscripciones actuales del usuario para no duplicarlas
    const inscripcionesActuales = await prismaAny.inscripcion.findMany({
      where: { usuario_id: userId },
      select: { curso_id: true }
    })
    
    const cursosActualesIds = new Set(inscripcionesActuales.map((i: any) => i.curso_id))

    const nuevosCursosAInscribir = rutaExistente.cursos
      .filter((c: any) => !cursosActualesIds.has(c.curso_id))
      .map((c: any) => ({
        usuario_id: userId,
        curso_id: c.curso_id,
        estado: 'ACTIVO',
        inscrito_en: new Date()
      }))

    // Crear la inscripción a la ruta y a los cursos en una transacción
    await prismaAny.$transaction(async (tx: any) => {
      // 1. Inscripción a la ruta
      await tx.inscripcionRuta.create({
        data: {
          usuario_id: userId,
          ruta_id: ruta_id
        }
      })

      // 2. Inscripción a los cursos que le faltan
      if (nuevosCursosAInscribir.length > 0) {
        await Promise.all(nuevosCursosAInscribir.map((cursoData: any) =>
          tx.inscripcion.create({ data: cursoData })
        ))
      }
    })

    return NextResponse.json({ success: true, message: 'Inscripción exitosa a la ruta' })
  } catch (error: any) {
    console.error('Error al inscribir a la ruta:', error)
    
return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
