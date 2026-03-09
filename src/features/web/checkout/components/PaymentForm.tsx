'use client'

import React, { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress
} from '@mui/material'
import { useSession } from 'next-auth/react'

import AuthDialog from './AuthDialog'
import IzipayScript from './IzipayScript'

declare global {
  interface Window {
    Izipay: any
  }
}

interface PaymentFormProps {
  course: {
    id: string
    titulo: string
    slug: string
    precio: number
  }
}

const PaymentForm: React.FC<PaymentFormProps> = ({ course }) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: ''
  })

  // Sync form with session
  useEffect(() => {
    if (session?.user) {
      const user = session.user as any

      setFormData({
        nombres: user.nombre || user.name || '',
        apellidos: user.apellido || '',
        correo: user.email || ''
      })
    }
  }, [session])

  // Callback para procesar la respuesta de Izipay
  const handlePaymentResponse = useCallback(async (response: any, pedidoId: string) => {
    try {
      if (response.code === '00') {
        // Pago exitoso - confirmar en el backend
        const confirmRes = await fetch('/api/izipay/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pedidoId,
            response
          })
        })

        const confirmData = await confirmRes.json()

        if (confirmRes.ok) {
          setPaymentSuccess(true)
          setTimeout(() => {
            router.push('/estudiante/mis-cursos')
          }, 2000)
        } else {
          setPaymentError(confirmData.message || 'Error al confirmar el pago')
        }
      } else {
        setPaymentError(response.messageUser || 'El pago no fue completado')
      }
    } catch (error: any) {
      console.error('Error confirmando pago:', error)
      setPaymentError('Error inesperado al confirmar el pago')
    }
  }, [router])

  const handleCheckout = async () => {
    if (!session) {
      setIsAuthDialogOpen(true)

      return
    }

    setPaymentError(null)

    try {
      setIsLoading(true)

      // 1. Obtener iziConfig y token del backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursoId: course.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar el pago')
      }

      const { iziConfig, token, keyRSA, pedidoId } = data.result

      // 2. Verificar que el SDK de Izipay esté cargado
      if (!window.Izipay) {
        throw new Error('El SDK de Izipay aún no se ha cargado. Intenta de nuevo en unos segundos.')
      }

      let checkout

      try {
        console.log('Iniciando Izipay con config:', iziConfig, 'y token:', token)

        // El SDK requiere que authorization se pase al inicializar la clase
        checkout = new window.Izipay({ config: iziConfig })
        console.log('Instancia de Izipay creada correctamente:', checkout)
      } catch (err: any) {
        console.error('Error al instanciar Izipay:', err)
        throw new Error('Error interno al configurar la pasarela de pago.')
      }

      // 4. Abrir el formulario pop-up
      try {
        console.log('Llamando a LoadForm...')
        checkout.LoadForm({
          authorization: token,
          keyRSA: keyRSA,
          callbackResponse: (izipayResponse: any) => {
            console.log('Izipay callbackResponse:', izipayResponse)
            handlePaymentResponse(izipayResponse, pedidoId)
          }
        })
        console.log('LoadForm ejecutado')
      } catch (err: any) {
        console.error('Error al ejecutar LoadForm:', err)
        throw new Error('Error al intentar abrir el formulario de pago.')
      }
    } catch (error: any) {
      console.error('Error in checkout:', error)

      if (error.Errors) {
        console.error('Izipay SDK Errors:', error.Errors)
      }

      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const isGuest = status === 'unauthenticated'

  if (paymentSuccess) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'success.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="tabler-check" style={{ fontSize: '2.5rem', color: '#2e7d32' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.main' }}>
            ¡Pago Exitoso!
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Tu inscripción al curso ha sido confirmada. Serás redirigido a tus cursos en unos segundos...
          </Typography>
          <CircularProgress size={24} color="success" />
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
      {/* Cargar SDK de Izipay */}
      <IzipayScript />

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
        Información de <span style={{ color: 'var(--mui-palette-primary-main)' }}>Pago</span>
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
        {isGuest ? 'Identifícate e ingresa tus datos para finalizar la inscripción.' : 'Verifica tus datos y completa el pago.'}
      </Typography>

      <Stack spacing={4}>
        {/* Error Alert */}
        {paymentError && (
          <Alert severity="error" onClose={() => setPaymentError(null)} sx={{ borderRadius: '12px' }}>
            {paymentError}
          </Alert>
        )}

        {/* Personal Info */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>Datos del Estudiante</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombres"
                value={formData.nombres}
                onChange={e => setFormData(p => ({ ...p, nombres: e.target.value }))}
                variant="outlined"
                disabled={!isGuest}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Apellidos"
                value={formData.apellidos}
                onChange={e => setFormData(p => ({ ...p, apellidos: e.target.value }))}
                variant="outlined"
                disabled={!isGuest}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                value={formData.correo}
                onChange={e => setFormData(p => ({ ...p, correo: e.target.value }))}
                variant="outlined"
                disabled={!isGuest}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="tabler-mail" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Checkout Button */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Método de Pago</Typography>

          <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: '16px', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <i className="tabler-shield-lock" style={{ fontSize: '1.4rem', color: 'var(--mui-palette-primary-main)' }} />
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Pago seguro procesado por Izipay
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>
              Se abrirá una ventana segura para completar tu pago con tarjeta de crédito, débito u otros medios.
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <i className="tabler-credit-card" />}
              sx={{
                py: 2,
                borderRadius: '16px',
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: '0 10px 25px rgba(var(--mui-palette-primary-mainChannel), 0.2)',
                textTransform: 'none'
              }}
            >
              {isLoading ? 'Preparando pasarela...' : (isGuest ? 'Identificarse para Comprar' : `Pagar S/ ${Number(course.precio).toFixed(2)}`)}
            </Button>
          </Box>
        </Box>
      </Stack>

      <AuthDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </Paper>
  )
}

export default PaymentForm
