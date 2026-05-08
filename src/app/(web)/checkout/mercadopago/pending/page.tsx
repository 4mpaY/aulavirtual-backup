'use client'

import { useRouter } from 'next/navigation'

import { Box, Button, Typography } from '@mui/material'

export default function MercadoPagoPendingPage() {
  const router = useRouter()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <i className='tabler-clock' style={{ fontSize: 56 }} />
      <Typography variant='h6' fontWeight={600}>Pago pendiente de acreditación</Typography>
      <Typography color='text.secondary' textAlign='center'>
        Tu pago está siendo procesado. Cuando se acredite recibirás acceso a tus cursos automáticamente.
      </Typography>
      <Button variant='outlined' onClick={() => router.push('/estudiante/mis-cursos')}>Ir a mis cursos</Button>
    </Box>
  )
}
