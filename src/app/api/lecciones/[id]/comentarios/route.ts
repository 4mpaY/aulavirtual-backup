export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { getAuthSession } from '@/utils/libs/auth-helpers'

import prisma from '@/utils/libs/prisma'

// GET: Obtener comentarios de una lección particular
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const leccionId = params.id

    // Solo traemos comentarios raíz (sin respuesta_a_id) y luego sus respuestas
    const comentarios = await prisma.comentario.findMany({
      where: {
        leccion_id: leccionId,
        respuesta_a_id: null
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            avatar: true,
            rol: true
          }
        },
        respuestas: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                avatar: true,
                rol: true
              }
            }
          },
          orderBy: {
            creado_en: 'asc'
          }
        }
      },
      orderBy: {
        creado_en: 'desc'
      }
    })

    return NextResponse.json(comentarios)
  } catch (error) {
    console.error('Error fetching comentarios:', error)

    return NextResponse.json({ error: 'Error al obtener los comentarios' }, { status: 500 })
  }
}

// POST: Crear un nuevo comentario o responder
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const leccionId = params.id
    const body = await request.json()
    const { contenido, respuesta_a_id } = body

    if (!contenido || contenido.trim() === '') {
      return NextResponse.json({ error: 'El contenido es requerido' }, { status: 400 })
    }

    // Verificamos si la lección existe
    const leccion = await prisma.leccion.findUnique({
      where: { id: leccionId }
    })

    if (!leccion) {
      return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 })
    }

    // Si es una respuesta, verificamos que el comentario padre exista y pertenezca a la misma lección
    if (respuesta_a_id) {
      const parentComment = await prisma.comentario.findUnique({
        where: { id: respuesta_a_id }
      })

      if (!parentComment || parentComment.leccion_id !== leccionId) {
        return NextResponse.json(
          { error: 'El comentario original no existe o no pertenece a esta lección' },
          { status: 400 }
        )
      }
    }

    const nuevoComentario = await prisma.comentario.create({
      data: {
        contenido: contenido.trim(),
        usuario_id: session.user.id,
        leccion_id: leccionId,
        respuesta_a_id: respuesta_a_id || null
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            avatar: true,
            rol: true
          }
        },
        leccion: {
          include: {
            modulo: {
              include: {
                curso: {
                  include: {
                    profesor: true
                  }
                }
              }
            }
          }
        }
      }
    })

    // --- Lógica de Notificaciones ---
    try {
      const curso = nuevoComentario.leccion.modulo.curso
      const profesorId = curso.profesor_id

        if (!respuesta_a_id) {
          // Es un comentario nuevo -> Notificar al profesor (si el que comenta no es el mismo profesor)
          if (session.user.id !== profesorId) {
            await prisma.notificacion.create({
              data: {
                titulo: 'Nuevo comentario en tu curso',
                mensaje: `${session.user.name} comentó en "${nuevoComentario.leccion.titulo}" de tu curso "${curso.titulo}"`,
                tipo: 'COMENTARIO_NUEVO',
                usuario_id: profesorId,
                enlace: `/profesor/cursos/${curso.id}`
              }
            })
          }
        } else {
          // Es una respuesta
          const comentarioOriginal = await prisma.comentario.findUnique({
            where: { id: respuesta_a_id },
            include: { usuario: true }
          })

          if (comentarioOriginal && comentarioOriginal.usuario_id !== session.user.id) {
            const originalOwnerRol = comentarioOriginal.usuario.rol

            // El Alumno recibe notificación si le responden (desde profesor o admin)
            if (originalOwnerRol === 'ESTUDIANTE') {
              await prisma.notificacion.create({
                data: {
                  titulo: 'Respuesta en el curso',
                  mensaje: `Han respondido a tu comentario en "${nuevoComentario.leccion.titulo}"`,
                  tipo: 'RESPUESTA_COMENTARIO',
                  usuario_id: comentarioOriginal.usuario_id,
                  enlace: `/estudiante/aprender/${curso.slug}?lessonId=${leccionId}`
                }
              })
            }
          }
        }
    } catch (notifError) {
      console.error('Error al crear notificación:', notifError)

      // No bloqueamos la creación del comentario si la notificación falla
    }

    return NextResponse.json(nuevoComentario, { status: 201 })
  } catch (error) {
    console.error('Error creating comentario:', error)

    return NextResponse.json({ error: 'Error al crear el comentario' }, { status: 500 })
  }
}
