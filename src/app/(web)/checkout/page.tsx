'use client'

import React, { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Box, CircularProgress } from '@mui/material'

import CheckoutView from '@/features/web/checkout/components/CheckoutView'
import { useCart } from '@/features/web/cart/context/CartContext'
import SoutPageShell from '@sout/components/layout/SoutPageShell'

export default function CartCheckoutPage() {
    const { cart, itemCount } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (itemCount === 0) {
            router.push('/cursos')
        }
    }, [itemCount, router])

    if (itemCount === 0) {
        return (
            <SoutPageShell>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </Box>
            </SoutPageShell>
        )
    }

    const courseItems = cart.filter(item => item.type === 'CURSO' || !item.type)
    const ebookItems = cart.filter(item => item.type === 'EBOOK')

    const courses = courseItems.map(item => ({
        id: item.id,
        titulo: item.titulo,
        slug: item.slug,
        miniatura: item.miniatura,
        precio: item.precio,
        moneda: item.moneda || 'PEN',
        profesor: { nombre: 'Instructor', apellido: '' }
    }))

    const ebooks = ebookItems.map(item => ({
        id: item.id,
        titulo: item.titulo,
        slug: item.slug,
        miniatura: item.miniatura,
        precio: item.precio,
        moneda: item.moneda || 'PEN',
    }))

    return (
        <SoutPageShell>
            <CheckoutView courses={courses} ebooks={ebooks} />
        </SoutPageShell>
    )
}
