'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

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
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  Avatar,
  FormControlLabel
} from '@mui/material'
import { toDataURL } from 'qrcode'
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

interface MetodoPagoManualPublico {
  id: string
  nombre: string
  nombre_banco?: string | null
  numero_cuenta: string
  cci?: string | null
  descripcion?: string | null
  imagen_url?: string | null
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

// ─── Payment method tab ───────────────────────────────────────────────────────
interface MethodTabProps {
  icon: string
  label: string
  selected: boolean
  onClick: () => void
  color?: string
}

const MethodTab = ({ icon, label, selected, onClick, color = 'var(--mui-palette-primary-main)' }: MethodTabProps) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1,
      minWidth: 80,
      py: 1.5,
      px: 1,
      borderRadius: 2,
      cursor: 'pointer',
      textAlign: 'center',
      border: '2px solid',
      borderColor: selected ? color : 'divider',
      bgcolor: selected ? `color-mix(in srgb, ${color} 8%, white)` : 'white',
      transition: 'all 0.2s',
      '&:hover': { borderColor: color, bgcolor: `color-mix(in srgb, ${color} 5%, white)` }
    }}
  >
    <i className={icon} style={{ fontSize: 22, color: selected ? color : '#9e9e9e' }} />
    <Typography
      variant='caption'
      display='block'
      fontWeight={selected ? 700 : 500}
      sx={{ mt: 0.5, color: selected ? color : 'text.secondary', lineHeight: 1.2 }}
    >
      {label}
    </Typography>
  </Box>
)

// ─── Security badge ───────────────────────────────────────────────────────────
const SecureBadge = ({ provider }: { provider: string }) => (
  <Stack direction='row' alignItems='center' justifyContent='center' spacing={1} sx={{ mb: 2.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, bgcolor: 'success.50', borderRadius: 10, border: '1px solid', borderColor: 'success.200' }}>
      <i className='tabler-shield-check' style={{ fontSize: 14, color: '#2e7d32' }} />
      <Typography variant='caption' fontWeight={700} color='success.dark'>Pago seguro con {provider}</Typography>
    </Box>
  </Stack>
)

// ─── Terms checkbox ───────────────────────────────────────────────────────────
const TermsCheck = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <Box sx={{ mb: 2.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
    <FormControlLabel
      sx={{ m: 0, alignItems: 'flex-start' }}
      control={<Checkbox size='small' checked={checked} onChange={e => onChange(e.target.checked)} sx={{ pt: 0 }} />}
      label={
        <Typography variant='caption' color='text.secondary' lineHeight={1.6}>
          He leído y acepto los{' '}
          <Link href='/terminos-y-condiciones' target='_blank' style={{ color: 'var(--mui-palette-primary-main)', fontWeight: 700 }}>
            Términos y Condiciones
          </Link>{' '}
          de la plataforma
        </Typography>
      }
    />
  </Box>
)

// ─── Copy row ─────────────────────────────────────────────────────────────────
const CopyRow = ({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
    <Typography variant='caption' color='text.secondary' sx={{ minWidth: 110 }}>{label}</Typography>
    <Stack direction='row' alignItems='center' spacing={0.25}>
      <Typography variant='body2' fontWeight={700} fontFamily='monospace'>{value}</Typography>
      <Tooltip title='Copiar'>
        <IconButton size='small' onClick={onCopy} sx={{ p: 0.5, color: 'text.disabled', '&:hover': { color: 'primary.main' } }}>
          <i className='tabler-copy' style={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  </Box>
)

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
  const isMercadoPagoEnabled = configs.MP_ENABLED !== 'false' && !!configs.MP_ACCESS_TOKEN

  const [paymentMethod, setPaymentMethod] = useState<'izipay' | 'paypal' | 'culqi' | 'mercadopago' | 'manual'>('culqi')
  const [isCulqiLoaded, setIsCulqiLoaded] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [culqiSettings, setCulqiSettings] = useState<any>(null)

  const [metodosManual, setMetodosManual] = useState<MetodoPagoManualPublico[]>([])
  const [isManualEnabled, setIsManualEnabled] = useState(false)
  const [whatsappNumero, setWhatsappNumero] = useState('')
  const [selectedMetodoManualId, setSelectedMetodoManualId] = useState<string | null>(null)
  const [voucher, setVoucher] = useState<File | null>(null)
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [whatsappQr, setWhatsappQr] = useState('')

  const [formData, setFormData] = useState({ nombres: '', apellidos: '', correo: '' })

  const subtotal = courses.reduce((acc, c) => acc + Number(c.precio), 0)
  const displayTotal = finalTotal !== undefined ? finalTotal : subtotal
  const currencySymbol = courses[0]?.moneda === 'USD' ? '$' : 'S/'

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any

      setFormData({ nombres: user.nombre || user.name || '', apellidos: user.apellido || '', correo: user.email || '' })
    }
  }, [session])

  useEffect(() => {
    fetch('/api/metodos-pago')
      .then(r => r.json())
      .then(d => {
        if (d.result) {
          setIsManualEnabled(d.result.habilitado)
          setMetodosManual(d.result.metodos || [])
          setWhatsappNumero(d.result.whatsapp_numero || '')

          if (d.result.metodos?.length > 0) setSelectedMetodoManualId(d.result.metodos[0].id)
        }
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (!isCulqiEnabled && paymentMethod === 'culqi') {
      if (isIzipayEnabled) setPaymentMethod('izipay')
      else if (isPaypalEnabled) setPaymentMethod('paypal')
      else if (isManualEnabled) setPaymentMethod('manual')
    }
  }, [isCulqiEnabled, isIzipayEnabled, isPaypalEnabled, isManualEnabled, paymentMethod])

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return
    setVoucher(file)
    setVoucherPreview(URL.createObjectURL(file))
  }

  const handlePaymentSuccess = useCallback(() => {
    setPaymentSuccess(true)
    clearCart()
    setTimeout(() => router.push('/estudiante/mis-cursos'), 2000)
  }, [router, clearCart])

  const handlePaymentResponse = useCallback(async (response: any, pedidoId: string) => {
    try {
      const confirmRes = await fetch('/api/izipay/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId, response })
      })

      const confirmData = await confirmRes.json()

      if (response.code === '00') {
        confirmRes.ok ? handlePaymentSuccess() : setPaymentError(confirmData.message || 'Error al confirmar el pago')
      } else {
        setPaymentError(response.messageUser || 'El pago no fue completado')
      }
    } catch {
      setPaymentError('Error inesperado al confirmar el pago')
    }
  }, [handlePaymentSuccess])

  const handleCulqiToken = useCallback(async (token: string, email: string) => {
    try {
      setIsLoading(true)
      const pedidoId = (window as any)._currentPedidoId

      const res = await fetch('/api/culqi/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId, tokenId: token, email })
      })

      const data = await res.json()

      res.ok ? handlePaymentSuccess() : setPaymentError(data.message || 'Error al procesar el cargo con Culqi')
    } catch {
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
        body: JSON.stringify({ cursoIds: courses.map(c => c.id), codigoCupon: appliedCouponCode, gateway: 'IZIPAY' })
      })

      const dataRaw = await response.json()

      if (!response.ok) throw new Error(dataRaw.message || 'Error al iniciar el pago')

      const { iziConfig, token, keyRSA, pedidoId } = dataRaw.result

      if (!window.Izipay) throw new Error('El SDK de Izipay no se ha cargado.')

      const checkout = new window.Izipay({ config: iziConfig })

      checkout.LoadForm({ authorization: token, keyRSA, callbackResponse: (r: any) => handlePaymentResponse(r, pedidoId) })
    } catch (error: any) {
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
        body: JSON.stringify({ cursoIds: courses.map(c => c.id), codigoCupon: appliedCouponCode, gateway: 'CULQI' })
      })

      const dataRaw = await response.json()

      if (!response.ok) throw new Error(dataRaw.message || 'Error al iniciar el pedido')

      const { pedidoId, culqiOrderId, rsaId, rsaPublicKey } = dataRaw.result

        ; (window as any)._currentPedidoId = pedidoId
      setCulqiSettings({ currency: courses[0]?.moneda || 'PEN', amount: Math.round(displayTotal * 100), order: culqiOrderId, xculqirsaid: rsaId, rsapublickey: rsaPublicKey })
    } catch (error: any) {
      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualCheckout = async () => {
    if (!session) {
      openLogin();

      return
    }

    if (!selectedMetodoManualId) {
      setPaymentError('Selecciona un método de pago');

      return
    }

    if (!voucher) {
      setPaymentError('Debes subir una imagen de tu comprobante de pago');

      return
    }

    setPaymentError(null)

    try {
      setIsLoading(true)

      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cursoIds: courses.map(c => c.id),
          codigoCupon: appliedCouponCode,
          gateway: 'MANUAL',
          metodoPagoManualId: selectedMetodoManualId
        })
      })

      const checkoutData = await checkoutRes.json()

      if (!checkoutRes.ok) throw new Error(checkoutData.message || 'Error al crear el pedido')

      const { pedidoId, numeroPedido, total, cursos: titulosCursos } = checkoutData.result

      const fd = new FormData()

      fd.append('voucher', voucher)

      const voucherRes = await fetch(`/api/pedidos/${pedidoId}/voucher`, { method: 'POST', body: fd })

      if (!voucherRes.ok) {
        const vd = await voucherRes.json()

        throw new Error(vd.message || 'Error al subir el comprobante')
      }

      clearCart()

      if (whatsappNumero) {
        const nombre = (session.user as any)?.nombre || session.user?.name || ''
        const cursosFormateados = (titulosCursos as string[]).map(t => `  • ${t}`).join('\n')
        const totalFormateado = `${currencySymbol} ${Number(total).toFixed(2)}`

        const mensaje = [
          `🎓 *NUEVO PEDIDO REGISTRADO*`,
          `━━━━━━━━━━━━━━━━━`,
          ``,
          `👤 *Estudiante:* ${nombre}`,
          `🔖 *N° Pedido:* #${numeroPedido}`,
          ``,
          `📚 *Cursos:*`,
          cursosFormateados,
          ``,
          `💳 *Método:* ${selectedMetodo?.nombre || ''}`,
          `💰 *Total pagado:* ${totalFormateado}`,
          ``,
          `📎 Adjunto el comprobante de pago para su verificación.`,
          ``,
          `_Quedo atento a la confirmación. ¡Gracias!_ 🙏`,
        ].join('\n')

        const url = `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(mensaje)}`
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)

        if (isMobile) {
          window.open(url, '_blank')
          router.push('/estudiante/pedidos')
        } else {
          const qrDataUrl = await toDataURL(url, {
            width: 320,
            margin: 3,
            errorCorrectionLevel: 'L',
            color: { dark: '#111111', light: '#FFFFFF' }
          })

          setWhatsappUrl(url)
          setWhatsappQr(qrDataUrl)
          setWhatsappModalOpen(true)
        }
      } else {
        router.push('/estudiante/pedidos')
      }
    } catch (error: any) {
      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMercadoPagoCheckout = async () => {
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
        body: JSON.stringify({ cursoIds: courses.map(c => c.id), codigoCupon: appliedCouponCode, gateway: 'MERCADOPAGO' })
      })

      const dataRaw = await response.json()

      if (!response.ok) throw new Error(dataRaw.message || 'Error al iniciar el pago con Mercado Pago')

      const { mpSandboxInitPoint, mpInitPoint } = dataRaw.result

      window.location.href = mpSandboxInitPoint || mpInitPoint
    } catch (error: any) {
      setPaymentError(error.message || 'Ocurrió un error inesperado')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (culqiSettings && window.Culqi?.open) window.Culqi.open()
  }, [culqiSettings])

  const isGuest = !session
  const paypalClientId = configs.PAYPAL_CLIENT_ID || 'test'
  const selectedMetodo = metodosManual.find(m => m.id === selectedMetodoManualId)

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text).catch(() => { })

  if (paymentSuccess) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={3} alignItems='center' sx={{ py: 4 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className='tabler-check' style={{ fontSize: '2.5rem', color: '#2e7d32' }} />
          </Box>
          <Typography variant='h5' sx={{ fontWeight: 800, color: 'success.main' }}>¡Pago Exitoso!</Typography>
          <Typography variant='body1' color='text.secondary' textAlign='center'>
            Tu inscripción al curso ha sido confirmada. Serás redirigido a tus cursos en unos segundos...
          </Typography>
          <CircularProgress size={24} color='success' />
        </Stack>
      </Paper>
    )
  }

  return (
    <>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
        <IzipayScript />
        <CulqiScript
          publicKey={configs.CULQI_PUBLIC_KEY || ''}
          settings={culqiSettings || { currency: courses[0]?.moneda || 'PEN', amount: Math.round(displayTotal * 100) }}
          client={{ email: formData.correo }}
          options={{ lang: 'auto', installments: true, paymentMethods: { tarjeta: true, yape: true, billetera: true, bancaMovil: true, agente: true, cuotealo: true } }}
          onLoad={() => setIsCulqiLoaded(true)}
          onTokenReceived={handleCulqiToken}
          onError={(err) => setPaymentError(err)}
        />

        <Stack spacing={4}>
          {/* ─── Header ─── */}
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>
              Información de <span style={{ color: 'var(--mui-palette-primary-main)' }}>Pago</span>
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {isGuest ? 'Identifícate e ingresa tus datos para finalizar la inscripción.' : 'Verifica tus datos y completa el pago.'}
            </Typography>
          </Box>

          {paymentError && (
            <Alert severity='error' onClose={() => setPaymentError(null)} sx={{ borderRadius: '12px' }}>
              {paymentError}
            </Alert>
          )}

          {/* ─── Student data ─── */}
          <Box>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-user' style={{ fontSize: 15, color: 'var(--mui-palette-primary-main)' }} />
              </Box>
              <Typography variant='subtitle1' fontWeight={700} color='text.primary'>Datos del Estudiante</Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Nombres'
                  value={formData.nombres}
                  onChange={e => setFormData(p => ({ ...p, nombres: e.target.value }))}
                  disabled={!isGuest}
                  size='small'
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Apellidos'
                  value={formData.apellidos}
                  onChange={e => setFormData(p => ({ ...p, apellidos: e.target.value }))}
                  disabled={!isGuest}
                  size='small'
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Correo Electrónico'
                  value={formData.correo}
                  onChange={e => setFormData(p => ({ ...p, correo: e.target.value }))}
                  disabled={!isGuest}
                  size='small'
                  InputProps={{ startAdornment: <InputAdornment position='start'><i className='tabler-mail' style={{ fontSize: 16 }} /></InputAdornment> }}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ─── Payment method selector ─── */}
          <Box>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-credit-card' style={{ fontSize: 15, color: 'var(--mui-palette-primary-main)' }} />
              </Box>
              <Typography variant='subtitle1' fontWeight={700} color='text.primary'>Método de Pago</Typography>
            </Stack>

            {(!isCulqiEnabled && !isIzipayEnabled && !isPaypalEnabled && !isMercadoPagoEnabled && (!isManualEnabled || metodosManual.length === 0)) && (
              <Alert severity='warning' sx={{ mb: 2, borderRadius: '12px' }}>
                No hay métodos de pago habilitados en este momento. Por favor, contacte con soporte.
              </Alert>
            )}

            {/* Tab selector */}
            <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap sx={{ mb: 3 }}>
              {isCulqiEnabled && (
                <MethodTab icon='tabler-credit-card' label='Culqi' selected={paymentMethod === 'culqi'} onClick={() => setPaymentMethod('culqi')} />
              )}
              {isIzipayEnabled && (
                <MethodTab icon='tabler-building-bank' label='Izipay' selected={paymentMethod === 'izipay'} onClick={() => setPaymentMethod('izipay')} />
              )}
              {isPaypalEnabled && (
                <MethodTab icon='tabler-brand-paypal' label='PayPal' selected={paymentMethod === 'paypal'} onClick={() => setPaymentMethod('paypal')} color='#003087' />
              )}
              {isMercadoPagoEnabled && (
                <MethodTab icon='tabler-shopping-cart' label='Mercado Pago' selected={paymentMethod === 'mercadopago'} onClick={() => setPaymentMethod('mercadopago')} color='#009ee3' />
              )}
              {isManualEnabled && metodosManual.length > 0 && (
                <MethodTab icon='tabler-device-mobile-message' label='Yape / Transferencia' selected={paymentMethod === 'manual'} onClick={() => setPaymentMethod('manual')} color='#6c3483' />
              )}
            </Stack>

            {/* ── Culqi ── */}
            {paymentMethod === 'culqi' && isCulqiEnabled && (
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                <SecureBadge provider='Culqi' />
                <TermsCheck checked={acceptedTerms} onChange={setAcceptedTerms} />
                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  onClick={handleCulqiCheckout}
                  disabled={isLoading || !isCulqiLoaded || (!acceptedTerms && !isGuest)}
                  startIcon={isLoading || !isCulqiLoaded ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-lock' />}
                  sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none' }}
                >
                  {isLoading ? 'Procesando...' : !isCulqiLoaded ? 'Cargando...' : isGuest ? 'Identificarse para Comprar' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)}`}
                </Button>
              </Box>
            )}

            {/* ── Izipay ── */}
            {paymentMethod === 'izipay' && isIzipayEnabled && (
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                <SecureBadge provider='Izipay' />
                <TermsCheck checked={acceptedTerms} onChange={setAcceptedTerms} />
                <Button
                  variant='contained'
                  fullWidth
                  size='large'
                  onClick={handleCheckout}
                  disabled={isLoading || (!acceptedTerms && !isGuest)}
                  startIcon={isLoading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-lock' />}
                  sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none' }}
                >
                  {isLoading ? 'Preparando...' : isGuest ? 'Identificarse para Comprar' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)}`}
                </Button>
              </Box>
            )}

            {/* ── PayPal ── */}
            {paymentMethod === 'paypal' && isPaypalEnabled && (
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                {isGuest ? (
                  <Button variant='contained' fullWidth size='large' onClick={() => openLogin()} sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}>
                    Identificarse para Comprar
                  </Button>
                ) : (
                  <>
                    <SecureBadge provider='PayPal' />
                    <TermsCheck checked={acceptedTerms} onChange={setAcceptedTerms} />
                    {acceptedTerms ? (
                      <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'USD' }}>
                        <PayPalPaymentButton cursoIds={courses.map(c => c.id)} codigoCupon={appliedCouponCode} onSuccess={handlePaymentSuccess} onError={(err) => setPaymentError(err)} />
                      </PayPalScriptProvider>
                    ) : (
                      <Alert severity='info' sx={{ borderRadius: 2 }}>Acepta los términos y condiciones para habilitar el pago con PayPal.</Alert>
                    )}
                  </>
                )}
              </Box>
            )}

            {/* ── Mercado Pago ── */}
            {paymentMethod === 'mercadopago' && isMercadoPagoEnabled && (
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                {isGuest ? (
                  <Button variant='contained' fullWidth size='large' onClick={() => openLogin()} sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}>
                    Identificarse para Comprar
                  </Button>
                ) : (
                  <>
                    <SecureBadge provider='Mercado Pago' />
                    <TermsCheck checked={acceptedTerms} onChange={setAcceptedTerms} />
                    <Button
                      variant='contained'
                      fullWidth
                      size='large'
                      onClick={handleMercadoPagoCheckout}
                      disabled={isLoading || !acceptedTerms}
                      startIcon={isLoading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-shopping-cart' />}
                      sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: '#009ee3', '&:hover': { bgcolor: '#0087c2' } }}
                    >
                      {isLoading ? 'Redirigiendo...' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)} con Mercado Pago`}
                    </Button>
                    <Typography variant='caption' color='text.secondary' textAlign='center' display='block' sx={{ mt: 1.5 }}>
                      Serás redirigido a Mercado Pago para completar tu pago de forma segura.
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {/* ── Pago Manual ── */}
            {paymentMethod === 'manual' && isManualEnabled && (
              <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                {isGuest ? (
                  <Box sx={{ p: 3 }}>
                    <Button
                      variant='contained'
                      fullWidth
                      size='large'
                      onClick={() => openLogin()}
                      sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}
                    >
                      Identificarse para Comprar
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={0} divider={<Divider />}>

                    {/* Step 1: Seleccionar método */}
                    <Box sx={{ p: 3 }}>
                      <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography variant='caption' color='white' fontWeight={800} lineHeight={1}>1</Typography>
                        </Box>
                        <Typography variant='subtitle2' fontWeight={700}>Elige dónde vas a realizar el pago</Typography>
                      </Stack>

                      <Stack spacing={1.5}>
                        {metodosManual.map(m => {
                          const isSelected = selectedMetodoManualId === m.id

                          return (
                            <Box
                              key={m.id}
                              onClick={() => setSelectedMetodoManualId(m.id)}
                              sx={{
                                border: '2px solid',
                                borderColor: isSelected ? 'primary.main' : 'divider',
                                borderRadius: 2.5,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                transition: 'all 0.2s',
                                bgcolor: isSelected ? 'primary.50' : 'white',
                                '&:hover': { borderColor: 'primary.main' }
                              }}
                            >
                              <Stack direction='row' alignItems='center' spacing={2} sx={{ p: 1.75 }}>
                                {m.imagen_url ? (
                                  <Avatar
                                    src={m.imagen_url}
                                    variant='rounded'
                                    sx={{ width: 44, height: 44, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
                                  />
                                ) : (
                                  <Avatar
                                    variant='rounded'
                                    sx={{ width: 44, height: 44, borderRadius: 1.5, bgcolor: 'primary.100' }}
                                  >
                                    <i className='tabler-cash' style={{ fontSize: 20, color: 'var(--mui-palette-primary-main)' }} />
                                  </Avatar>
                                )}
                                <Box flex={1} minWidth={0}>
                                  <Typography variant='body2' fontWeight={700} noWrap>{m.nombre_banco || m.nombre}</Typography>
                                  <Typography variant='caption' color='text.secondary' noWrap>{m.numero_cuenta}</Typography>
                                </Box>
                                <Box
                                  sx={{
                                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                                    border: '2px solid', borderColor: isSelected ? 'primary.main' : 'divider',
                                    bgcolor: isSelected ? 'primary.main' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {isSelected && <i className='tabler-check' style={{ fontSize: 11, color: 'white' }} />}
                                </Box>
                              </Stack>
                            </Box>
                          )
                        })}
                      </Stack>
                    </Box>

                    {/* Step 2: Datos del método seleccionado */}
                    {selectedMetodo && (
                      <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                        <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography variant='caption' color='white' fontWeight={800} lineHeight={1}>2</Typography>
                          </Box>
                          <Typography variant='subtitle2' fontWeight={700}>Realiza el pago con estos datos</Typography>
                        </Stack>

                        <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                          {selectedMetodo.imagen_url && (
                            <Box sx={{ textAlign: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                              <Box
                                component='img'
                                src={selectedMetodo.imagen_url}
                                alt={selectedMetodo.nombre}
                                sx={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', borderRadius: 1 }}
                              />
                            </Box>
                          )}

                          <Box sx={{ px: 2.5, py: 1.5 }}>
                            {selectedMetodo.nombre_banco && (
                              <CopyRow
                                label='Banco / Billetera'
                                value={selectedMetodo.nombre_banco}
                                onCopy={() => copyToClipboard(selectedMetodo.nombre_banco!)}
                              />
                            )}
                            <CopyRow
                              label='N° Cuenta / Yape'
                              value={selectedMetodo.numero_cuenta}
                              onCopy={() => copyToClipboard(selectedMetodo.numero_cuenta)}
                            />
                            {selectedMetodo.cci && (
                              <CopyRow
                                label='CCI'
                                value={selectedMetodo.cci}
                                onCopy={() => copyToClipboard(selectedMetodo.cci!)}
                              />
                            )}
                          </Box>

                          <Box sx={{ px: 2.5, py: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant='caption' fontWeight={600} color='primary.main'>Monto exacto a pagar</Typography>
                            <Chip
                              label={`${currencySymbol} ${displayTotal.toFixed(2)}`}
                              color='primary'
                              size='small'
                              sx={{ fontWeight: 800, fontSize: '0.85rem' }}
                            />
                          </Box>
                        </Box>

                        {selectedMetodo.descripcion && (
                          <Alert severity='info' sx={{ mt: 2, borderRadius: 2, fontSize: 12 }}>{selectedMetodo.descripcion}</Alert>
                        )}
                      </Box>
                    )}

                    {/* Step 3: Subir voucher */}
                    <Box sx={{ p: 3 }}>
                      <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography variant='caption' color='white' fontWeight={800} lineHeight={1}>3</Typography>
                        </Box>
                        <Box>
                          <Typography variant='subtitle2' fontWeight={700}>Sube tu comprobante de pago</Typography>
                          <Typography variant='caption' color='text.secondary'>Captura de pantalla o foto de la transferencia (JPG, PNG, WEBP · máx. 5 MB)</Typography>
                        </Box>
                      </Stack>

                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/jpeg,image/png,image/webp'
                        style={{ display: 'none' }}
                        onChange={handleVoucherChange}
                      />

                      {voucherPreview ? (
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            component='img'
                            src={voucherPreview}
                            alt='Comprobante'
                            sx={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 2, border: '2px solid', borderColor: 'success.main', display: 'block' }}
                          />
                          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                            <IconButton
                              size='small'
                              onClick={() => { setVoucher(null); setVoucherPreview(null) }}
                              sx={{ bgcolor: 'error.main', color: 'white', width: 28, height: 28, '&:hover': { bgcolor: 'error.dark' } }}
                            >
                              <i className='tabler-x' style={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                          <Stack direction='row' alignItems='center' justifyContent='center' spacing={0.75} sx={{ mt: 1 }}>
                            <i className='tabler-circle-check-filled' style={{ fontSize: 16, color: '#2e7d32' }} />
                            <Typography variant='caption' color='success.dark' fontWeight={600}>Comprobante listo</Typography>
                          </Stack>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2.5,
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                            <i className='tabler-cloud-upload' style={{ fontSize: 28, color: '#9e9e9e' }} />
                          </Box>
                          <Typography variant='body2' fontWeight={600} color='text.secondary'>
                            Haz clic para subir tu comprobante
                          </Typography>
                          <Typography variant='caption' color='text.disabled'>
                            o arrastra tu imagen aquí
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Confirm button */}
                    <Box sx={{ p: 3, bgcolor: voucher ? 'primary.50' : 'grey.50' }}>
                      <Button
                        variant='contained'
                        fullWidth
                        size='large'
                        onClick={handleManualCheckout}
                        disabled={isLoading || !voucher}
                        startIcon={isLoading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-send' />}
                        sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none', letterSpacing: 0.3 }}
                      >
                        {isLoading ? 'Confirmando pedido...' : 'Confirmar Pedido'}
                      </Button>
                      <Typography variant='caption' color='text.secondary' textAlign='center' display='block' sx={{ mt: 1.5 }}>
                        Tu pedido quedará en revisión. El acceso al curso se activa al verificar el pago.
                      </Typography>
                    </Box>

                  </Stack>
                )}
              </Box>
            )}

          </Box>
        </Stack>
      </Paper>

      {/* Modal WhatsApp Desktop */}
      <Dialog
        open={whatsappModalOpen}
        onClose={() => { setWhatsappModalOpen(false); router.push('/estudiante/pedidos') }}
        maxWidth='sm'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: configs.PRIMARY_COLOR_MAIN,
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 8 }}>

          <Box sx={{ pt: 3.5, pb: 2, px: 3, textAlign: 'center', position: 'relative' }}>
            <IconButton
              onClick={() => { setWhatsappModalOpen(false); router.push('/estudiante/pedidos') }}
              sx={{
                position: 'absolute', top: 10, right: 10,
                color: 'white', width: 28, height: 28,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
              }}
            >
              <i className='tabler-x' style={{ fontSize: 16 }} />
            </IconButton>
            <Typography variant='h4' fontWeight={800} color='white' letterSpacing={1.5} textTransform='uppercase' lineHeight={1.3}>
              Realizar pedido a WhatsApp
            </Typography>
            <Box sx={{ width: 36, height: 2.5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 2, mx: 'auto', mt: 1 }} />
          </Box>

          <Box sx={{ px: 2.5, py: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

            <Paper
              elevation={0}
              sx={{ borderRadius: 3, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' }, transition: 'background 0.15s' }}
              onClick={() => window.open(whatsappUrl, '_blank')}
            >
              <Stack direction='row' alignItems='center' spacing={2} sx={{ px: 2.5, py: 1.75 }}>
                <Box sx={{ width: 50, height: 50, borderRadius: '50%', flexShrink: 0, bgcolor: '#E8F9EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className='tabler-brand-whatsapp' style={{ fontSize: 30, color: '#25D366' }} />
                </Box>
                <Box sx={{ flex: 1, p: 2 }}>
                  <Typography variant='h5' fontWeight={700} color='text.primary'>Ir a WhatsApp Web</Typography>
                  <Typography variant='subtitle1' color='text.secondary'>Continuar en esta computadora</Typography>
                </Box>
                <i className='tabler-chevron-right' style={{ fontSize: 16, color: '#bbb' }} />
              </Stack>
            </Paper>

            <Stack direction='row' alignItems='center' spacing={1.5} sx={{ px: 2, py: 6 }}>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.25)' }} />
              <Typography variant='h6' color='rgba(255,255,255,0.75)' fontWeight={700} letterSpacing={1.5} textTransform='uppercase'>
                O escanea el código
              </Typography>
              <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.25)' }} />
            </Stack>

            <Paper elevation={0} sx={{ borderRadius: 3, py: 5, px: 5, textAlign: 'center' }}>
              <Typography variant='subtitle1' color='text.secondary' sx={{ mb: 2, lineHeight: 1.5 }}>
                Escanea este código QR con tu celular para abrir el chat de WhatsApp
              </Typography>
              {whatsappQr && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={whatsappQr} alt='QR WhatsApp' style={{ width: '100%', maxWidth: 300, height: 'auto', display: 'block', borderRadius: 8 }} />
                </Box>
              )}
              <Stack direction='row' alignItems='center' justifyContent='center' spacing={0.75} sx={{ mt: 1.5 }}>
                <i className='tabler-camera' style={{ fontSize: 13, color: '#aaa' }} />
                <Typography variant='caption' color='text.disabled'>Usa la cámara de tu celular</Typography>
              </Stack>
            </Paper>

          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PaymentForm
