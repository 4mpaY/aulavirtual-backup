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
    <div className='flex flex-col items-center justify-center p-8 text-center min-h-[400px]'>
      <Typography variant='h4' className='mb-2'>
        Algo salió mal al cargar esta sección
      </Typography>
      <Typography variant='body1' color='text.secondary' className='mb-6 max-w-[500px]'>
        Si presionaste Escape mientras cargaba, la navegación pudo interrumpirse. Intenta recargar la vista.
      </Typography>
      <Typography variant='body2' color='error' className='mb-6 max-w-[800px] text-left overflow-auto p-4 border border-red-200 bg-red-50 rounded'>
        <strong>{error.name}:</strong> {error.message}
        <br /><br />
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px' }}>{error.stack}</pre>
      </Typography>
      <Button variant='contained' onClick={() => reset()} startIcon={<i className='tabler-refresh' />}>
        Reintentar
      </Button>
    </div>
  )
}
