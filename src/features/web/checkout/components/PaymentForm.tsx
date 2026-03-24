'use client'

import { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import { useConfig } from '@/contexts/ConfigContext'
import AuthDialog from './AuthDialog'
import IzipayScript from './IzipayScript'
import CulqiScript from './CulqiScript'
import { PayPalPaymentButton } from './PayPalPaymentButton'

import { useCart } from '../../cart/context/CartContext'

declare global {
  interface Window {
    Izipay: any
  }
}

interface PaymentFormProps {
  courses: {
    id: string
    titulo: string
    slug: string
    precio: number
  }[]
  appliedCouponCode?: string
  finalTotal?: number
}

const PaymentForm = ({ courses, appliedCouponCode, finalTotal }: PaymentFormProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { clearCart } = useCart()
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'izipay' | 'paypal' | 'culqi'>('culqi')
  const [isCulqiLoaded, setIsCulqiLoaded] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: ''
  })

  const subtotal = courses.reduce((acc, c) => acc + Number(c.precio), 0)
  const displayTotal = finalTotal !== undefined ? finalTotal : subtotal

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

  const handlePaymentSuccess = useCallback(() => {
    setPaymentSuccess(true)
    clearCart()
    setTimeout(() => {
      router.push('/estudiante/mis-cursos')
    }, 2000)
  }, [router, clearCart])

  // Callback para procesar la respuesta de Izipay
  const handlePaymentResponse = useCallback(async (response: any, pedidoId: string) => {
    try {
      // Siempre confirmamos con el backend, sea éxito o fallo
      const confirmRes = await fetch('/api/izipay/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId,
          response
        })
      })

      const confirmData = await confirmRes.json()

      if (response.code === '00') {
        if (confirmRes.ok) {
          handlePaymentSuccess()
        } else {
          setPaymentError(confirmData.message || 'Error al confirmar el pago')
        }
      } else {
        // En caso de error de Izipay (no es '00'), el pedido ya se marcó como CANCELADO en el backend
        setPaymentError(response.messageUser || 'El pago no fue completado')
      }
    } catch (error: any) {
      console.error('Error confirmando pago:', error)
      setPaymentError('Error inesperado al confirmar el pago')
    }
  }, [handlePaymentSuccess])

  // Callback para procesar la respuesta de Culqi
  const handleCulqiToken = useCallback(async (token: string, email: string, pedidoId: string) => {
    try {
      setIsLoading(true)

      const res = await fetch('/api/culqi/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pedidoId,
          tokenId: token,
          email
        })
      })

      const data = await res.json()

      if (res.ok) {
        handlePaymentSuccess()
      } else {
        setPaymentError(data.message || 'Error al procesar el cargo con Culqi')
      }
    } catch (error) {
      console.error('Error procesando cargo Culqi:', error)
      setPaymentError('Error inesperado al procesar el pago')
    } finally {
      setIsLoading(false)
    }
  }, [handlePaymentSuccess])

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
        body: JSON.stringify({
          cursoIds: courses.map(c => c.id),
          codigoCupon: appliedCouponCode,
          gateway: 'IZIPAY'
        })
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
      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCulqiCheckout = async () => {
    if (!session) {
      setIsAuthDialogOpen(true)

      return
    }

    setPaymentError(null)

    try {
      setIsLoading(true)

      // 1. Crear el pedido en el backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursoIds: courses.map(c => c.id),
          codigoCupon: appliedCouponCode,
          gateway: 'CULQI'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar el pedido')
      }

      const { pedidoId } = data.result

      // 2. Configurar Culqi
      if (!(window as any).Culqi) {
        throw new Error('El SDK de Culqi no está cargado.')
      }

      const culqi = (window as any).Culqi

      culqi.settings({
        title: configs.TEMPLATE_NAME || 'Aula Virtual',
        currency: courses[0]?.moneda || 'PEN',
        description: `Compra de ${courses.length} curso(s)`,
        amount: Math.round(displayTotal * 100)
      })

      if (culqi.options) {
        culqi.options({
          lang: 'auto',
          installments: true,
          modal: true,
          style: {
            logo: configs.TEMPLATE_LOGO || '',
            mainColor: configs.PRIMARY_COLOR_MAIN || '#131FF2',
          }
        })
      }

      // Guardar el pedidoId en una referencia o estado para usarlo en el callback culqi()
      // Como el callback culqi() se define globalmente, necesitamos una forma de pasarle el pedidoId
      // Lo más fácil es guardarlo en una propiedad global temporal
      (window as any)._currentPedidoId = pedidoId

      culqi.open()
    } catch (error: any) {
      console.error('Error in Culqi checkout:', error)
      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const configs = useConfig()
  const isGuest = status === 'unauthenticated'

  // 2. Renderizar componentes de pago dinámicamente según la configuración
  const paypalClientId = configs.PAYPAL_CLIENT_ID || 'test'

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
      <IzipayScript />
      <CulqiScript
        publicKey={configs.CULQI_PUBLIC_KEY || ''}
        onLoad={() => setIsCulqiLoaded(true)}
        onTokenReceived={(token, email) => {
          const pedidoId = (window as any)._currentPedidoId

          if (pedidoId) handleCulqiToken(token, email, pedidoId)
        }}
        onError={(err) => setPaymentError(err)}
      />

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
        Información de <span style={{ color: 'var(--mui-palette-primary-main)' }}>Pago</span>
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
        {isGuest ? 'Identifícate e ingresa tus datos para finalizar la inscripción.' : 'Verifica tus datos y completa el pago.'}
      </Typography>

      <Stack spacing={4}>
        {paymentError && (
          <Alert severity="error" onClose={() => setPaymentError(null)} sx={{ borderRadius: '12px' }}>
            {paymentError}
          </Alert>
        )}

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
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Método de Pago</Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant={paymentMethod === 'culqi' ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => setPaymentMethod('culqi')}
              sx={{ borderRadius: '12px', textTransform: 'none', py: 1.5 }}
            >
              Culqi (Tarjeta)
            </Button>
            <Button
              variant={paymentMethod === 'izipay' ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => setPaymentMethod('izipay')}
              sx={{ borderRadius: '12px', textTransform: 'none', py: 1.5 }}
            >
              Izipay
            </Button>
            <Button
              variant={paymentMethod === 'paypal' ? 'contained' : 'outlined'}
              fullWidth
              onClick={() => setPaymentMethod('paypal')}
              sx={{ borderRadius: '12px', textTransform: 'none', py: 1.5 }}
            >
              PayPal
            </Button>
          </Stack>

          {paymentMethod === 'culqi' ? (
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: '16px', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <i className="tabler-shield-lock" style={{ fontSize: '1.4rem', color: 'var(--mui-palette-primary-main)' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Pago seguro procesado por Culqi
                </Typography>
              </Box>

              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      He leído y acepto los <Link href="/terminos-y-condiciones" target="_blank" style={{ color: 'var(--mui-palette-primary-main)', fontWeight: 600 }}>Términos y Condiciones</Link>
                    </Typography>
                  }
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCulqiCheckout}
                disabled={isLoading || !isCulqiLoaded || (!acceptedTerms && !isGuest)}
                startIcon={isLoading || !isCulqiLoaded ? <CircularProgress size={20} color="inherit" /> : <i className="tabler-credit-card" />}
                sx={{
                  py: 2,
                  borderRadius: '16px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 10px 25px rgba(var(--mui-palette-primary-mainChannel), 0.2)',
                  textTransform: 'none'
                }}
              >
                {isLoading ? 'Procesando pago...' : (!isCulqiLoaded ? 'Cargando pasarela...' : (isGuest ? 'Identificarse para Comprar' : `Pagar S/ ${displayTotal.toFixed(2)}`))}
              </Button>
            </Box>
          ) : paymentMethod === 'izipay' ? (
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: '16px', border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <i className="tabler-shield-lock" style={{ fontSize: '1.4rem', color: 'var(--mui-palette-primary-main)' }} />
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Pago seguro procesado por Izipay
                </Typography>
              </Box>

              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptedTerms}
                      onChange={e => setAcceptedTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      He leído y acepto los <Link href="/terminos-y-condiciones" target="_blank" style={{ color: 'var(--mui-palette-primary-main)', fontWeight: 600 }}>Términos y Condiciones</Link>
                    </Typography>
                  }
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={isLoading || (!acceptedTerms && !isGuest)}
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
                {isLoading ? 'Preparando pasarela...' : (isGuest ? 'Identificarse para Comprar' : `Pagar S/ ${displayTotal.toFixed(2)}`)}
              </Button>
            </Box>
          ) : paymentMethod === 'paypal' && (
            <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
              {isGuest ? (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => setIsAuthDialogOpen(true)}
                  sx={{ py: 2, borderRadius: '16px', fontWeight: 800, textTransform: 'none' }}
                >
                  Identificarse para Comprar
                </Button>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={acceptedTerms}
                          onChange={e => setAcceptedTerms(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.secondary">
                          He leído y acepto los <Link href="/terminos-y-condiciones" target="_blank" style={{ color: 'var(--mui-palette-primary-main)', fontWeight: 600 }}>Términos y Condiciones</Link>
                        </Typography>
                      }
                    />
                  </Box>
                  {acceptedTerms ? (
                    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
                      <PayPalPaymentButton
                        cursoIds={courses.map(c => c.id)}
                        codigoCupon={appliedCouponCode}
                        onSuccess={handlePaymentSuccess}
                        onError={(err) => setPaymentError(err)}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: '12px' }}>
                      Acepta los términos y condiciones para habilitar el pago con PayPal.
                    </Alert>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Stack>

      <AuthDialog
        open={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />
    </Paper >
  )
}

export default PaymentForm
