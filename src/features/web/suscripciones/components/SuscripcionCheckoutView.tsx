'use client'

import { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import Link from 'next/link'

import Script from 'next/script'

import { Container, Box, Typography, Grid, Checkbox, FormControlLabel } from '@mui/material'
import { ChevronRight, Repeat2, Check, ShieldCheck, RefreshCw, CreditCard, Loader2, BookOpen, Lock, ArrowLeft } from 'lucide-react'

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
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  const precio = Number(plan.precio)
  const monedaSimbolo = plan.moneda === 'PEN' ? 'S/' : '$'
  const amount = Math.round(precio * 100)
  const email = session?.user?.email ?? ''

  const beneficios: string[] = Array.isArray(plan.beneficios) ? plan.beneficios : []
  const tieneBeneficios = beneficios.length > 0

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

    if (!aceptaTerminos) {
      toast.warning('Debes aceptar los términos y condiciones para continuar.')

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
        try { window.Culqi.close() } catch { }
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

          {/* Formulario de pago */}
          <Grid item xs={12} lg={8} sx={{ order: { xs: 2, lg: 1 } }}>
            <Box sx={{
              borderRadius: '24px', bgcolor: '#fff',
              border: '1px solid #e2e8f0', p: { xs: 3, md: 5 },
              boxShadow: '0 10px 30px -10px rgba(2, 94, 68, 0.05), 0 1px 3px rgba(0,0,0,0.02)'
            }}>
              
              {/* Encabezado de sección */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3.5 }}>
                <Box sx={{
                  width: 38, height: 38, borderRadius: '12px',
                  bgcolor: 'rgba(37,146,127,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Lock size={18} color="var(--web-primary,#25927F)" />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                    Datos de pago
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#94a3b8' }}>
                    Transacción encriptada y segura con Culqi
                  </Typography>
                </Box>
              </Box>

              {session?.user && (
                <Box sx={{
                  mb: 3.5, p: 2.5, borderRadius: '16px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  border: '1px solid #e2e8f0',
                  display: 'flex', alignItems: 'center', gap: 2
                }}>
                  <Box sx={{
                    width: 44, height: 44, borderRadius: '50%',
                    bgcolor: 'var(--web-primary,#25927F)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(37,146,127,0.2)'
                  }}>
                    {((session.user as any)?.nombre?.[0] || session.user.name?.[0] || 'U').toUpperCase()}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 700, color: 'var(--web-primary,#25927F)', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.25 }}>
                      Suscripción para
                    </Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {(session.user as any)?.nombre
                        ? `${(session.user as any).nombre} ${(session.user as any).apellido || ''}`.trim()
                        : session.user.name}
                    </Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {session.user.email}
                    </Typography>
                  </Box>
                </Box>
              )}

              {error && (
                <Box sx={{ mb: 3.5, p: 2, borderRadius: '12px', bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#dc2626', fontWeight: 500 }}>
                    {error}
                  </Typography>
                </Box>
              )}

              <Box sx={{
                mb: 3.5, p: 2.5, borderRadius: '16px',
                bgcolor: 'rgba(37,146,127,0.03)', border: '1px dashed rgba(37,146,127,0.2)'
              }}>
                <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.6 }}>
                  Al hacer click en <strong>Activar suscripción</strong> se abrirá la ventana segura de Culqi para ingresar los datos de tu tarjeta.
                  {plan.dias_prueba > 0 ? (
                    <> Los primeros <strong>{plan.dias_prueba} días son gratis</strong>, luego se cobrará automáticamente cada <strong>{INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}</strong>.</>
                  ) : (
                    <> El primer cobro se realizará hoy y luego de forma automática cada <strong>{INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}</strong>.</>
                  )}
                </Typography>
              </Box>

              {/* Checkbox de términos y condiciones */}
              <Box sx={{ mb: 3.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      sx={{
                        color: '#cbd5e1',
                        '&.Mui-checked': { color: 'var(--web-primary,#25927F)' },
                        p: 0.75
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5 }}>
                      Acepto los{' '}
                      <Link
                        href="/terminos-y-condiciones"
                        target="_blank"
                        style={{
                          color: 'var(--web-primary,#25927F)',
                          fontWeight: 600,
                          textDecoration: 'underline',
                          textUnderlineOffset: '2px'
                        }}
                      >
                        Términos y Condiciones
                      </Link>
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', mx: 0 }}
                />
              </Box>

              <button
                onClick={handleSuscribirse}
                disabled={procesando}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.5rem',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: (!aceptaTerminos && session?.user) || procesando ? 'not-allowed' : 'pointer',
                  fontFamily: FONT,
                  fontSize: '1rem',
                  fontWeight: 700,
                  background: procesando
                    ? '#cbd5e1'
                    : 'linear-gradient(135deg, var(--web-primary,#25927F) 0%, var(--web-dark,#025E44) 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: procesando || (!aceptaTerminos && session?.user) ? 'none' : '0 4px 20px rgba(37,146,127,0.25)',
                  opacity: (!aceptaTerminos && session?.user && !procesando) ? 0.65 : 1
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
                <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center', mt: 2 }}>
                  Necesitas{' '}
                  <button onClick={() => openLogin()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--web-primary,#25927F)', fontWeight: 600, fontFamily: FONT, fontSize: '0.8125rem', padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px' }}>
                    iniciar sesión
                  </button>
                  {' '}para suscribirte.
                </Typography>
              )}

              {/* Badges de confianza */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mt: 4, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                {[
                  { icon: <ShieldCheck size={16} />, text: 'Pago seguro' },
                  { icon: <RefreshCw size={16} />, text: 'Cancela cuando quieras' },
                  { icon: <Lock size={16} />, text: 'Datos encriptados' },
                ].map((badge, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#94a3b8' }}>
                    {badge.icon}
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 600 }}>
                      {badge.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Enlace para volver */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link href="/suscripciones" style={{
                fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 600,
                color: '#64748b', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--web-primary,#25927F)'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              >
                <ArrowLeft size={14} />
                Volver a los planes
              </Link>
            </Box>
          </Grid>

          {/* Resumen del plan */}
          <Grid item xs={12} lg={4} sx={{ order: { xs: 1, lg: 2 } }}>
            <Box sx={{
              borderRadius: '24px', bgcolor: '#fff',
              border: '1px solid #e2e8f0', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
              position: { lg: 'sticky' }, top: { lg: 90 }
            }}>
              <Box sx={{
                p: 3.5, borderBottom: '1px solid #f1f5f9',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)'
              }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px', bgcolor: 'rgba(37,146,127,0.08)', borderRadius: '20px', px: 1.5, py: 0.5, mb: 1.5 }}>
                  <Repeat2 size={13} color="var(--web-primary,#25927F)" />
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.6875rem', fontWeight: 700, color: 'var(--web-primary,#25927F)', textTransform: 'uppercase' }}>
                    {INTERVALO_LABELS[plan.intervalo]}
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', mb: 0.5 }}>
                  {plan.nombre}
                </Typography>
                {plan.descripcion && (
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>
                    {plan.descripcion}
                  </Typography>
                )}
              </Box>

              <Box sx={{ p: 3.5, borderBottom: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>{monedaSimbolo}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                    {precio.toFixed(2)}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#94a3b8' }}>
                    /{INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}
                  </Typography>
                </Box>
                {plan.dias_prueba > 0 && (
                  <Box sx={{ mt: 1.5, display: 'inline-flex', alignItems: 'center', gap: '6px', bgcolor: '#f0fdf4', borderRadius: '20px', px: 1.5, py: 0.5, border: '1px solid #bbf7d0' }}>
                    <Check size={12} color="#16a34a" strokeWidth={3} />
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 700, color: '#16a34a' }}>
                      {plan.dias_prueba} días gratis incluidos
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 3.5 }}>
                {tieneBeneficios ? (
                  <>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
                      ¿Qué incluye?
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {beneficios.map((beneficio, i) => (
                        <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                          <Box sx={{
                            width: 18, height: 18, borderRadius: '50%',
                            bgcolor: 'rgba(37,146,127,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, mt: 0.15
                          }}>
                            <Check size={11} color="var(--web-primary,#25927F)" strokeWidth={3} />
                          </Box>
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#334155', lineHeight: 1.4 }}>
                            {beneficio}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    {plan.cursos.length > 0 && (
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        mt: 2.5, p: 1.5, borderRadius: '12px',
                        bgcolor: '#f8fafc', border: '1px solid #f1f5f9'
                      }}>
                        <BookOpen size={15} color="#64748b" />
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569', fontWeight: 600 }}>
                          {plan.cursos.length} curso{plan.cursos.length !== 1 ? 's' : ''} incluido{plan.cursos.length !== 1 ? 's' : ''}
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2 }}>
                      Incluye {plan.cursos.length} curso{plan.cursos.length !== 1 ? 's' : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      {plan.cursos.map(c => (
                        <Box key={c.curso_id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25 }}>
                          <Box sx={{
                            width: 18, height: 18, borderRadius: '50%',
                            bgcolor: 'rgba(37,146,127,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, mt: 0.15
                          }}>
                            <Check size={11} color="var(--web-primary,#25927F)" strokeWidth={3} />
                          </Box>
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#334155', lineHeight: 1.4 }}>
                            {c.curso.titulo}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Box>
  )
}
