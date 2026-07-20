'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
    id: string
    type: 'CURSO' | 'EBOOK'
    titulo: string
    slug: string
    miniatura?: string
    precio: number
    precio_usd?: number | null
    moneda: string
}

interface CartContextType {
    cart: CartItem[]
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
    isInCart: (id: string) => boolean
    cartTotal: number
    itemCount: number
    isCartDrawerOpen: boolean
    setIsCartDrawerOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart:v2')

            if (savedCart) {
                setCart(JSON.parse(savedCart))
            }
        } catch {
            // Safari private mode, quota exceeded, or disabled
        }
    }, [])

    useEffect(() => {
        try {
            localStorage.setItem('cart:v2', JSON.stringify(cart))
        } catch {
            // Safari private mode, quota exceeded, or disabled
        }
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            if (prev.some((i) => i.id === item.id)) return prev

            return [...prev, item]
        })
        setIsCartDrawerOpen(true)
    }

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id))
    }

    const clearCart = () => {
        setCart([])
    }

    const isInCart = (id: string) => cart.some((item) => item.id === id)

    const cartTotal = cart.reduce((total, item) => total + item.precio, 0)
    const itemCount = cart.length

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                isInCart,
                cartTotal,
                itemCount,
                isCartDrawerOpen,
                setIsCartDrawerOpen
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }

    return context
}
