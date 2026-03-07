'use client'

import React from 'react'

import Link from 'next/link'

import { Container, Grid, Box, Typography, Breadcrumbs } from '@mui/material'

import OrderSummary from './OrderSummary'
import PaymentForm from './PaymentForm'

interface CheckoutViewProps {
    course: {
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
    }
}

const CheckoutView: React.FC<CheckoutViewProps> = ({ course }) => {
    return (
        <Box sx={{ py: { xs: 4, md: 8 }, bgcolor: '#f8fafc', minHeight: 'calc(100vh - 100px)' }}>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4 }}>
                    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                        <Typography component={Link} href="/" color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                            Inicio
                        </Typography>
                        <Typography component={Link} href={`/cursos/${course.slug}`} color="inherit" sx={{ textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
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

                <Grid container spacing={5}>
                    {/* Formulario de Pago */}
                    <Grid item xs={12} md={7} lg={8}>
                        <PaymentForm course={course} />
                    </Grid>

                    {/* Resumen del Pedido */}
                    <Grid item xs={12} md={5} lg={4}>
                        <OrderSummary course={course} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default CheckoutView
