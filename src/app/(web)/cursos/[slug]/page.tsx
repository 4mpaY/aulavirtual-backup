// Next Imports
import React from 'react'

import { notFound } from 'next/navigation'

import { Box } from '@mui/material'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { AxiosWebCursos } from '@/features/web/cursos/http/axiosWebCursos'

// Component Imports
import CourseDetail from '@/features/web/courses/components/CourseDetail'

// Server Action / Data Fetching
async function getCourseData(slug: string, token: string | null) {
    try {
        const axiosWebCursos = new AxiosWebCursos({
            getAuthToken: () => token
        })

        const data = await axiosWebCursos.getCourseBySlug(slug)

        return data
    } catch (error) {
        console.error('Error fetching course data via API:', error)

        return null
    }
}

export default async function CourseDetailPage({ 
    params
}: { 
    params: { slug: string }
}) {
    const session = await getAuthSession()
    const token = session?.user?.accessToken ?? null
    
    const course = await getCourseData(params.slug, token)

    if (!course) {
        notFound()
    }

    // Redirigir a la landing page para todos los cursos (si no lo ha comprado) - DESACTIVADO POR PETICIÓN
    // if (!course.es_comprado && searchParams?.skipLanding !== 'true') {
    //     redirect(`/landing/${course.slug}`)
    // }

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
            <CourseDetail course={course} />
        </Box>
    )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const course = await getCourseData(params.slug, null)

    if (!course) return { title: 'Curso no encontrado' }

    return {
        title: course.titulo,
        description: course.descripcion || 'Detalles del curso en nuestra plataforma EdTech.'
    }
}
