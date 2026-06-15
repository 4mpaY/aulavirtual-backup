// Next Imports
import React from 'react'

import { notFound, redirect } from 'next/navigation'

// Auth & Libs
import { AxiosWebCursos } from '@/features/web/cursos/http/axiosWebCursos'

// Component Imports
import CheckoutView from '@/features/web/checkout/components/CheckoutView'

// Server Action / Data Fetching
async function getCourseData(slug: string) {
    try {
        const axiosWebCursos = new AxiosWebCursos()
        const course = await axiosWebCursos.getCourseBySlug(slug)

        if (!course) return null

        return course
    } catch (error) {
        console.error('Error fetching course data for checkout via API:', error)

        return null
    }
}

export default async function CheckoutPage({ params }: { params: { slug: string } }) {
    const course = await getCourseData(params.slug)

    if (!course) {
        notFound()
    }

    if (course.es_gratis || Number(course.precio) === 0) {
        redirect(`/cursos/${params.slug}`)
    }

    return <CheckoutView courses={[course]} ebooks={[]} />
}

export async function generateMetadata() {
    return {
        title: `Checkout - Comprar Curso | Aula Virtual`,
        description: 'Finaliza tu inscripción y comienza a aprender hoy mismo.'
    }
}
