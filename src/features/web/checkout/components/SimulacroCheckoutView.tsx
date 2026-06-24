'use client'

import Link from 'next/link'

import { Container, Grid, Box, Typography, Paper, Stack, Divider } from '@mui/material'
import { ChevronRight, ShoppingCart, ShieldCheck } from 'lucide-react'

import SimulacroPaymentForm from './SimulacroPaymentForm'

const FONT = 'Poppins, sans-serif'

interface SimulacroCheckoutViewProps {
  simulacro: {
    id: string
    titulo: string
    slug: string
    miniatura?: string | null
    precio: number
    moneda: string
    nivel?: string
  }
}

export default function SimulacroCheckoutView({ simulacro }: SimulacroCheckoutViewProps) {
  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: 'calc(100vh - 64px)', fontFamily: FONT }}>
      {/* Mini hero */}
      <Box sx={{ background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)', py: { xs: 4, md: 5 }, px: { xs: 3, md: 8, lg: 12 }, position: 'relative', overflow: 'hidden' }}>
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <Container maxWidth='lg' sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mb: 2 }}>
            {[{ label: 'Inicio', href: '/' }, { label: 'Simulacros', href: '/simulacros' }, { label: simulacro.titulo, href: `/simulacros/${simulacro.slug}` }].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Link href={item.href} style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{item.label}</Link>
                <ChevronRight size={12} color='rgba(255,255,255,0.3)' />
              </Box>
            ))}
            <span style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--web-light, #BDD962)' }}>Checkout</span>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: 'rgba(var(--web-light-rgb,189,217,98),0.15)', border: '1px solid rgba(var(--web-light-rgb,189,217,98),0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={22} color='var(--web-light, #BDD962)' />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: FONT, fontWeight: 900, fontSize: { xs: '1.5rem', md: '2rem' }, color: '#fff', lineHeight: 1.1 }}>Acceso al Simulacro</Typography>
              <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', mt: 0.25 }}>Adquiere acceso ilimitado y pon a prueba tus conocimientos.</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth='lg' sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Resumen */}
          <Grid item xs={12} lg={4} sx={{ order: { xs: 1, lg: 2 } }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: '24px', bgcolor: 'white', border: '1.5px solid hsl(214,20%,91%)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', position: 'sticky', top: 100 }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.25rem', mb: 3 }}>
                Resumen del <span style={{ color: 'var(--web-primary, #D4AF37)' }}>Pedido</span>
              </Typography>
              <Stack spacing={3}>
                <Stack direction='row' spacing={2} alignItems='center'>
                  {simulacro.miniatura ? (
                    <Box sx={{ width: 80, height: 50, borderRadius: '10px', overflow: 'hidden', flexShrink: 0, border: '1px solid', borderColor: 'divider' }}>
                      <Box component='img' src={simulacro.miniatura} alt={simulacro.titulo} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                  ) : (
                    <Box sx={{ width: 80, height: 50, borderRadius: '10px', flexShrink: 0, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className='tabler-clipboard-list' style={{ fontSize: 24, color: '#9e9e9e' }} />
                    </Box>
                  )}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.8125rem', mb: 0.25 }}>{simulacro.titulo}</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', color: '#64748b' }}>{simulacro.moneda} {Number(simulacro.precio).toFixed(2)}</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Stack spacing={1.5}>
                  <Stack direction='row' justifyContent='space-between'>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#64748b' }}>Precio</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', fontWeight: 600 }}>{simulacro.moneda} {Number(simulacro.precio).toFixed(2)}</Typography>
                  </Stack>
                </Stack>

                <Divider />

                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1rem' }}>Total</Typography>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '1.375rem', color: 'var(--web-primary, #D4AF37)' }}>
                    {simulacro.moneda} {Number(simulacro.precio).toFixed(2)}
                  </Typography>
                </Stack>

                <Box sx={{ p: 2, backgroundColor: 'rgba(212,175,55,0.07)', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <Stack direction='row' spacing={1.5} alignItems='center'>
                    <Box sx={{ flexShrink: 0, width: 32, height: 32, borderRadius: '50%', bgcolor: 'var(--web-primary, #D4AF37)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={16} color='#fff' />
                    </Box>
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.35 }}>
                      Compra segura · Acceso inmediato al simulacro.
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Formulario */}
          <Grid item xs={12} lg={8} sx={{ order: { xs: 2, lg: 1 } }}>
            <SimulacroPaymentForm simulacro={simulacro} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
