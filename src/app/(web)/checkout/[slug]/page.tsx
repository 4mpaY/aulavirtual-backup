// Next Imports
import React from 'react'

import { notFound } from 'next/navigation'

import { Container, Stack, Box, Typography, Divider } from '@mui/material'

// Component Imports
import { getServerSession } from 'next-auth'

import CheckoutView from '@/features/web/checkout/components/CheckoutView'
import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'

// Auth Imports
import { authOptions } from '@/utils/configs/auth'

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
    const session = await getServerSession(authOptions)

    if (!course) {
        notFound()
    }

    return (
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header Simplified */}
            <Box sx={{ py: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Logo />
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                                ¿Tienes dudas? <b>WhatsApp +51 999 999 999</b>
                            </Typography>
                            {session ? <UserDropdown /> : null}
                        </Stack>
                    </Stack>
                </Container>
            </Box>

            {/* Checkout Content */}
            <CheckoutView courses={[course]} />

            {/* Footer Footer */}
            <Box sx={{ bgcolor: 'background.paper', py: 6, borderTop: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4}>
                        <Logo />
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                                © 2026 Aula Virtual EdTech
                            </Typography>
                            <Divider orientation="vertical" flexItem sx={{ height: 16 }} />
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Pagos Seguros vía SSL</Typography>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    )
}

export async function generateMetadata() {
    return {
        title: `Checkout - Comprar Curso | Aula Virtual`,
        description: 'Finaliza tu inscripción y comienza a aprender hoy mismo.'
    }
}
