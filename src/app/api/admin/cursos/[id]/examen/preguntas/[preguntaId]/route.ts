import { NextResponse } from 'next/server'


import { getServerSession } from 'next-auth'


import prisma from '@/utils/libs/prisma'
import { authOptions } from '@/utils/configs/auth'

export async function PUT(req: Request, { params }: { params: { id: string; preguntaId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ status: false, message: 'No autorizado' }, { status: 401 })
    }

    const { id: cursoId, preguntaId } = params
    const { texto, tipo, puntos, opciones } = await req.json()

    if (!texto || !tipo || !opciones || !Array.isArray(opciones) || opciones.length === 0) {
      return NextResponse.json(
        { status: false, message: 'Faltan datos requeridos o las opciones son inválidas' },
        { status: 400 }
      )
    }

    // Verify course exists and ownership
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return NextResponse.json({ status: false, message: 'Curso no encontrado' }, { status: 404 })
    }

    const isOwner = curso.profesor_id === (session.user as any).id
    const isAdmin = session.user.rol === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ status: false, message: 'No tienes permiso para editar este examen' }, { status: 403 })
    }

    // Update question and its options in a transaction
    const updatedPregunta = await prisma.$transaction(async tx => {
      // First, update the question text/points
      await tx.pregunta.update({
        where: { id: preguntaId },
        data: {
          texto,
          tipo,
          puntos: Number(puntos || 1)
        }
      })

      // Delete old options
      await tx.opcionPregunta.deleteMany({
        where: { pregunta_id: preguntaId }
      })

      // Create new options
      await tx.opcionPregunta.createMany({
        data: opciones.map((opt: any, index: number) => ({
          texto: opt.texto,
          es_correcta: Boolean(opt.es_correcta),
          orden: index + 1,
          pregunta_id: preguntaId
        }))
      })

      // Return updated question with options
      return tx.pregunta.findUnique({
        where: { id: preguntaId },
        include: { opciones: { orderBy: { orden: 'asc' } } }
      })
    })

    return NextResponse.json({
      status: true,
      message: 'Pregunta actualizada exitosamente',
      pregunta: updatedPregunta
    })
  } catch (error: any) {
    console.error('API Pregunta PUT Error:', error)

    return NextResponse.json({ status: false, message: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; preguntaId: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ status: false, message: 'No autorizado' }, { status: 401 })
    }

    const { id: cursoId, preguntaId } = params

    // Verify course exists and ownership
    const curso = await prisma.curso.findUnique({
      where: { id: cursoId }
    })

    if (!curso) {
      return NextResponse.json({ status: false, message: 'Curso no encontrado' }, { status: 404 })
    }

    const isOwner = curso.profesor_id === (session.user as any).id
    const isAdmin = session.user.rol === 'ADMIN'

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ status: false, message: 'No tienes permiso para editar este examen' }, { status: 403 })
    }

    // Delete the question (cascade will delete options)
    await prisma.pregunta.delete({
      where: { id: preguntaId }
    })

    return NextResponse.json({
      status: true,
      message: 'Pregunta eliminada exitosamente'
    })
  } catch (error: any) {
    console.error('API Pregunta DELETE Error:', error)

    return NextResponse.json({ status: false, message: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
