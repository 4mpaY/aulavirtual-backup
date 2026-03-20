import { getAuthSession } from '@/utils/libs/auth-helpers'
import { NextResponse } from 'next/server'


import prisma from '@/utils/libs/prisma'


export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession()
    
    if (!session || !session.user) {
      return NextResponse.json({ status: false, message: 'No autorizado' }, { status: 401 })
    }

    const { id: cursoId } = params
    const { texto, tipo, puntos, opciones } = await req.json()

    if (!texto || !tipo || !opciones || !Array.isArray(opciones) || opciones.length === 0) {
      return NextResponse.json({ status: false, message: 'Faltan datos requeridos o las opciones son inválidas' }, { status: 400 })
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

    // Get the exam for this course
    const examen = await prisma.examen.findFirst({
      where: { curso_id: cursoId }
    })

    if (!examen) {
       return NextResponse.json({ status: false, message: 'Primero debe crear la configuración inicial del examen' }, { status: 404 })
    }

    // Determine the next order number
    const maxOrden = await prisma.pregunta.aggregate({
      where: { examen_id: examen.id },
      _max: { orden: true }
    })

    const nextOrden = (maxOrden._max.orden || 0) + 1

    // Create question and its options in a transaction
    const nuevaPregunta = await prisma.pregunta.create({
      data: {
        texto,
        tipo,
        puntos: Number(puntos || 1),
        orden: nextOrden,
        examen_id: examen.id,
        opciones: {
          create: opciones.map((opt: any, index: number) => ({
            texto: opt.texto,
            es_correcta: Boolean(opt.es_correcta),
            orden: index + 1
          }))
        }
      },
      include: {
        opciones: true
      }
    })

    return NextResponse.json({ 
      status: true, 
      message: 'Pregunta agregada exitosamente',
      pregunta: nuevaPregunta 
    })
  } catch (error: any) {
    console.error('API Pregunta POST Error:', error)
    
return NextResponse.json({ status: false, message: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
