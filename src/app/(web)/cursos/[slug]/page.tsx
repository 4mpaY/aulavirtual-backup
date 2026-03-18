// Next Imports
import React from 'react'

import { notFound } from 'next/navigation'

import { Box } from '@mui/material'

// Component Imports
import { getServerSession } from 'next-auth'

import CourseDetail from '@/features/web/courses/components/CourseDetail'

// Auth Imports
import { authOptions } from '@/utils/configs/auth'

// Lib Imports
import prisma from '@/utils/libs/prisma'

// Server Action / Data Fetching
async function getCourseData(slug: string, userId?: string) {
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

        let es_comprado = false

        if (userId) {
            const inscripcion = await prisma.inscripcion.findFirst({
                where: {
                    usuario_id: userId,
                    curso_id: course.id,
                    estado: 'ACTIVO'
                }
            })

            if (inscripcion) {
                es_comprado = true
            }
        }

        return JSON.parse(JSON.stringify({ ...course, es_comprado }))
    } catch (error) {
        console.error('Error fetching course data:', error)

        return null
    }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
    const session = await getServerSession(authOptions)
    const course = await getCourseData(params.slug, session?.user?.id)

    if (!course) {
        notFound()
    }

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
            <CourseDetail course={course} />
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
