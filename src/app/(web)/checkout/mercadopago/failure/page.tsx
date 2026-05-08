'use client'

import { useRouter } from 'next/navigation'

import { Box, Button, Typography } from '@mui/material'

export default function MercadoPagoFailurePage() {
  const router = useRouter()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <i className='tabler-circle-x text-error' style={{ fontSize: 56 }} />
      <Typography variant='h6' fontWeight={600}>El pago no pudo procesarse</Typography>
      <Typography color='text.secondary'>Puedes intentarlo nuevamente o elegir otro método de pago.</Typography>
      <Button variant='contained' onClick={() => router.back()}>Volver e intentar de nuevo</Button>
    </Box>
  )
}
