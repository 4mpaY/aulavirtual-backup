'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  Box, Typography, Stack, TextField, Button, Grid, Paper,
  InputAdornment, Alert, CircularProgress, Checkbox, Divider,
  IconButton, Tooltip, Avatar, FormControlLabel
} from '@mui/material'
import { toDataURL } from 'qrcode'
import { useSession } from 'next-auth/react'

import { useConfig } from '@/contexts/ConfigContext'
import { useAuthModal } from '@/contexts/AuthModalContext'
import AppModal from '@/utils/components/AppModal'
import { buildWhatsAppUrl } from '@/utils/functions/whatsapp'
import CulqiScript from './CulqiScript'

declare global {
  interface Window { Culqi: any }
}

interface MetodoPagoManual {
  id: string; nombre: string; nombre_banco?: string | null; numero_cuenta: string
  cci?: string | null; descripcion?: string | null; imagen_url?: string | null
}

interface SimulacroPaymentFormProps {
  simulacro: { id: string; titulo: string; precio: number; moneda: string }
}

const MethodTab = ({ icon, label, selected, onClick, color = 'var(--mui-palette-primary-main)' }: any) => (
  <Box onClick={onClick} sx={{
    flex: 1, minWidth: 80, py: 1.5, px: 1, borderRadius: 2, cursor: 'pointer', textAlign: 'center',
    border: '2px solid', borderColor: selected ? color : 'divider',
    bgcolor: selected ? `color-mix(in srgb, ${color} 8%, white)` : 'white', transition: 'all 0.2s',
    '&:hover': { borderColor: color }
  }}>
    <i className={icon} style={{ fontSize: 22, color: selected ? color : '#9e9e9e' }} />
    <Typography variant='caption' display='block' fontWeight={selected ? 700 : 500}
      sx={{ mt: 0.5, color: selected ? color : 'text.secondary', lineHeight: 1.2 }}>
      {label}
    </Typography>
  </Box>
)

const SecureBadge = ({ provider }: { provider: string }) => (
  <Stack direction='row' alignItems='center' justifyContent='center' spacing={1} sx={{ mb: 2.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, bgcolor: 'success.50', borderRadius: 10, border: '1px solid', borderColor: 'success.200' }}>
      <i className='tabler-shield-check' style={{ fontSize: 14, color: '#2e7d32' }} />
      <Typography variant='caption' fontWeight={700} color='success.dark'>Pago seguro con {provider}</Typography>
    </Box>
  </Stack>
)

const TermsCheck = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <Box sx={{ mb: 2.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
    <FormControlLabel sx={{ m: 0, alignItems: 'flex-start' }}
      control={<Checkbox size='small' checked={checked} onChange={e => onChange(e.target.checked)} sx={{ pt: 0 }} />}
      label={
        <Typography variant='caption' color='text.secondary' lineHeight={1.6}>
          He leído y acepto los{' '}
          <Link href='/terminos-y-condiciones' target='_blank' style={{ color: 'var(--mui-palette-primary-main)', fontWeight: 700 }}>
            Términos y Condiciones
          </Link>
        </Typography>
      }
    />
  </Box>
)

const CopyRow = ({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 0.75 }}>
    <Typography variant='caption' color='text.secondary' sx={{ minWidth: 110 }}>{label}</Typography>
    <Stack direction='row' alignItems='center' spacing={0.25}>
      <Typography variant='body2' fontWeight={700} fontFamily='monospace'>{value}</Typography>
      <Tooltip title='Copiar'><IconButton size='small' onClick={onCopy} sx={{ p: 0.5 }}><i className='tabler-copy' style={{ fontSize: 14 }} /></IconButton></Tooltip>
    </Stack>
  </Box>
)

export default function SimulacroPaymentForm({ simulacro }: SimulacroPaymentFormProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { openLogin } = useAuthModal()
  const configs = useConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [culqiSettings, setCulqiSettings] = useState<any>(null)
  const [isCulqiLoaded, setIsCulqiLoaded] = useState(false)
  const [formData, setFormData] = useState({ nombres: '', apellidos: '', correo: '' })
  const [tipoComprobante, setTipoComprobante] = useState<'TICKET' | 'BOLETA' | 'FACTURA'>('TICKET')
  const [numeroComprobante, setNumeroComprobante] = useState('')
  const [comprobanteError, setComprobanteError] = useState<string | null>(null)

  const isCulqiEnabled = configs.CULQI_ENABLED !== 'false'
  const isIzipayEnabled = configs.IZIPAY_ENABLED !== 'false'
  const isMercadoPagoEnabled = configs.MP_ENABLED !== 'false' && !!configs.MP_ACCESS_TOKEN

  const [paymentMethod, setPaymentMethod] = useState<'culqi' | 'izipay' | 'mercadopago' | 'manual'>('culqi')
  const [metodosManual, setMetodosManual] = useState<MetodoPagoManual[]>([])
  const [isManualEnabled, setIsManualEnabled] = useState(false)
  const [whatsappNumero, setWhatsappNumero] = useState('')
  const [selectedMetodoManualId, setSelectedMetodoManualId] = useState<string | null>(null)
  const [voucher, setVoucher] = useState<File | null>(null)
  const [voucherPreview, setVoucherPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<{ pedidoId: string; numeroPedido: number; total: number } | null>(null)

  const currencySymbol = simulacro.moneda === 'USD' ? '$' : 'S/'
  const displayTotal = Number(simulacro.precio)

  useEffect(() => {
    if (session?.user) {
      const u = session.user as any

      setFormData({ nombres: u.nombre || u.name || '', apellidos: u.apellido || '', correo: u.email || '' })
    }
  }, [session])

  useEffect(() => {
    fetch('/api/metodos-pago').then(r => r.json()).then(d => {
      if (d.result) {
        setIsManualEnabled(d.result.habilitado)
        setMetodosManual(d.result.metodos || [])
        setWhatsappNumero(d.result.whatsapp_numero || '')
        if (d.result.metodos?.length > 0) setSelectedMetodoManualId(d.result.metodos[0].id)
      }
    }).catch(() => { })
  }, [])

  useEffect(() => {
    if (!isCulqiEnabled && paymentMethod === 'culqi') {
      if (isIzipayEnabled) setPaymentMethod('izipay')
      else if (isMercadoPagoEnabled) setPaymentMethod('mercadopago')
      else if (isManualEnabled) setPaymentMethod('manual')
    }
  }, [isCulqiEnabled, isIzipayEnabled, isMercadoPagoEnabled, isManualEnabled, paymentMethod])

  useEffect(() => {
    if (culqiSettings && window.Culqi?.open) window.Culqi.open()
  }, [culqiSettings])

  const validateComprobante = useCallback(() => {
    if (configs.PEDIDOS_SOLICITAR_COMPROBANTE === 'false') return true

    setComprobanteError(null)

    if (tipoComprobante === 'FACTURA' && !/^\d{11}$/.test(numeroComprobante)) {
      setComprobanteError('El RUC debe tener 11 dígitos')

      return false
    }

    if (tipoComprobante === 'BOLETA' && !/^\d{8}$|^\d{11}$/.test(numeroComprobante)) {
      setComprobanteError('El documento debe tener 8 u 11 dígitos')

      return false
    }

    return true
  }, [configs.PEDIDOS_SOLICITAR_COMPROBANTE, tipoComprobante, numeroComprobante])

  const handlePaymentSuccess = useCallback(() => {
    setPaymentSuccess(true)
    setTimeout(() => router.push('/estudiante/mis-simulacros'), 2000)
  }, [router])

  const handleCulqiToken = useCallback(async (token: string, email: string) => {
    try {
      setIsLoading(true)

      const pedidoId = (window as any)._currentPedidoId

      const res = await fetch('/api/culqi/charge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidoId, tokenId: token, email })
      })

      const data = await res.json()

      res.ok ? handlePaymentSuccess() : setPaymentError(data.message || 'Error con Culqi')
    } catch { setPaymentError('Error inesperado') } finally { setIsLoading(false) }
  }, [handlePaymentSuccess])

  const checkout = async (gw: string) => {
    if (!session) {
      openLogin()

      return
    }

    if (!validateComprobante()) return

    setPaymentError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/checkout/simulacro', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulacroId: simulacro.id, gateway: gw, tipoComprobante, numeroComprobante })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Error al iniciar el pago')

      return data.result
    } catch (e: any) {
      setPaymentError(e.message)

      return null
    } finally { setIsLoading(false) }
  }

  const handleCulqiCheckout = async () => {
    const result = await checkout('CULQI')

    if (!result) return

    const { pedidoId, culqiOrderId, rsaId, rsaPublicKey } = result

    ;(window as any)._currentPedidoId = pedidoId
    setCulqiSettings({ currency: simulacro.moneda || 'PEN', amount: Math.round(displayTotal * 100), order: culqiOrderId, xculqirsaid: rsaId, rsapublickey: rsaPublicKey })
  }

  const handleIzipayCheckout = async () => {
    const result = await checkout('IZIPAY')

    if (!result) return

    const { paymentURL } = result

    if (!paymentURL) {
      setPaymentError('No se pudo obtener la URL de pago de Izipay.')

      return
    }

    window.location.href = paymentURL
  }

  const handleMercadoPagoCheckout = async () => {
    const result = await checkout('MERCADOPAGO')

    if (!result) return

    window.location.href = result.mpSandboxInitPoint || result.mpInitPoint
  }

  const handleManualCheckout = async () => {
    if (!session) {
      openLogin()

      return
    }

    if (!selectedMetodoManualId) {
      setPaymentError('Selecciona un método de pago')

      return
    }

    if (!voucher) {
      setPaymentError('Debes subir tu comprobante')

      return
    }

    if (!validateComprobante()) return

    setPaymentError(null)
    setIsLoading(true)

    try {
      const res = await fetch('/api/checkout/simulacro', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulacroId: simulacro.id, gateway: 'MANUAL', metodoPagoManualId: selectedMetodoManualId, tipoComprobante, numeroComprobante })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Error al crear el pedido')

      const { pedidoId, numeroPedido, total } = data.result

      const fd = new FormData()

      fd.append('voucher', voucher)

      const vRes = await fetch(`/api/pedidos/${pedidoId}/voucher`, { method: 'POST', body: fd })

      if (!vRes.ok) {
        const vd = await vRes.json()

        throw new Error(vd.message || 'Error al subir comprobante')
      }

      if (whatsappNumero) {
        const nombre = (session.user as any)?.nombre || session.user?.name || ''
        const msg = `Pedido #${numeroPedido} - ${nombre}\n  • ${simulacro.titulo}\nTotal: ${currencySymbol} ${Number(total).toFixed(2)}\nAdjunto comprobante.`
        const url = buildWhatsAppUrl(whatsappNumero, { text: msg })

        try {
          await toDataURL(url, { width: 400, margin: 2, errorCorrectionLevel: 'L', color: { dark: '#000000', light: '#FFFFFF' } })
          setWhatsappUrl(url)
        } catch {
          setWhatsappUrl(url)
        }
      }

      setVoucher(null)
      setVoucherPreview(null)

      if (fileInputRef.current) fileInputRef.current.value = ''

      setConfirmedOrder({ pedidoId, numeroPedido, total: Number(total) })
      setConfirmModalOpen(true)
    } catch (e: any) {
      setPaymentError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const isGuest = !session
  const selectedMetodo = metodosManual.find(m => m.id === selectedMetodoManualId)
  const copyToClipboard = (t: string) => navigator.clipboard.writeText(t).catch(() => { })

  if (paymentSuccess) {
    return (
      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
        <Stack spacing={3} alignItems='center' sx={{ py: 4 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'success.light', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className='tabler-check' style={{ fontSize: '2.5rem', color: '#2e7d32' }} />
          </Box>
          <Typography variant='h5' sx={{ fontWeight: 800, color: 'success.main' }}>¡Pago Exitoso!</Typography>
          <Typography variant='body1' color='text.secondary' textAlign='center'>
            Ya tienes acceso al simulacro. Serás redirigido en unos segundos...
          </Typography>
          <CircularProgress size={24} color='success' />
        </Stack>
      </Paper>
    )
  }

  return (
    <>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
        <CulqiScript
          publicKey={configs.CULQI_PUBLIC_KEY || ''}
          settings={culqiSettings || { currency: simulacro.moneda || 'PEN', amount: Math.round(displayTotal * 100) }}
          client={{ email: formData.correo }}
          options={{ lang: 'auto', installments: true, paymentMethods: { tarjeta: true, yape: true, billetera: true, bancaMovil: true, agente: true, cuotealo: true } }}
          onLoad={() => setIsCulqiLoaded(true)}
          onTokenReceived={handleCulqiToken}
          onError={(err: string) => setPaymentError(err)}
        />

        <Stack spacing={4}>
          <Box>
            <Typography variant='h5' sx={{ fontWeight: 800, mb: 0.5 }}>
              Información de <span style={{ color: 'var(--mui-palette-primary-main)' }}>Pago</span>
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {isGuest ? 'Identifícate para finalizar la compra.' : 'Verifica tus datos y completa el pago.'}
            </Typography>
          </Box>

          {paymentError && (
            <Alert severity='error' onClose={() => setPaymentError(null)} sx={{ borderRadius: '12px' }}>{paymentError}</Alert>
          )}

          {/* Datos del estudiante */}
          <Box>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-user' style={{ fontSize: 15, color: 'var(--mui-palette-primary-main)' }} />
              </Box>
              <Typography variant='subtitle1' fontWeight={700}>Datos del Estudiante</Typography>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Nombres' value={formData.nombres} onChange={e => setFormData(p => ({ ...p, nombres: e.target.value }))} disabled={!isGuest} size='small' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label='Apellidos' value={formData.apellidos} onChange={e => setFormData(p => ({ ...p, apellidos: e.target.value }))} disabled={!isGuest} size='small' />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label='Correo' value={formData.correo} onChange={e => setFormData(p => ({ ...p, correo: e.target.value }))} disabled={!isGuest} size='small'
                  InputProps={{ startAdornment: <InputAdornment position='start'><i className='tabler-mail' style={{ fontSize: 16 }} /></InputAdornment> }} />
              </Grid>
            </Grid>
          </Box>

          {/* Comprobante */}
          {configs.PEDIDOS_SOLICITAR_COMPROBANTE !== 'false' && (
            <Box>
              <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className='tabler-file-invoice' style={{ fontSize: 15, color: 'var(--mui-palette-primary-main)' }} />
                </Box>
                <Typography variant='subtitle1' fontWeight={700}>Datos de Facturación (Opcional)</Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField select fullWidth size='small' label='Tipo' value={tipoComprobante} onChange={e => setTipoComprobante(e.target.value as any)} SelectProps={{ native: true }}>
                    <option value='TICKET'>Ticket</option>
                    <option value='BOLETA'>Boleta</option>
                    <option value='FACTURA'>Factura</option>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField fullWidth size='small' label={tipoComprobante === 'FACTURA' ? 'RUC' : 'DNI/RUC'} value={numeroComprobante}
                    onChange={e => setNumeroComprobante(e.target.value.replace(/\D/g, '').substring(0, 11))}
                    error={!!comprobanteError} helperText={comprobanteError} />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Método de pago */}
          <Box>
            <Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-credit-card' style={{ fontSize: 15, color: 'var(--mui-palette-primary-main)' }} />
              </Box>
              <Typography variant='subtitle1' fontWeight={700}>Método de Pago</Typography>
            </Stack>

            <Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap sx={{ mb: 3 }}>
              {isCulqiEnabled && <MethodTab icon='tabler-credit-card' label='Culqi' selected={paymentMethod === 'culqi'} onClick={() => setPaymentMethod('culqi')} />}
              {isIzipayEnabled && <MethodTab icon='tabler-building-bank' label='Izipay' selected={paymentMethod === 'izipay'} onClick={() => setPaymentMethod('izipay')} />}
              {isMercadoPagoEnabled && <MethodTab icon='tabler-shopping-cart' label='Mercado Pago' selected={paymentMethod === 'mercadopago'} onClick={() => setPaymentMethod('mercadopago')} color='#009ee3' />}
              {isManualEnabled && metodosManual.length > 0 && <MethodTab icon='tabler-device-mobile-message' label='Yape / Trans.' selected={paymentMethod === 'manual'} onClick={() => setPaymentMethod('manual')} color='#6c3483' />}
            </Stack>

            {/* Culqi */}
            {paymentMethod === 'culqi' && isCulqiEnabled && (
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                <SecureBadge provider='Culqi' />
                <TermsCheck checked={acceptedTerms} onChange={setAcceptedTerms} />
                <Button variant='contained' fullWidth size='large' onClick={handleCulqiCheckout}
                  disabled={isLoading || !isCulqiLoaded || (!acceptedTerms && !isGuest)}
                  startIcon={isLoading || !isCulqiLoaded ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-lock' />}
                  sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none' }}>
                  {isLoading ? 'Procesando...' : !isCulqiLoaded ? 'Cargando...' : isGuest ? 'Identificarse para Comprar' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)}`}
                </Button>
              </Box>
            )}

            {/* Izipay */}
            {paymentMethod === 'izipay' && isIzipayEnabled && (
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                <SecureBadge provider='Izipay' />
                <TermsCheck checked={acceptedTerms} onChange={setAcceptedTerms} />
                <Button variant='contained' fullWidth size='large' onClick={handleIzipayCheckout}
                  disabled={isLoading || (!acceptedTerms && !isGuest)}
                  startIcon={isLoading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-lock' />}
                  sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none' }}>
                  {isLoading ? 'Preparando...' : isGuest ? 'Identificarse para Comprar' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)}`}
                </Button>
              </Box>
            )}

            {/* MercadoPago */}
            {paymentMethod === 'mercadopago' && isMercadoPagoEnabled && (
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'grey.50' }}>
                <SecureBadge provider='Mercado Pago' />
                <TermsCheck checked={acceptedTerms} onChange={setAcceptedTerms} />
                <Button variant='contained' fullWidth size='large' onClick={handleMercadoPagoCheckout}
                  disabled={isLoading || !acceptedTerms}
                  startIcon={isLoading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-shopping-cart' />}
                  sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: '#009ee3', '&:hover': { bgcolor: '#0087c2' } }}>
                  {isLoading ? 'Redirigiendo...' : `Pagar ${currencySymbol} ${displayTotal.toFixed(2)} con Mercado Pago`}
                </Button>
              </Box>
            )}

            {/* Manual */}
            {paymentMethod === 'manual' && isManualEnabled && (
              <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                {isGuest ? (
                  <Box sx={{ p: 3 }}>
                    <Button variant='contained' fullWidth size='large' onClick={() => openLogin()} sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, textTransform: 'none' }}>
                      Identificarse para Comprar
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={0} divider={<Divider />}>
                    {/* Step 1 */}
                    <Box sx={{ p: 3 }}>
                      <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant='caption' color='white' fontWeight={800} lineHeight={1}>1</Typography>
                        </Box>
                        <Typography variant='subtitle2' fontWeight={700}>Elige cómo pagar</Typography>
                      </Stack>
                      <Stack spacing={1.5}>
                        {metodosManual.map(m => {
                          const sel = selectedMetodoManualId === m.id

                          return (
                            <Box key={m.id} onClick={() => setSelectedMetodoManualId(m.id)} sx={{
                              border: '2px solid', borderColor: sel ? 'primary.main' : 'divider',
                              borderRadius: 2.5, cursor: 'pointer', transition: 'all 0.2s',
                              bgcolor: sel ? 'primary.50' : 'white', '&:hover': { borderColor: 'primary.main' }
                            }}>
                              <Stack direction='row' alignItems='center' spacing={2} sx={{ p: 1.75 }}>
                                {m.imagen_url ? (
                                  <Avatar src={m.imagen_url} variant='rounded' sx={{ width: 44, height: 44, borderRadius: 1.5 }} />
                                ) : (
                                  <Avatar variant='rounded' sx={{ width: 44, height: 44, bgcolor: 'primary.100' }}>
                                    <i className='tabler-cash' style={{ fontSize: 20, color: 'var(--mui-palette-primary-main)' }} />
                                  </Avatar>
                                )}
                                <Box flex={1} minWidth={0}>
                                  <Typography variant='body2' fontWeight={700} noWrap>{m.nombre_banco || m.nombre}</Typography>
                                  <Typography variant='caption' color='text.secondary' noWrap>{m.numero_cuenta}</Typography>
                                </Box>
                                <Box sx={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: '2px solid', borderColor: sel ? 'primary.main' : 'divider', bgcolor: sel ? 'primary.main' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                                  {sel && <i className='tabler-check' style={{ fontSize: 11, color: 'white' }} />}
                                </Box>
                              </Stack>
                            </Box>
                          )
                        })}
                      </Stack>
                    </Box>

                    {/* Step 2 */}
                    {selectedMetodo && (
                      <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                        <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant='caption' color='white' fontWeight={800} lineHeight={1}>2</Typography>
                          </Box>
                          <Typography variant='subtitle2' fontWeight={700}>Realiza el pago</Typography>
                        </Stack>
                        <Box sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                          {selectedMetodo.imagen_url && (
                            <Box sx={{ textAlign: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                              <Box component='img' src={selectedMetodo.imagen_url} alt={selectedMetodo.nombre} sx={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain', borderRadius: 1 }} />
                            </Box>
                          )}
                          <Box sx={{ px: 2.5, py: 1.5 }}>
                            {selectedMetodo.nombre_banco && <CopyRow label='Banco/Billetera' value={selectedMetodo.nombre_banco} onCopy={() => copyToClipboard(selectedMetodo.nombre_banco!)} />}
                            <CopyRow label='N° Cuenta/Yape' value={selectedMetodo.numero_cuenta} onCopy={() => copyToClipboard(selectedMetodo.numero_cuenta)} />
                            {selectedMetodo.cci && <CopyRow label='CCI' value={selectedMetodo.cci} onCopy={() => copyToClipboard(selectedMetodo.cci!)} />}
                          </Box>
                        </Box>
                        {selectedMetodo.descripcion && <Alert severity='info' sx={{ mt: 2, borderRadius: 2, fontSize: 12 }}>{selectedMetodo.descripcion}</Alert>}
                      </Box>
                    )}

                    {/* Step 3 */}
                    <Box sx={{ p: 3 }}>
                      <Stack direction='row' alignItems='center' spacing={1.5} sx={{ mb: 2 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant='caption' color='white' fontWeight={800} lineHeight={1}>3</Typography>
                        </Box>
                        <Typography variant='subtitle2' fontWeight={700}>Sube tu comprobante</Typography>
                      </Stack>
                      <input ref={fileInputRef} type='file' accept='image/jpeg,image/png,image/webp' style={{ display: 'none' }}
                        onChange={e => {
                          const f = e.target.files?.[0]

                          if (f) {
                            setVoucher(f)
                            setVoucherPreview(URL.createObjectURL(f))
                          }
                        }} />
                      {voucherPreview ? (
                        <Box sx={{ position: 'relative' }}>
                          <Box component='img' src={voucherPreview} alt='Comprobante' sx={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 2, border: '2px solid', borderColor: 'success.main', display: 'block' }} />
                          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                            <IconButton size='small' onClick={() => { setVoucher(null); setVoucherPreview(null) }} sx={{ bgcolor: 'error.main', color: 'white', width: 28, height: 28 }}>
                              <i className='tabler-x' style={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2.5, p: 4, textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' } }}
                          onClick={() => fileInputRef.current?.click()}>
                          <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
                            <i className='tabler-cloud-upload' style={{ fontSize: 28, color: '#9e9e9e' }} />
                          </Box>
                          <Typography variant='body2' fontWeight={600} color='text.secondary'>Haz clic para subir tu comprobante</Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ p: 3, bgcolor: voucher ? 'primary.50' : 'grey.50' }}>
                      <Button variant='contained' fullWidth size='large' onClick={handleManualCheckout}
                        disabled={isLoading || !voucher}
                        startIcon={isLoading ? <CircularProgress size={18} color='inherit' /> : <i className='tabler-send' />}
                        sx={{ py: 1.75, borderRadius: 2.5, fontWeight: 800, fontSize: '1rem', textTransform: 'none' }}>
                        {isLoading ? 'Confirmando...' : 'Confirmar Pedido'}
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>

      {/* Modal confirmación manual */}
      <AppModal open={confirmModalOpen} handleClose={() => { setConfirmModalOpen(false); router.push('/simulacros') }}
        sx={{ p: 0, maxWidth: 680, width: 'calc(100% - 24px)', mx: 'auto', overflow: 'hidden' }}>
        <Box sx={{ bgcolor: 'success.main', px: 4, pt: 4, pb: 3, textAlign: 'center' }}>
          <Box sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, border: '3px solid rgba(255,255,255,0.35)' }}>
            <i className='tabler-circle-check' style={{ fontSize: 44, color: 'white' }} />
          </Box>
          <Typography variant='h4' fontWeight={900} color='white'>¡Pedido Registrado!</Typography>
          {confirmedOrder && (
            <Box sx={{ mt: 1, display: 'inline-flex', alignItems: 'center', gap: 0.75, bgcolor: 'rgba(255,255,255,0.18)', borderRadius: 6, px: 2.5, py: 0.75 }}>
              <Typography variant='body1' color='white' fontWeight={700} letterSpacing={1}>#{String(confirmedOrder.numeroPedido).padStart(6, '0')}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ pt: 3, pb: 3, px: 3 }}>
          <Alert severity='info' icon={<i className='tabler-clock' style={{ fontSize: 18 }} />} sx={{ mb: 2.5, borderRadius: 2 }}>
            Tu pedido está en revisión. El acceso al simulacro se activa al verificar el pago.
          </Alert>
          <Stack spacing={1.5}>
            {whatsappUrl && (
              <Button fullWidth variant='contained' size='large'
                sx={{ bgcolor: '#25D366', '&:hover': { bgcolor: '#1ebe5d' }, borderRadius: 2.5, fontWeight: 800, py: 1.5 }}
                startIcon={<i className='tabler-brand-whatsapp' style={{ fontSize: 22 }} />}
                onClick={() => window.open(whatsappUrl, '_blank')}>
                Enviar comprobante por WhatsApp
              </Button>
            )}
            <Button fullWidth variant='outlined' size='large' startIcon={<i className='tabler-clipboard-list' />}
              onClick={() => { setConfirmModalOpen(false); router.push('/simulacros') }}
              sx={{ borderRadius: 2.5, fontWeight: 700, py: 1.4 }}>
              Ver simulacros
            </Button>
          </Stack>
        </Box>
      </AppModal>
    </>
  )
}
