'use client'

import { Box, Typography, Stack, Divider, Paper } from '@mui/material'
import { ShieldCheck } from 'lucide-react'

import CourseThumbnail from '@/utils/components/CourseThumbnail'
import CouponInput from './CouponInput'

const FONT = 'Poppins, sans-serif'

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
                border: '1.5px solid hsl(214,20%,91%)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                position: 'sticky',
                top: 100
            }}
        >
            <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.25rem', color: '#0A0A0A', mb: 3 }}>
                Resumen del <span style={{ color: 'var(--web-primary, #25927F)' }}>Pedido</span>
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
                                    <Typography noWrap sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.8125rem', lineHeight: 1.2, mb: 0.25, color: '#0A0A0A' }}>
                                        {course.titulo}
                                    </Typography>
                                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
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
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#64748b' }}>Precio de los cursos</Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', fontWeight: 600, color: '#0A0A0A' }}>{moneda} {subtotal.toFixed(2)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#64748b' }}>Descuento</Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', fontWeight: 600, color: '#16a34a' }}>
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
                    <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1rem', color: '#0A0A0A' }}>Total</Typography>
                    <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.375rem', color: 'var(--web-primary, #25927F)' }}>
                        {moneda} {total.toFixed(2)}
                    </Typography>
                </Stack>

                <Box sx={{ p: 2, backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.07)', borderRadius: '16px', border: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127), 0.2)' }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box sx={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--web-primary, #25927F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldCheck size={16} color="#ffffff" />
                        </Box>
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 600, color: 'var(--web-dark, #025E44)', lineHeight: 1.35 }}>
                            Compra 100% segura. Acceso inmediato tras confirmar el pago.
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    )
}

export default OrderSummary
