'use client'


import { IconButton, Badge, Tooltip } from '@mui/material'

import { useCart } from '../context/CartContext'

const CartIcon = () => {
    const { itemCount, setIsCartDrawerOpen } = useCart()

    return (
        <Tooltip title="Ver Carrito">
            <IconButton
                color="inherit"
                onClick={() => setIsCartDrawerOpen(true)}
                sx={{
                    bgcolor: 'rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                    borderRadius: '10px',
                    width: 44,
                    height: 44
                }}
            >
                <Badge
                    badgeContent={itemCount}
                    color="error"
                    sx={{ '& .MuiBadge-badge': { fontWeight: 800 } }}
                >
                    <i className="tabler-shopping-cart" style={{ fontSize: '1.6rem' }} />
                </Badge>
            </IconButton>
        </Tooltip>
    )
}

export default CartIcon
