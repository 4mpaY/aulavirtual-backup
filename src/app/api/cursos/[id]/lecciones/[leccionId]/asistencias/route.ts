import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/libs/prisma'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; leccionId: string } }
) {
  try {
    // auth bypassed momentarily for debugging
    // const auth = await requireProfesorOrAdmin(req)
    // if (!auth.authorized) return auth.error

    const { id: cursoId, leccionId } = params

    // 1. Obtener todos los alumnos inscritos en este curso que estén activos
    const inscripciones = await prisma.inscripcion.findMany({
      where: {
        curso_id: cursoId,
        estado: 'ACTIVO'
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            correo: true,
            avatar: true
          }
        }
      }
    })

    // 2. Obtener las asistencias registradas para esta lección
    const asistenciasRegistradas = await prisma.asistencia.findMany({
      where: {
        leccion_id: leccionId
      }
    })

    const mapaAsistencias = new Map(
      asistenciasRegistradas.map(a => [a.usuario_id, a.asistio])
    )

    // 3. Combinar ambos datos (por defecto asistio = false)
    const alumnos = inscripciones.map(insc => ({
      usuarioId: insc.usuario.id,
      nombre: insc.usuario.nombre,
      apellido: insc.usuario.apellido,
      correo: insc.usuario.correo,
      avatar: insc.usuario.avatar,
      asistio: mapaAsistencias.get(insc.usuario.id) ?? false
    }))

    return NextResponse.json(alumnos)
  } catch (error: any) {
    console.error('[GET_ASISTENCIAS]', error)
    return NextResponse.json({ error: 'Error interno del servidor', details: error?.message, stack: error?.stack }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; leccionId: string } }
) {
  try {
    const auth = await requireProfesorOrAdmin(req)
    if (!auth.authorized) return auth.error

    const { leccionId } = params
    const asistencias: { usuario_id: string; asistio: boolean }[] = await req.json()

    if (!Array.isArray(asistencias)) {
      return NextResponse.json({ error: 'El cuerpo de la petición debe ser un array' }, { status: 400 })
    }

    // Usar una transacción para hacer upsert masivo (Prisma no tiene createManyAndReturn con update, así que mapeamos a upserts)
    const upserts = asistencias.map(a =>
      prisma.asistencia.upsert({
        where: {
          leccion_id_usuario_id: {
            leccion_id: leccionId,
            usuario_id: a.usuario_id
          }
        },
        update: {
          asistio: a.asistio
        },
        create: {
          leccion_id: leccionId,
          usuario_id: a.usuario_id,
          asistio: a.asistio
        }
      })
    )

    await prisma.$transaction(upserts)

    return NextResponse.json({ success: true, message: 'Asistencias actualizadas correctamente' })
  } catch (error: any) {
    console.error('[POST_ASISTENCIAS]', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
