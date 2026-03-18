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
    Avatar,
    Button,
    Divider,
    Stack
} from '@mui/material'

import { useCart } from '../context/CartContext'

const CartDrawer = () => {
    const { cart, removeFromCart, cartTotal, itemCount, isCartDrawerOpen, setIsCartDrawerOpen } = useCart()
    const router = useRouter()

    const onClose = () => setIsCartDrawerOpen(false)

    const handleCheckout = () => {
        onClose()

        if (cart.length > 0) {
            router.push('/checkout')
        }
    }

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
                                Explorar Cursos
                            </Button>
                        </Box>
                    ) : (
                        <List>
                            {cart.map((item) => (
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
                                        <Avatar
                                            variant="rounded"
                                            src={item.miniatura}
                                            sx={{ width: 60, height: 40, mr: 1 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={<Typography fontWeight={700} noWrap>{item.titulo}</Typography>}
                                        secondary={`${item.moneda} ${item.precio}`}
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
                                {cart[0]?.moneda} {cartTotal}
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
