'use client'

import React from 'react'

import { IconButton, Badge, Tooltip } from '@mui/material'

import { useCart } from '../context/CartContext'

const CartIcon: React.FC = () => {
    const { itemCount, setIsCartDrawerOpen } = useCart()

    return (
        <Tooltip title="Ver Carrito">
            <IconButton
                color="inherit"
                onClick={() => setIsCartDrawerOpen(true)}
                sx={{
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'primary.100' },
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
                    <i className="tabler-shopping-cart" style={{ fontSize: '1.4rem' }} />
                </Badge>
            </IconButton>
        </Tooltip>
    )
}

export default CartIcon
