'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface CartItem {
    id: string
    titulo: string
    slug: string
    miniatura?: string
    precio: number
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

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart:v1')

            if (savedCart) {
                setCart(JSON.parse(savedCart))
            }
        } catch {
            // Safari private mode, quota exceeded, or disabled
        }
    }, [])

    // Save cart to localStorage on changes
    useEffect(() => {
        try {
            localStorage.setItem('cart:v1', JSON.stringify(cart))
        } catch {
            // Safari private mode, quota exceeded, or disabled
        }
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart((prev) => {
            if (prev.some((i) => i.id === item.id)) return prev

            return [...prev, item]
        })
        setIsCartDrawerOpen(true) // Open cart drawer on adding item
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
