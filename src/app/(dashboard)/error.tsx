'use client'

import { useEffect } from 'react'

import { Box, Button, Typography } from '@mui/material'

export default function DashboardError({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[DashboardError]', error)
  }, [error])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        gap: 2,
        px: 2,
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        Algo salió mal al cargar esta sección
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
        Si presionaste Escape mientras cargaba, la navegación pudo interrumpirse. Intenta recargar la vista.
      </Typography>
      <Button variant="contained" onClick={() => reset()}>
        Reintentar
      </Button>
    </Box>
  )
}
