'use client'


import { Box, Typography, Stack, Divider, Paper, Avatar } from '@mui/material'

import CourseThumbnail from '@/utils/components/CourseThumbnail'
import CouponInput from './CouponInput'

interface OrderSummaryProps {
    courses: {
        id: string
        titulo: string
        miniatura?: string
        precio: number
        moneda: string
        profesor: {
            nombre: string
            apellido: string
        }
    }[]
    appliedCoupon?: {
        codigo: string
        descuento: number
        total: number
    } | null
    onCouponApplied: (data: any) => void
}

const OrderSummary = ({ courses, appliedCoupon, onCouponApplied }: OrderSummaryProps) => {
    const subtotal = courses.reduce((acc, c) => acc + Number(c.precio), 0)
    const total = appliedCoupon ? appliedCoupon.total : subtotal
    const descuento = appliedCoupon ? appliedCoupon.descuento : 0
    const moneda = courses[0]?.moneda || 'PEN'

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
                <Box sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                    <Stack spacing={2}>
                        {courses.map((course) => (
                            <Stack key={course.id} direction="row" spacing={2} alignItems="center">
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 50,
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        flexShrink: 0,
                                        border: '1px solid',
                                        borderColor: 'divider'
                                    }}
                                >
                                    <CourseThumbnail
                                        src={course.miniatura}
                                        title={course.titulo}
                                        variant='simple'
                                    />
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.2 }} noWrap>
                                        {course.titulo}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        {course.moneda} {Number(course.precio).toFixed(2)}
                                    </Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Stack>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Precio de los cursos</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{moneda} {subtotal.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Descuento</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            - {moneda} {descuento.toFixed(2)}
                        </Typography>
                    </Stack>
                </Stack>

                <CouponInput 
                    cursoIds={courses.map(c => c.id)} 
                    onApplied={onCouponApplied} 
                />

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Total</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>
                        {moneda} {total.toFixed(2)}
                    </Typography>
                </Stack>

                <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: '16px', border: '1px solid', borderColor: 'primary.light' }}>
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
