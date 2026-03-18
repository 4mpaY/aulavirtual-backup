// Next Imports
import React from 'react'

import { Box } from '@mui/material'

// Component Imports
import { getServerSession } from 'next-auth'

import CourseCatalog from '@/features/web/home/components/CourseCatalog'

// Auth Imports
import { authOptions } from '@/utils/configs/auth'

// Lib Imports
import prisma from '@/utils/libs/prisma'

// Server Action / Data Fetching
async function getData(userId?: string) {
  try {
    const [courses, categories] = await Promise.all([
      prisma.curso.findMany({
        where: {
          estado: 'PUBLICADO'
        },
        include: {
          profesor: {
            select: { nombre: true, apellido: true, avatar: true }
          },
          categoria: {
            select: { id: true, nombre: true }
          },
          _count: {
            select: { modulos: true }
          }
        },
        orderBy: {
          creado_en: 'desc'
        }
      }),
      prisma.categoria.findMany({
        where: {
          esta_activo: true
        },
        select: {
          id: true,
          nombre: true
        },
        orderBy: {
          orden: 'asc'
        }
      })
    ])

    // Buscar inscripciones si el usuario está logueado
    let userCourseIds = new Set<string>()

    if (userId) {
      const inscripciones = await prisma.inscripcion.findMany({
        where: { usuario_id: userId, estado: 'ACTIVO' },
        select: { curso_id: true }
      })

      userCourseIds = new Set(inscripciones.map((i: any) => i.curso_id))
    }

    // Agregar conteo de lecciones e indicador de si está comprado
    const coursesWithLecciones = await Promise.all(
      courses.map(async (course) => {
        const leccionesCount = await prisma.leccion.count({
          where: { modulo: { curso_id: course.id } }
        })

        return {
          ...course,
          es_comprado: userId ? userCourseIds.has(course.id) : false,
          _count: {
            ...course._count,
            lecciones: leccionesCount
          }
        }
      })
    )

    return {
      courses: JSON.parse(JSON.stringify(coursesWithLecciones)),
      categories: JSON.parse(JSON.stringify(categories))
    }
  } catch (error) {
    console.error('Error fetching data in HomePage:', error)

    return { courses: [], categories: [] }
  }
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const { courses, categories } = await getData(session?.user?.id)

  return (
    <>
      {/* Catalog Section (Main content) */}
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <CourseCatalog courses={courses} categories={categories} />
      </Box>
    </>
  )
}

// NextJS Metadata


export const metadata = {
  title: 'Catálogo de Cursos - Aula Virtual',
  description: 'Explora nuestra amplia variedad de cursos y comienza a aprender hoy mismo.'
}
