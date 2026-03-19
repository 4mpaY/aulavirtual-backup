// Next Imports
import React from 'react'

import { notFound } from 'next/navigation'

// Component Imports
import CheckoutView from '@/features/web/checkout/components/CheckoutView'

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
                    select: { nombre: true, apellido: true }
                }
            }
        })

        if (!course) return null

        return JSON.parse(JSON.stringify(course))
    } catch (error) {
        console.error('Error fetching course data for checkout:', error)

        return null
    }
}

export default async function CheckoutPage({ params }: { params: { slug: string } }) {
    const course = await getCourseData(params.slug)

    if (!course) {
        notFound()
    }

    return <CheckoutView courses={[course]} />
}

export async function generateMetadata() {
    return {
        title: `Checkout - Comprar Curso | Aula Virtual`,
        description: 'Finaliza tu inscripción y comienza a aprender hoy mismo.'
    }
}
