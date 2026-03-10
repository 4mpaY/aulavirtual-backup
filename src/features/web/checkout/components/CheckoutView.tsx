'use client'

import React from 'react'

import Link from 'next/link'

import { Container, Grid, Box, Typography, Breadcrumbs } from '@mui/material'

import OrderSummary from './OrderSummary'
import PaymentForm from './PaymentForm'

interface CheckoutViewProps {
    courses: {
        id: string
        titulo: string
        slug: string
        miniatura?: string
        precio: number
        moneda: string
        profesor: {
            nombre: string
            apellido: string
        }
    }[]
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ courses }) => {
    // Assuming for the breadcrumb, we might link to the first course or a general courses page.
    // For now, let's use the slug of the first course if available, or a placeholder.
    const firstCourseSlug = courses.length > 0 ? courses[0].slug : 'cursos';

    return (
        <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: '#f8fafc', minHeight: 'calc(100vh - 100px)' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <Typography component={Link} href="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                            Inicio
                        </Typography>
                        <Typography component={Link} href={`/cursos/${firstCourseSlug}`} color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                            Curso
                        </Typography>
                        <Typography color="text.primary" sx={{ fontWeight: 600 }}>Checkout</Typography>
                    </Breadcrumbs>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                        Finalizar <span style={{ color: 'var(--mui-palette-primary-main)' }}>Compra</span>
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                        Estás a un paso de comenzar tu transformación profesional.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Formulario de Pago */}
                    <Grid item xs={12} lg={8}>
                        <PaymentForm courses={courses} />
                    </Grid>

                    {/* Resumen de Pedido */}
                    <Grid item xs={12} lg={4}>
                        <OrderSummary courses={courses} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default CheckoutView
