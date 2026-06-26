'use client'

import { ShoppingCart } from 'lucide-react'

import { useCart } from '@/features/web/cart/context/CartContext'
import { cn } from '@sout/lib/utils'

type Props = {
  className?: string
}

export default function SoutCartButton({ className }: Props) {
  const { itemCount, setIsCartDrawerOpen } = useCart()

  return (
    <button
      type="button"
      onClick={() => setIsCartDrawerOpen(true)}
      className={cn(
        'sout-cart-trigger relative inline-flex items-center justify-center overflow-hidden rounded-full border border-border bg-background p-0 text-gray-800 outline-none transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40 shrink-0',
        className
      )}
      aria-label={`Carrito${itemCount > 0 ? `, ${itemCount} artículos` : ''}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 ? (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      ) : null}
    </button>
  )
}
