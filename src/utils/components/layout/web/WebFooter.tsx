import React from 'react'

import { Container, Stack, Box, Typography, Divider } from '@mui/material'

import Logo from '@components/layout/shared/Logo'

const WebFooter = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 6, borderTop: 1, borderColor: 'divider', mt: 'auto' }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={4}>
          <Logo />
          <Stack direction="row" spacing={3} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              © 2026 ELITE EdTech
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 16 }} />
            <Typography variant="body2" component="a" href="#" sx={{ color: 'text.secondary', textDecoration: 'none' }}>Privacidad</Typography>
            <Typography variant="body2" component="a" href="#" sx={{ color: 'text.secondary', textDecoration: 'none' }}>Términos</Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}

export default WebFooter
