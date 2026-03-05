import React from 'react'
import { Container, Typography, Box, Stack } from '@mui/material'
import MyCoursesList from '@/features/estudiante/mis-cursos/components/MyCoursesList'
import prisma from '@/utils/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/configs/auth'
import { redirect } from 'next/navigation'

async function getInscribedCourses(userId: string) {
    try {
        const inscriptions = await prisma.inscripcion.findMany({
            where: {
                usuario_id: userId,
                estado: 'ACTIVO'
            },
            include: {
                curso: {
                    include: {
                        profesor: {
                            select: { nombre: true, apellido: true }
                        },
                        categoria: {
                            select: { nombre: true }
                        },
                        progreso: {
                            where: { usuario_id: userId }
                        }
                    }
                }
            }
        })

        return inscriptions.map(ins => ({
            id: ins.curso.id,
            titulo: ins.curso.titulo,
            slug: ins.curso.slug,
            miniatura: ins.curso.miniatura,
            profesor: ins.curso.profesor,
            categoria: ins.curso.categoria?.nombre,
            progreso: ins.curso.progreso[0]?.porcentaje_progreso || 0
        }))
    } catch (error) {
        console.error('Error fetching inscribed courses:', error)
        return []
    }
}

export default async function MyCoursesPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const courses = await getInscribedCourses(session.user.id)

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                            Mis <span style={{ color: 'var(--mui-palette-primary-main)' }}>Cursos</span>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                            Gestiona tu aprendizaje y sigue tu progreso en cada curso.
                        </Typography>
                    </Box>

                    <MyCoursesList courses={courses} />
                </Stack>
            </Container>
        </Box>
    )
}
