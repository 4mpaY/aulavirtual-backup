'use client'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Box, CircularProgress, Typography } from '@mui/material'

export default function MercadoPagoSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // MP ya notificó por webhook; redirigir a mis cursos
    const timeout = setTimeout(() => {
      router.push('/estudiante/mis-cursos')
    }, 2000)

    return () => clearTimeout(timeout)
  }, [router, searchParams])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <CircularProgress color='success' size={56} />
      <Typography variant='h6' fontWeight={600}>¡Pago aprobado!</Typography>
      <Typography color='text.secondary'>Redirigiendo a tus cursos...</Typography>
    </Box>
  )
}
