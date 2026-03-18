'use client'

import React from 'react'

import Link from 'next/link'

import { Container, Stack, Button, Box, Typography } from '@mui/material'

import { useSession } from 'next-auth/react'

import Logo from '@components/layout/shared/Logo'
import UserDropdown from '@components/layout/shared/UserDropdown'
import CartIcon from '@/features/web/cart/components/CartIcon'

const WebHeader = () => {
  const { data: session } = useSession()

  return (
    <Box sx={{ py: 3, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 1100 }}>
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={8} alignItems="center">
            <Logo />
          </Stack>
          
          <Stack direction="row" spacing={4} alignItems="center">
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Link href="/rutas" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.secondary',
                    '&:hover': { color: 'primary.main' },
                    transition: 'color 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: 1
                  }}
                >
                  Rutas de Aprendizaje
                </Typography>
              </Link>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <CartIcon />
              {session ? (
                <UserDropdown />
              ) : (
                <>
                  <Button component={Link} href="/login" color="inherit" sx={{ fontWeight: 600 }}>Iniciar Sesión</Button>
                  <Button component={Link} href="/register" variant="contained" sx={{ fontWeight: 600, borderRadius: '10px' }}>Registrarse</Button>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default WebHeader
