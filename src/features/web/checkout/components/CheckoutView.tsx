'use client'

import { useState } from 'react'

import Link from 'next/link'

import { Container, Grid, Box, Typography } from '@mui/material'
import { ChevronRight, ShoppingCart } from 'lucide-react'

import OrderSummary from './OrderSummary'
import PaymentForm from './PaymentForm'
import { useCurrency } from '@/contexts/CurrencyContext'
import { getDisplayPrice } from '@/utils/functions/formatPrice'

const FONT = 'Poppins, sans-serif'

interface CouponData {
    codigo: string
    descuento: number
    total: number
}

export interface CourseCheckoutItem {
    id: string
    titulo: string
    slug: string
    miniatura?: string
    precio: number
    precio_usd?: number | null
    precio_falso_usd?: number | null
    moneda: string
    profesor: { nombre: string; apellido: string }
}

export interface EbookCheckoutItem {
    id: string
    titulo: string
    slug: string
    miniatura?: string
    precio: number
    moneda: string
}

interface CheckoutViewProps {
    courses: CourseCheckoutItem[]
    ebooks: EbookCheckoutItem[]
}

const CheckoutView = ({ courses, ebooks }: CheckoutViewProps) => {
    const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)
    const { currency } = useCurrency()

    // Solo afecta lo que se muestra al usuario (precio y símbolo). El monto realmente
    // cobrado siempre lo resuelve el servidor a partir del curso en base de datos.
    const displayCourses = courses.map(c => {
        const { amount, currency: resolvedCurrency } = getDisplayPrice(c, currency)

        return { ...c, precio: amount, moneda: resolvedCurrency }
    })

    const hasOnlyEbooks = courses.length === 0 && ebooks.length > 0

    const breadcrumbBack = hasOnlyEbooks
        ? { label: 'Ebooks', href: '/ebooks' }
        : { label: 'Cursos', href: courses[0] ? `/cursos/${courses[0].slug}` : '/cursos' }

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)', fontFamily: FONT }}>
            {/* Mini hero */}
            <Box sx={{
                background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)',
                py: { xs: 4, md: 5 },
                px: { xs: 3, md: 8, lg: 12 },
                position: 'relative',
                overflow: 'hidden',
            }}>
                <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
                        {[
                            { label: 'Inicio', href: '/' },
                            breadcrumbBack,
                        ].map((item, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <Link href={item.href} style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
                                    {item.label}
                                </Link>
                                <ChevronRight size={12} color="rgba(255,255,255,0.3)" />
                            </Box>
                        ))}
                        <span style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--web-light, #BDD962)' }}>Checkout</span>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(var(--web-light-rgb,189,217,98),0.15)', border: '1px solid rgba(var(--web-light-rgb,189,217,98),0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingCart size={22} color="var(--web-light, #BDD962)" />
                        </Box>
                        <Box>
                            <Typography sx={{ fontFamily: FONT, fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#fff', lineHeight: 1.1 }}>
                                Finalizar Compra
                            </Typography>
                            <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 400, mt: 0.25 }}>
                                Estás a un paso de comenzar tu transformación profesional.
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* Content */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} lg={4} sx={{ order: { xs: 1, lg: 2 } }}>
                        <OrderSummary
                            courses={displayCourses}
                            ebooks={ebooks}
                            appliedCoupon={appliedCoupon}
                            onCouponApplied={setAppliedCoupon}
                        />
                    </Grid>

                    <Grid item xs={12} lg={8} sx={{ order: { xs: 2, lg: 1 } }}>
                        <PaymentForm
                            courses={displayCourses}
                            ebooks={ebooks}
                            appliedCouponCode={appliedCoupon?.codigo}
                            finalTotal={appliedCoupon ? appliedCoupon.total : undefined}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default CheckoutView
