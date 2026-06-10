'use client'

import { Button } from '@mui/material'

import { useCart } from '@/features/web/cart/context/CartContext'

interface Props {
  ebook: {
    id: string
    titulo: string
    slug: string
    miniatura?: string | null
    precio: number
    moneda: string
  }
}

export const AddEbookToCartButton = ({ ebook }: Props) => {
  const { addToCart, isInCart } = useCart()
  const enCarrito = isInCart(ebook.id)

  const handleAdd = () => {
    addToCart({
      id: ebook.id,
      type: 'EBOOK',
      titulo: ebook.titulo,
      slug: ebook.slug,
      miniatura: ebook.miniatura ?? undefined,
      precio: ebook.precio,
      moneda: ebook.moneda,
    })
  }

  return (
    <Button
      variant='contained'
      color='primary'
      fullWidth
      size='large'
      onClick={handleAdd}
      disabled={enCarrito}
      startIcon={<i className={enCarrito ? 'tabler-check' : 'tabler-shopping-cart'} />}
    >
      {enCarrito ? 'En el carrito' : 'Agregar al carrito'}
    </Button>
  )
}
