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
import { useAuthModal } from '@/contexts/AuthModalContext'
import IzipayScript from './IzipayScript'
import CulqiScript from './CulqiScript'
import { PayPalPaymentButton } from './PayPalPaymentButton'
import { useCart } from '../../cart/context/CartContext'

declare global {
  interface Window {
    Izipay: any
    Culqi: any
  }
}

interface PaymentFormProps {
  courses: {
    id: string
    titulo: string
    slug: string
    precio: number
    moneda: string
  }[]
  appliedCouponCode?: string
  finalTotal?: number
}

const FONT = 'Poppins, sans-serif'

const PaymentForm = ({ courses, appliedCouponCode, finalTotal }: PaymentFormProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const { clearCart } = useCart()
  const { openLogin } = useAuthModal()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const configs = useConfig()
  const isCulqiEnabled = configs.CULQI_ENABLED !== 'false'
  const isIzipayEnabled = configs.IZIPAY_ENABLED !== 'false'
  const isPaypalEnabled = configs.PAYPAL_ENABLED !== 'false'

  const [paymentMethod, setPaymentMethod] = useState<'izipay' | 'paypal' | 'culqi'>('culqi')
  const [isCulqiLoaded, setIsCulqiLoaded] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  // Culqi v4 settings state
  const [culqiSettings, setCulqiSettings] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: ''
  })

  const subtotal = courses.reduce((acc, c) => acc + Number(c.precio), 0)
  const displayTotal = finalTotal !== undefined ? finalTotal : subtotal
  const currencySymbol = courses[0]?.moneda === 'USD' ? '$' : 'S/'

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

  // Auto-seleccionar primer método habilitado
  useEffect(() => {
    if (!isCulqiEnabled && paymentMethod === 'culqi') {
      if (isIzipayEnabled) setPaymentMethod('izipay')
      else if (isPaypalEnabled) setPaymentMethod('paypal')
    }
  }, [isCulqiEnabled, isIzipayEnabled, isPaypalEnabled, paymentMethod])

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
      const confirmRes = await fetch('/api/izipay/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId, response })
      })

      const confirmData = await confirmRes.json()

      if (response.code === '00') {
        if (confirmRes.ok) {
          handlePaymentSuccess()
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
  }, [handlePaymentSuccess])

  // Callback para procesar la respuesta de Culqi
  const handleCulqiToken = useCallback(async (token: string, email: string) => {
    try {
      setIsLoading(true)
      const pedidoId = (window as any)._currentPedidoId

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
      openLogin()

      return
    }

    setPaymentError(null)

    try {
      setIsLoading(true)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursoIds: courses.map(c => c.id),
          codigoCupon: appliedCouponCode,
          gateway: 'IZIPAY'
        })
      })

      const dataRaw = await response.json()

      if (!response.ok) throw new Error(dataRaw.message || 'Error al iniciar el pago')

      const { iziConfig, token, keyRSA, pedidoId } = dataRaw.result

      if (!window.Izipay) throw new Error('El SDK de Izipay no se ha cargado.')

      const checkout = new window.Izipay({ config: iziConfig })

      checkout.LoadForm({
        authorization: token,
        keyRSA: keyRSA,
        callbackResponse: (izipayResponse: any) => handlePaymentResponse(izipayResponse, pedidoId)
      })
    } catch (error: any) {
      console.error('Error in checkout:', error)
      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCulqiCheckout = async () => {
    if (!session) {
      openLogin()

      return
    }

    setPaymentError(null)

    try {
      setIsLoading(true)

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursoIds: courses.map(c => c.id),
          codigoCupon: appliedCouponCode,
          gateway: 'CULQI'
        })
      })

      const dataRaw = await response.json()

      if (!response.ok) throw new Error(dataRaw.message || 'Error al iniciar el pedido')

      const { pedidoId, culqiOrderId, rsaId, rsaPublicKey } = dataRaw.result

        // Guardar pedidoId para el callback
        ; (window as any)._currentPedidoId = pedidoId

      // Configurar settings para v4
      const settings = {
        currency: courses[0]?.moneda || 'PEN',
        amount: Math.round(displayTotal * 100),
        order: culqiOrderId,
        xculqirsaid: rsaId,
        rsapublickey: rsaPublicKey
      }

      setCulqiSettings(settings)

      // En v4, si el script ya está cargado, ya podemos abrirlo.
      // Pero como CulqiScript maneja la instancia, debemos esperar a que se actualicen las props.
    } catch (error: any) {
      console.error('Error in Culqi checkout:', error)
      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  // Effect para abrir Culqi cuando los settings estén listos
  useEffect(() => {
    if (culqiSettings && window.Culqi && window.Culqi.open) {
      window.Culqi.open()
    }
  }, [culqiSettings])

  const isGuest = !session
  const paypalClientId = configs.PAYPAL_CLIENT_ID || 'test'

  if (paymentSuccess) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1.5px solid hsl(214,20%,91%)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="tabler-check" style={{ fontSize: '2.5rem', color: '#16a34a' }} />
          </Box>
          <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.375rem', color: '#16a34a' }}>¡Pago Exitoso!</Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: '0.9375rem', color: '#64748b', textAlign: 'center', lineHeight: 1.6 }}>
            Tu inscripción al curso ha sido confirmada. Serás redirigido a tus cursos en unos segundos...
          </Typography>
          <CircularProgress size={24} sx={{ color: '#16a34a' }} />
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1.5px solid hsl(214,20%,91%)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <IzipayScript />
      <CulqiScript
        publicKey={configs.CULQI_PUBLIC_KEY || ''}
        settings={culqiSettings || {
          currency: courses[0]?.moneda || 'PEN',
          amount: Math.round(displayTotal * 100)
        }}
        client={{ email: formData.correo }}
        options={{
          lang: 'auto',
          installments: true,
          paymentMethods: {
            tarjeta: true,
            yape: true,
            billetera: true,
            bancaMovil: true,
            agente: true,
            cuotealo: true,
          }
        }}
        onLoad={() => setIsCulqiLoaded(true)}
        onTokenReceived={handleCulqiToken}
        onError={(err) => setPaymentError(err)}
      />

      <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.25rem', color: '#0A0A0A', mb: 1 }}>
        Información de <span style={{ color: 'var(--web-primary, #25927F)' }}>Pago</span>
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#64748b', fontWeight: 500, mb: 4 }}>
        {isGuest ? 'Identifícate e ingresa tus datos para finalizar la inscripción.' : 'Verifica tus datos y completa el pago.'}
      </Typography>

      <Stack spacing={4}>
        {paymentError && (
          <Alert severity="error" onClose={() => setPaymentError(null)} sx={{ borderRadius: '12px' }}>
            {paymentError}
          </Alert>
        )}

        <Box>
          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.9375rem', color: '#0A0A0A', mb: 2 }}>Datos del Estudiante</Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Nombres', key: 'nombres', sm: 6 },
              { label: 'Apellidos', key: 'apellidos', sm: 6 },
              { label: 'Correo Electrónico', key: 'correo', sm: 12 },
            ].map(({ label, key, sm }) => (
              <Grid item xs={12} sm={sm} key={key}>
                <TextField
                  fullWidth label={label}
                  value={formData[key as keyof typeof formData]}
                  onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))}
                  variant="outlined" disabled={!isGuest}
                  sx={{
                    '& .MuiInputLabel-root': { fontFamily: FONT },
                    '& .MuiOutlinedInput-root': { fontFamily: FONT, borderRadius: '12px' },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--web-primary, #25927F)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: 'var(--web-primary, #25927F)' },
                  }}
                  {...(key === 'correo' ? { InputProps: { startAdornment: (<InputAdornment position="start"><i className="tabler-mail" /></InputAdornment>) } } : {})}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box>
          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.9375rem', color: '#0A0A0A', mb: 2 }}>Método de Pago</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            {([
              { key: 'culqi', label: 'Culqi', enabled: isCulqiEnabled },
              { key: 'izipay', label: 'Izipay', enabled: isIzipayEnabled },
              { key: 'paypal', label: 'PayPal', enabled: isPaypalEnabled },
            ] as const).filter(m => m.enabled).map(m => {
              const active = paymentMethod === m.key

              return (
                <button
                  key={m.key}
                  onClick={() => setPaymentMethod(m.key)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: '12px',
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: active ? 'var(--web-primary, #25927F)' : '#ffffff',
                    color: active ? '#ffffff' : '#64748b',
                    border: active ? '1.5px solid var(--web-primary, #25927F)' : '1.5px solid hsl(214,20%,88%)',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--web-primary, #25927F)'
                        ; (e.currentTarget as HTMLButtonElement).style.color = 'var(--web-primary, #25927F)'
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--web-dark, #025E44)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'hsl(214,20%,88%)'
                        ; (e.currentTarget as HTMLButtonElement).style.color = '#64748b'
                    } else {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--web-primary, #25927F)'
                    }
                  }}
                >
                  {m.label}
                </button>
              )
            })}
          </Box>

          {(!isCulqiEnabled && !isIzipayEnabled && !isPaypalEnabled) && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
              No hay métodos de pago habilitados en este momento. Por favor, contacte con soporte.
            </Alert>
          )}

          {paymentMethod === 'culqi' && isCulqiEnabled ? (
            <Box sx={{ p: 3, backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.04)', borderRadius: '16px', border: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127), 0.15)', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <i className="tabler-shield-lock" style={{ fontSize: '1.4rem', color: 'var(--web-primary, #25927F)' }} />
                <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Pago seguro procesado por Culqi</Typography>
              </Box>
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <FormControlLabel control={<Checkbox checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} sx={{ color: 'var(--web-primary, #25927F)', '&.Mui-checked': { color: 'var(--web-primary, #25927F)' } }} />} label={<Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b' }}>He leído y acepto los <Link href="/terminos-y-condiciones" target="_blank" style={{ color: 'var(--web-primary, #25927F)', fontWeight: 600 }}>Términos y Condiciones</Link></Typography>} />
              </Box>
              <Button fullWidth size="large" onClick={handleCulqiCheckout} disabled={isLoading || !isCulqiLoaded || (!acceptedTerms && !isGuest)} startIcon={isLoading || !isCulqiLoaded ? <CircularProgress size={20} color="inherit" /> : <i className="tabler-credit-card" />} sx={{ py: 2, borderRadius: '16px', fontFamily: FONT, fontWeight: 800, fontSize: '1rem', textTransform: 'none', backgroundColor: 'var(--web-light, #BDD962)', color: '#0A0A0A', boxShadow: '0 6px 20px rgba(var(--web-primary-rgb, 37, 146, 127), 0.25)', '&:hover': { backgroundColor: 'var(--web-primary, #25927F)', color: '#fff' }, '&:disabled': { backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.2)', color: 'rgba(0,0,0,0.35)' } }}>
                {isLoading ? 'Procesando...' : (!isCulqiLoaded ? 'Cargando...' : (isGuest ? 'Identificarse para Comprar' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)}`))}
              </Button>
            </Box>
          ) : (paymentMethod === 'izipay' && isIzipayEnabled) ? (
            <Box sx={{ p: 3, backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.04)', borderRadius: '16px', border: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127), 0.15)', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <i className="tabler-shield-lock" style={{ fontSize: '1.4rem', color: 'var(--web-primary, #25927F)' }} />
                <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Pago seguro procesado por Izipay</Typography>
              </Box>
              <Box sx={{ mb: 3, textAlign: 'left' }}>
                <FormControlLabel control={<Checkbox checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} sx={{ color: 'var(--web-primary, #25927F)', '&.Mui-checked': { color: 'var(--web-primary, #25927F)' } }} />} label={<Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b' }}>He leído y acepto los <Link href="/terminos-y-condiciones" target="_blank" style={{ color: 'var(--web-primary, #25927F)', fontWeight: 600 }}>Términos y Condiciones</Link></Typography>} />
              </Box>
              <Button fullWidth size="large" onClick={handleCheckout} disabled={isLoading || (!acceptedTerms && !isGuest)} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <i className="tabler-credit-card" />} sx={{ py: 2, borderRadius: '16px', fontFamily: FONT, fontWeight: 800, fontSize: '1rem', textTransform: 'none', backgroundColor: 'var(--web-light, #BDD962)', color: '#0A0A0A', boxShadow: '0 6px 20px rgba(var(--web-primary-rgb, 37, 146, 127), 0.25)', '&:hover': { backgroundColor: 'var(--web-primary, #25927F)', color: '#fff' }, '&:disabled': { backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.2)', color: 'rgba(0,0,0,0.35)' } }}>
                {isLoading ? 'Preparando...' : (isGuest ? 'Identificarse para Comprar' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)}`)}
              </Button>
            </Box>
          ) : (paymentMethod === 'paypal' && isPaypalEnabled) && (
            <Box sx={{ p: 3, backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.04)', borderRadius: '16px', border: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127), 0.15)' }}>
              {isGuest ? (
                <Button fullWidth size="large" onClick={() => setIsAuthDialogOpen(true)} sx={{ py: 2, borderRadius: '16px', fontFamily: FONT, fontWeight: 800, textTransform: 'none', backgroundColor: 'var(--web-light, #BDD962)', color: '#0A0A0A', '&:hover': { backgroundColor: 'var(--web-primary, #25927F)', color: '#fff' } }}>Identificarse para Comprar</Button>
              ) : (
                <>
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel control={<Checkbox checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} sx={{ color: 'var(--web-primary, #25927F)', '&.Mui-checked': { color: 'var(--web-primary, #25927F)' } }} />} label={<Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b' }}>He leído y acepto los <Link href="/terminos-y-condiciones" target="_blank" style={{ color: 'var(--web-primary, #25927F)', fontWeight: 600 }}>Términos y Condiciones</Link></Typography>} />
                  </Box>
                  {acceptedTerms ? (
                    <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
                      <PayPalPaymentButton cursoIds={courses.map(c => c.id)} codigoCupon={appliedCouponCode} onSuccess={handlePaymentSuccess} onError={(err) => setPaymentError(err)} />
                    </PayPalScriptProvider>
                  ) : (
                    <Alert severity="info" sx={{ borderRadius: '12px' }}>Acepta los términos y condiciones para habilitar el pago con PayPal.</Alert>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </Stack>

    </Paper>
  )
}

export default PaymentForm
