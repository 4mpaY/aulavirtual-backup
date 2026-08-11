import crypto from 'crypto'

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

    const prismaAny = prisma as any

    // Verificar si el usuario está inscrito en la ruta formalmente
    const inscripcionRuta = await prismaAny.inscripcionRuta.findUnique({
      where: {
        usuario_id_ruta_id: {
          usuario_id: userId,
          ruta_id: ruta_id
        }
      }
    })

    if (!inscripcionRuta) {
      return NextResponse.json({ error: 'No estás inscrito en esta ruta' }, { status: 403 })
    }

    // Verificar si ya tiene el certificado
    const certificadoExistente = await prisma.certificado.findUnique({
      where: {
        usuario_id_ruta_id: {
          usuario_id: userId,
          ruta_id: ruta_id
        }
      }
    })

    if (certificadoExistente) {
      return NextResponse.json({ certificado: certificadoExistente })
    }

    // Obtener la ruta y sus cursos
    const ruta = await prisma.rutaAprendizaje.findUnique({
      where: { id: ruta_id },
      include: {
        cursos: {
          include: { curso: true }
        }
      }
    })

    if (!ruta) {
      return NextResponse.json({ error: 'Ruta no encontrada' }, { status: 404 })
    }

    const cursosRutaIds = ruta.cursos.map((c) => c.curso_id)

    // Obtener el progreso de estos cursos
    const progresos = await prisma.progresoCurso.findMany({
      where: {
        usuario_id: userId,
        curso_id: { in: cursosRutaIds }
      }
    })

    // Verificar si todos los cursos de la ruta tienen 100% de progreso
    const cursosCompletados = progresos.filter((p) => p.porcentaje_progreso >= 100)

    if (cursosCompletados.length !== cursosRutaIds.length || cursosRutaIds.length === 0) {
      return NextResponse.json({ error: 'No cumples con los requisitos (100% de la ruta) para reclamar el certificado' }, { status: 400 })
    }

    // Crear el certificado
    const nuevoCertificado = await prisma.certificado.create({
      data: {
        codigo_verificacion: crypto.randomUUID().substring(0, 12).toUpperCase(),
        usuario_id: userId,
        ruta_id: ruta_id,
        datos: {}
      }
    })

    return NextResponse.json({ certificado: nuevoCertificado })
  } catch (error) {
    console.error('[CERTIFICADO_RUTA_POST]', error)
    
return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
