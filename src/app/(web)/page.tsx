// Next Imports
import React from 'react'

import { Container, Stack, Button, Box, Typography, Divider } from '@mui/material'

// Component Imports
import { getServerSession } from 'next-auth'

import CourseCatalog from '@/features/web/home/components/CourseCatalog'
import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'

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
    <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header / Nav */}
      <Box sx={{ py: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Logo />
            <Stack direction="row" spacing={2} alignItems="center">
              <CartIcon />
              {session ? (
                <UserDropdown />
              ) : (
                <>
                  <Button href="/login" color="inherit" sx={{ fontWeight: 600 }}>Iniciar Sesión</Button>
                  <Button href="/register" variant="contained" sx={{ fontWeight: 600, borderRadius: '10px' }}>Registrarse</Button>
                </>
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Catalog Section (Main content) */}
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <CourseCatalog courses={courses} categories={categories} />
      </Box>

      {/* Footer básico */}
      <Box sx={{ bgcolor: 'background.paper', py: 6, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4}>
            <Logo />
            <Stack direction="row" spacing={3} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                © 2026 ELITE EdTech
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ height: 16 }} />
              <Typography variant="body2" component="a" href="#" sx={{ color: 'text.secondary', textDecoration: 'none' }}>Privacidad</Typography>
              <Typography variant="body2" component="a" href="#" sx={{ color: 'text.secondary', textDecoration: 'none' }}>Términos</Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

// NextJS Metadata


export const metadata = {
  title: 'Catálogo de Cursos - Aula Virtual',
  description: 'Explora nuestra amplia variedad de cursos y comienza a aprender hoy mismo.'
}
