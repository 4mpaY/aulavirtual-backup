'use client'

import { useState, useCallback } from 'react'

import { Typography, Box, Button, CircularProgress, Alert } from '@mui/material'

import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

import AppModal from '@/utils/components/AppModal'
import CulqiScript from '@/features/web/checkout/components/CulqiScript'
import { useConfig } from '@/contexts/ConfigContext'
import { useSuscribirse } from '../hooks/useSuscripcion'
import type { PlanPublico } from '../entity/Suscripcion'
import { INTERVALO_LABELS } from '../entity/Suscripcion'

interface PlanCheckoutModalProps {
  open: boolean
  handleClose: () => void
  plan: PlanPublico | null
  onSuccess?: () => void
}

const PlanCheckoutModal = ({ open, handleClose, plan, onSuccess }: PlanCheckoutModalProps) => {
  const { data: session } = useSession()
  const configs = useConfig()
  const suscribirse = useSuscribirse()
  const [error, setError] = useState<string | null>(null)
  const [culqiListo, setCulqiListo] = useState(false)

  const handlePagar = () => {
    if (!window.Culqi) return
    setError(null)
    window.Culqi.open()
  }

  const handleTokenReceived = useCallback(async (tokenId: string) => {
    if (!plan) return

    try {
      await suscribirse.mutateAsync({ planId: plan.id, tokenId })
      toast.success('¡Suscripción activada correctamente!')
      handleClose()
      onSuccess?.()
    } catch (err: any) {
      setError(err?.message || 'Error al procesar la suscripción')
    }
  }, [plan, suscribirse, handleClose, onSuccess])

  const handleCulqiError = useCallback((culqiErr: any) => {
    setError(typeof culqiErr === 'string' ? culqiErr : culqiErr?.user_message || 'Error al procesar el pago')
  }, [])

  if (!plan) return null

  const amount = Math.round(Number(plan.precio) * 100)
  const email = session?.user?.email || ''

  return (
    <AppModal open={open} handleClose={handleClose}>
      <CulqiScript
        publicKey={configs?.CULQI_PUBLIC_KEY || ''}
        settings={{ currency: plan.moneda, amount }}
        client={{ email }}
        onTokenReceived={handleTokenReceived}
        onError={handleCulqiError}
        onLoad={() => setCulqiListo(true)}
      />

      <Typography variant='h6' fontWeight={700} mb={1}>
        Suscribirse a {plan.nombre}
      </Typography>
      <Typography variant='body2' color='text.secondary' mb={3}>
        {plan.moneda === 'PEN' ? 'S/' : '$'} {Number(plan.precio).toFixed(2)} / {INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}
        {plan.dias_prueba > 0 && ` · ${plan.dias_prueba} días de prueba gratis`}
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant='tonal' color='secondary' onClick={handleClose} disabled={suscribirse.isPending}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={handlePagar}
          disabled={!culqiListo || suscribirse.isPending}
          startIcon={suscribirse.isPending ? <CircularProgress size={16} /> : undefined}
        >
          {suscribirse.isPending ? 'Procesando...' : 'Ingresar datos de tarjeta'}
        </Button>
      </Box>
    </AppModal>
  )
}

export default PlanCheckoutModal
