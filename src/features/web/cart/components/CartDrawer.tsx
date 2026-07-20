'use client'

import { useRouter } from 'next/navigation'

import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Button,
    Divider,
    Stack,
    Chip
} from '@mui/material'

import CourseThumbnail from '@/utils/components/CourseThumbnail'

import { useCart } from '../context/CartContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { formatPrice, getDisplayPrice } from '@/utils/functions/formatPrice'

const CartDrawer = () => {
    const { cart, removeFromCart, itemCount, isCartDrawerOpen, setIsCartDrawerOpen } = useCart()
    const router = useRouter()
    const { currency } = useCurrency()

    const onClose = () => setIsCartDrawerOpen(false)

    const handleCheckout = () => {
        onClose()

        if (cart.length > 0) {
            router.push('/checkout')
        }
    }

    const displayItems = cart.map(item => ({ item, display: getDisplayPrice(item, currency) }))
    const moneda = displayItems[0]?.display.currency || 'PEN'
    const cartTotal = displayItems.reduce((acc, { display }) => acc + display.amount, 0)

    return (
        <Drawer anchor="right" open={isCartDrawerOpen} onClose={onClose}>
            <Box sx={{ width: { xs: '100vw', sm: 400 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight={800}>
                        Mi Carrito ({itemCount})
                    </Typography>
                    <IconButton onClick={onClose}>
                        <i className="tabler-x" />
                    </IconButton>
                </Box>

                <Divider />

                {/* Items List */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                    {cart.length === 0 ? (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                            <i className="tabler-shopping-cart-off text-6xl text-textDisabled" />
                            <Typography variant="h6" color="text.secondary">Tu carrito está vacío</Typography>
                            <Button variant="outlined" onClick={onClose} sx={{ borderRadius: '10px' }}>
                                Explorar Catálogo
                            </Button>
                        </Box>
                    ) : (
                        <List>
                            {displayItems.map(({ item, display }) => (
                                <ListItem
                                    key={item.id}
                                    secondaryAction={
                                        <IconButton edge="end" color="error" onClick={() => removeFromCart(item.id)}>
                                            <i className="tabler-trash" />
                                        </IconButton>
                                    }
                                    sx={{ mb: 2, bgcolor: 'background.paper', borderRadius: '12px', border: '1px solid', borderColor: 'divider' }}
                                >
                                    <ListItemAvatar>
                                        <CourseThumbnail
                                            src={item.miniatura}
                                            title={item.titulo}
                                            variant='simple'
                                            sx={{ width: 60, height: 40, mr: 1, borderRadius: '8px' }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display='flex' alignItems='center' gap={0.75} flexWrap='wrap'>
                                                <Typography fontWeight={700} noWrap sx={{ maxWidth: 180 }}>{item.titulo}</Typography>
                                                <Chip
                                                    label={item.type === 'EBOOK' ? 'Ebook' : 'Curso'}
                                                    size='small'
                                                    color={item.type === 'EBOOK' ? 'info' : 'default'}
                                                    variant='tonal'
                                                    sx={{ fontSize: '0.65rem', height: 18 }}
                                                />
                                            </Box>
                                        }
                                        secondary={formatPrice(display.amount, display.currency)}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>

                <Divider />

                {/* Footer */}
                {cart.length > 0 && (
                    <Box sx={{ p: 3, bgcolor: 'background.paper' }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight={700}>Total</Typography>
                            <Typography variant="h6" fontWeight={900} color="primary.main">
                                {formatPrice(cartTotal, moneda)}
                            </Typography>
                        </Stack>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleCheckout}
                            sx={{ py: 2, borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem' }}
                        >
                            Finalizar Compra
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    )
}

export default CartDrawer
