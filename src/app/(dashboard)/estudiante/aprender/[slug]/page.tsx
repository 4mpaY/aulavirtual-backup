import React from 'react'

import { notFound, redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import prisma from '@/utils/libs/prisma'
import { authOptions } from '@/utils/configs/auth'
import CoursePlayerView from '@/features/estudiante/player/components/CoursePlayerView'

async function getCoursePlayerData(slug: string, userId: string) {
  try {
    const course = await prisma.curso.findUnique({
      where: { slug },
      include: {
        modulos: {
          include: {
            lecciones: {
              include: {
                progreso: {
                  where: { usuario_id: userId }
                }
              },
              orderBy: { orden: 'asc' }
            }
          },
          orderBy: { orden: 'asc' }
        }
      }
    })

    if (!course) return null

    // Verificar si el usuario está inscrito
    const inscription = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: userId,
          curso_id: course.id
        }
      }
    })

    if (!inscription || inscription.estado !== 'ACTIVO') {
      return { error: 'UNCISCRIBED' }
    }

    // Formatear datos para el componente
    const formattedCourse = {
      id: course.id,
      titulo: course.titulo,
      modulos: course.modulos.map(m => ({
        id: m.id,
        titulo: m.titulo,
        orden: m.orden,
        lecciones: m.lecciones.map(l => ({
          id: l.id,
          titulo: l.titulo,
          contenido: l.contenido,
          orden: l.orden,
          video_url: l.video_url,
          completada: l.progreso[0]?.esta_completado || false,
          recursos: l.recursos as any[] || []
        }))
      }))
    }

    return { course: JSON.parse(JSON.stringify(formattedCourse)) }
  } catch (error) {
    console.error('Error fetching course player data:', error)

    return null
  }
}

export default async function LearningPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const data = await getCoursePlayerData(params.slug, session.user.id)

  if (!data) {
    notFound()
  }

  if (data.error === 'UNCISCRIBED') {
    redirect(`/cursos/${params.slug}`)
  }

  return (
    <CoursePlayerView
      course={data.course}
    />
  )
}
