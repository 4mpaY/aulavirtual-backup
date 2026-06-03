'use client'

import { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import Link from 'next/link'

import Script from 'next/script'

import { Container, Box, Typography, Grid } from '@mui/material'
import { ChevronRight, Repeat2, Check, ShieldCheck, RefreshCw, CreditCard, Loader2 } from 'lucide-react'

import { useSession } from 'next-auth/react'

import { toast } from 'react-toastify'

import { useAuthModal } from '@/contexts/AuthModalContext'
import type { PlanPublico } from '@/features/estudiante/suscripciones/entity/Suscripcion'
import { INTERVALO_LABELS } from '@/features/estudiante/suscripciones/entity/Suscripcion'

const FONT = 'Poppins, sans-serif'

declare global {
  interface Window {
    CulqiCheckout: any
    Culqi: any
  }
}

interface SuscripcionCheckoutViewProps {
  plan: PlanPublico
  culqiPublicKey: string
}

export function SuscripcionCheckoutView({ plan, culqiPublicKey }: SuscripcionCheckoutViewProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()

  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)

  const precio = Number(plan.precio)
  const monedaSimbolo = plan.moneda === 'PEN' ? 'S/' : '$'
  const amount = Math.round(precio * 100)
  const email = session?.user?.email ?? ''

  const handleTokenReceived = useCallback(async (tokenId: string) => {
    setProcesando(true)
    setError(null)

    try {
      const res = await fetch('/api/estudiante/suscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, tokenId })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.result?.message ?? data?.message ?? 'Error al procesar la suscripción')
      }

      setExito(true)
      setTimeout(() => router.push('/estudiante/suscripcion'), 2000)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado')
      setProcesando(false)
    }
  }, [plan.id, router])

  const handleSuscribirse = () => {
    if (!session?.user) {
      openLogin()

      return
    }

    if (!window.CulqiCheckout) {
      toast.error('El sistema de pagos se está cargando. Espera un momento e intenta de nuevo.')

      return
    }

    setError(null)

    // Inicializar Culqi en el momento del click (garantiza timing correcto)
    try {
      if (window.Culqi) {
        try { window.Culqi.close() } catch {}
      }

      const config = {
        settings: {
          currency: plan.moneda,
          amount,
        },
        client: { email },
        options: {
          modal: true,
          lang: 'auto',
          installments: false,
          paymentMethods: {
            tarjeta: true,
            yape: false,
            billetera: false,
            bancaMovil: false,
            agente: false,
            cuotealo: false
          }
        }
      }

      const culqi = new window.CulqiCheckout(culqiPublicKey, config)

      culqi.culqi = () => {
        if (culqi.token) {
          handleTokenReceived(culqi.token.id)
        } else if (culqi.error) {
          const msg = culqi.error.user_message || culqi.error.merchant_message || 'Error al procesar el pago'

          setError(msg)
        }
      }

      window.Culqi = culqi
      window.Culqi.open()
    } catch (err: any) {
      toast.error('Error al abrir el sistema de pagos. Recarga la página e intenta de nuevo.')
    }
  }

  // Pantalla de éxito
  if (exito) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Box sx={{ textAlign: 'center', maxWidth: 440 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#f0fdf4', border: '2px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
            <Check size={36} color="#16a34a" strokeWidth={2.5} />
          </Box>
          <Typography sx={{ fontFamily: FONT, fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', mb: 1 }}>
            ¡Suscripción activada!
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontSize: '0.9375rem', color: '#64748b', mb: 2 }}>
            Ya tienes acceso a los cursos de <strong>{plan.nombre}</strong>. Redirigiendo a tu panel...
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#94a3b8' }}>
            <RefreshCw size={14} />
            <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem' }}>Redirigiendo...</Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)', fontFamily: FONT }}>

      {/* Cargar script de Culqi */}
      <Script src="https://js.culqi.com/checkout-js" strategy="afterInteractive" />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, var(--web-dark-deep,#012d22) 0%, var(--web-dark,#025E44) 45%, var(--web-dark-mid,#0f4438) 100%)',
        py: { xs: 4, md: 5 },
        px: { xs: 3, md: 8, lg: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {[{ label: 'Inicio', href: '/' }, { label: 'Suscripciones', href: '/suscripciones' }].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Link href={item.href} style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
                  {item.label}
                </Link>
                <ChevronRight size={12} color="rgba(255,255,255,0.3)" />
              </Box>
            ))}
            <span style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--web-light,#BDD962)' }}>Checkout</span>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(189,217,98,0.15)', border: '1px solid rgba(189,217,98,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Repeat2 size={22} color="var(--web-light,#BDD962)" />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: FONT, fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#fff', lineHeight: 1.1 }}>
                Activar Suscripción
              </Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', mt: 0.25 }}>
                Accede a todos los cursos del plan. Cancela cuando quieras.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contenido */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>

          {/* Resumen del plan */}
          <Grid item xs={12} lg={4} sx={{ order: { xs: 1, lg: 2 } }}>
            <Box sx={{ borderRadius: '20px', bgcolor: '#fff', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#fafafa' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                  Resumen del plan
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                  {plan.nombre}
                </Typography>
                {plan.descripcion && (
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b', mt: 0.5 }}>
                    {plan.descripcion}
                  </Typography>
                )}
              </Box>

              <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>{monedaSimbolo}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {precio.toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#94a3b8' }}>
                    /{INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}
                  </Typography>
                </Box>
                {plan.dias_prueba > 0 && (
                  <Box sx={{ mt: 1, display: 'inline-flex', bgcolor: '#f0fdf4', borderRadius: '20px', px: 1.5, py: 0.5 }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
                      {plan.dias_prueba} días gratis incluidos
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                  Incluye {plan.cursos.length} curso{plan.cursos.length !== 1 ? 's' : ''}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {plan.cursos.map(c => (
                    <Box key={c.curso_id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Check size={15} color="#25927F" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#334155', lineHeight: 1.4 }}>
                        {c.curso.titulo}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#f8fafc' }}>
                <ShieldCheck size={18} color="#25927F" />
                <Typography sx={{ fontFamily: FONT, fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
                  Pago seguro. Cancela en cualquier momento.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Formulario de pago */}
          <Grid item xs={12} lg={8} sx={{ order: { xs: 2, lg: 1 } }}>
            <Box sx={{ borderRadius: '20px', bgcolor: '#fff', border: '1px solid #e2e8f0', p: { xs: 3, md: 4 }, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <Typography sx={{ fontFamily: FONT, fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', mb: 3 }}>
                Datos de pago
              </Typography>

              {session?.user && (
                <Box sx={{ mb: 3, p: 2, borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 600, color: '#64748b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Suscripción para
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' }}>
                    {(session.user as any)?.nombre
                      ? `${(session.user as any).nombre} ${(session.user as any).apellido || ''}`.trim()
                      : session.user.name}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b' }}>
                    {session.user.email}
                  </Typography>
                </Box>
              )}

              {error && (
                <Box sx={{ mb: 3, p: 2, borderRadius: '12px', bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#dc2626', fontWeight: 500 }}>
                    {error}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mb: 3, p: 2.5, borderRadius: '12px', border: '1px dashed #cbd5e1', bgcolor: '#fafafa' }}>
                <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
                  Al hacer click en <strong>Activar suscripción</strong> se abrirá la ventana segura de Culqi para ingresar los datos de tu tarjeta.
                  El primer cobro se realizará hoy y luego de forma automática cada <strong>{INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}</strong>.
                </Typography>
              </Box>

              <button
                onClick={handleSuscribirse}
                disabled={procesando}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                  border: 'none',
                  cursor: procesando ? 'not-allowed' : 'pointer',
                  fontFamily: FONT,
                  fontSize: '1rem',
                  fontWeight: 700,
                  backgroundColor: procesando ? '#94a3b8' : 'var(--web-primary,#25927F)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'background-color 0.2s',
                  marginBottom: '1rem'
                }}
              >
                {procesando ? (
                  <>
                    <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Activar suscripción · {monedaSimbolo} {precio.toFixed(2)}/{INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}
                  </>
                )}
              </button>

              {!session?.user && (
                <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center' }}>
                  Necesitas{' '}
                  <button onClick={() => openLogin()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--web-primary,#25927F)', fontWeight: 600, fontFamily: FONT, fontSize: '0.8125rem', padding: 0 }}>
                    iniciar sesión
                  </button>
                  {' '}para suscribirte.
                </Typography>
              )}

              <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', mt: 1.5 }}>
                Al suscribirte aceptas los términos y condiciones. Puedes cancelar desde tu perfil cuando quieras.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Box>
  )
}
