'use client'

import { useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Box, Button, CircularProgress, Typography } from '@mui/material'

const POLL_INTERVAL_MS = 2000
const MAX_ATTEMPTS = 10

type Estado = 'procesando' | 'completado' | 'cancelado' | 'timeout'

export default function IzipayEstadoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pedidoId = searchParams.get('pedidoId')
  const [estado, setEstado] = useState<Estado>('procesando')

  useEffect(() => {
    if (!pedidoId) {
      setEstado('timeout')

      return
    }

    let attempts = 0
    let cancelled = false

    const poll = async () => {
      try {
        const res = await fetch(`/api/estudiante/mis-pedidos/${pedidoId}`)
        const data = await res.json()
        const pedidoEstado = data?.result?.data?.estado

        if (cancelled) return

        if (pedidoEstado === 'COMPLETADO') {
          setEstado('completado')

          return
        }

        if (pedidoEstado === 'CANCELADO') {
          setEstado('cancelado')

          return
        }
      } catch {
        // Se reintenta en el siguiente intervalo
      }

      attempts += 1

      if (attempts >= MAX_ATTEMPTS) {
        if (!cancelled) setEstado('timeout')

        return
      }

      if (!cancelled) setTimeout(poll, POLL_INTERVAL_MS)
    }

    poll()

    return () => { cancelled = true }
  }, [pedidoId])

  useEffect(() => {
    if (estado === 'completado') {
      const timeout = setTimeout(() => router.push('/estudiante/mis-cursos'), 2000)

      return () => clearTimeout(timeout)
    }
  }, [estado, router])

  if (estado === 'completado') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
        <i className='tabler-circle-check text-success' style={{ fontSize: 56 }} />
        <Typography variant='h6' fontWeight={600}>¡Pago aprobado!</Typography>
        <Typography color='text.secondary'>Redirigiendo a tus cursos...</Typography>
      </Box>
    )
  }

  if (estado === 'cancelado') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
        <i className='tabler-circle-x text-error' style={{ fontSize: 56 }} />
        <Typography variant='h6' fontWeight={600}>El pago no pudo procesarse</Typography>
        <Typography color='text.secondary'>Puedes intentarlo nuevamente o elegir otro método de pago.</Typography>
        <Button variant='contained' onClick={() => router.push('/cursos')}>Volver e intentar de nuevo</Button>
      </Box>
    )
  }

  if (estado === 'timeout') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
        <i className='tabler-clock' style={{ fontSize: 56 }} />
        <Typography variant='h6' fontWeight={600}>Seguimos procesando tu pago</Typography>
        <Typography color='text.secondary'>
          Esto puede tardar unos minutos más. Revisa tus pedidos para ver el estado actualizado.
        </Typography>
        <Button variant='contained' onClick={() => router.push('/estudiante/pedidos')}>Ver mis pedidos</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 3 }}>
      <CircularProgress color='primary' size={56} />
      <Typography variant='h6' fontWeight={600}>Verificando tu pago...</Typography>
      <Typography color='text.secondary'>No cierres esta ventana.</Typography>
    </Box>
  )
}
