// Next Imports
import React from 'react'

import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Container, Stack, Button, Box, Typography, Divider } from '@mui/material'

// Component Imports
import CourseDetail from '@/features/web/courses/components/CourseDetail'
import Logo from '@components/layout/shared/Logo'

// Lib Imports
import prisma from '@/utils/libs/prisma'

// Server Action / Data Fetching
async function getCourseData(slug: string) {
    try {
        const course = await prisma.curso.findUnique({
            where: {
                slug,
                estado: 'PUBLICADO'
            },
            include: {
                profesor: {
                    select: { nombre: true, apellido: true, avatar: true }
                },
                categoria: {
                    select: { id: true, nombre: true }
                },
                modulos: {
                    include: {
                        lecciones: {
                            orderBy: { orden: 'asc' }
                        }
                    },
                    orderBy: { orden: 'asc' }
                }
            }
        })

        if (!course) return null

        return JSON.parse(JSON.stringify(course))
    } catch (error) {
        console.error('Error fetching course data:', error)

        return null
    }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
    const course = await getCourseData(params.slug)

    if (!course) {
        notFound()
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header / Nav */}
            <Box sx={{ py: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Link href="/">
                            <Logo />
                        </Link>
                        <Stack direction="row" spacing={2}>
                            <Button href="/" color="inherit" sx={{ fontWeight: 600 }}>Volver al Catálogo</Button>
                            <Button href="/login" variant="contained" sx={{ fontWeight: 600, borderRadius: '10px' }}>Iniciar Sesión</Button>
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Course Detail Content */}
            <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
                <CourseDetail course={course} />
            </Box>

            {/* Footer básico */}
            <Box sx={{ bgcolor: 'background.paper', py: 6, borderTop: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4}>
                        <Logo />
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                © 2026 Aula Virtual EdTech
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

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const course = await getCourseData(params.slug)

    if (!course) return { title: 'Curso no encontrado' }

    return {
        title: `${course.titulo} | Aula Virtual`,
        description: course.descripcion || 'Detalles del curso en nuestra plataforma EdTech.'
    }
}
