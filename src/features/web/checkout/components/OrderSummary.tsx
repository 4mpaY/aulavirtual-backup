'use client'

import React from 'react'
import { Box, Typography, Stack, Divider, Paper, Avatar } from '@mui/material'

interface OrderSummaryProps {
    course: {
        titulo: string
        miniatura?: string
        precio: number
        moneda: string
        profesor: {
            nombre: string
            apellido: string
        }
    }
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ course }) => {
    const subtotal = Number(course.precio)
    const igv = subtotal * 0.18 // 18% IGV (Ejemplo Perú)
    const total = subtotal // Asumiendo que el precio ya incluye IGV o es total

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 4 },
                borderRadius: '24px',
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 100
            }}
        >
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                Resumen del <span style={{ color: 'var(--mui-palette-primary-main)' }}>Pedido</span>
            </Typography>

            <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            width: 100,
                            height: 60,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Box
                            component="img"
                            src={course.miniatura || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}>
                            {course.titulo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Prof. {course.profesor.nombre} {course.profesor.apellido}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Precio del curso</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{course.moneda} {subtotal.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Descuento</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>- {course.moneda} 0.00</Typography>
                    </Stack>
                </Stack>

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {course.moneda} {total.toFixed(2)}
                    </Typography>
                </Stack>

                <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: '16px', border: '1px dashed', borderColor: 'primary.light' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            <i className="tabler-shield-check" style={{ fontSize: '1.2rem' }} />
                        </Avatar>
                        <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.dark', lineHeight: 1.2 }}>
                            Compra 100% segura. Acceso inmediato tras confirmar el pago.
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    )
}

export default OrderSummary
