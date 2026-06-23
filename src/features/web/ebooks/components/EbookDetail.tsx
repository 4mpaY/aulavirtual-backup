'use client'

import { useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { CheckCircle, ChevronRight, XCircle } from 'lucide-react'

import { useSession } from 'next-auth/react'
import axios from 'axios'
import Swal from 'sweetalert2'

import { useAuthModal } from '@/contexts/AuthModalContext'

const FONT = "'Inter', 'Helvetica Neue', Arial, sans-serif"

interface EbookDetailProps {
  ebook: {
    id: string
    titulo: string
    slug: string
    descripcion?: string | null
    autor?: string | null
    miniatura?: string | null
    precio: number
    precio_falso: number
    moneda: string
    es_gratis: boolean
    paginas?: number | null
    genero?: string | null
    categoria?: { nombre: string } | null
    _count?: { accesos: number }
    tieneAcceso: boolean
  }
}

const defaultIncluye = [
  { text: 'Acceso permanente', active: true },
  { text: 'Formato PDF de alta calidad', active: true },
  { text: 'Lectura en cualquier dispositivo', active: true },
  { text: 'Sin fecha de expiración', active: true },
  { text: 'Certificado de lectura', active: false },
]

export default function EbookDetail({ ebook }: EbookDetailProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { openLogin } = useAuthModal()
  const [obtaining, setObtaining] = useState(false)

  const precio = ebook.precio
  const precioFalso = ebook.precio_falso

  const handleObtenerGratis = async () => {
    if (!session) {
      openLogin(undefined, handleObtenerGratis)

      return
    }

    setObtaining(true)

    try {
      await axios.post(`/api/ebooks/${ebook.id}/acceso`)
      router.push(`/estudiante/mis-ebooks/${ebook.id}`)
      router.refresh()
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err?.response?.data?.error ?? 'No se pudo obtener el ebook', icon: 'error' })
    } finally {
      setObtaining(false)
    }
  }

  const handleComprar = () => {
    const goToCheckout = () => router.push(`/checkout/ebook/${ebook.id}`)

    if (!session) {
      openLogin(undefined, goToCheckout)

      return
    }

    goToCheckout()
  }

  const beneficios = [
    ...(ebook.paginas ? [{ title: `${ebook.paginas} páginas`, desc: 'Contenido completo y detallado.', icon: 'tabler-file-text' }] : []),
    { title: 'Formato PDF', desc: 'Compatible con cualquier lector.', icon: 'tabler-file-type-pdf' },
    { title: 'Acceso permanente', desc: 'Disponible en tu biblioteca 24/7.', icon: 'tabler-infinity' },
    ...(ebook._count?.accesos
      ? [{ title: `${ebook._count.accesos} lectores`, desc: 'Ya lo están leyendo.', icon: 'tabler-users' }]
      : [{ title: 'Lectura en línea', desc: 'Lee desde cualquier dispositivo sin descargar nada.', icon: 'tabler-device-laptop' }]),
  ]

  const renderCTA = (size: 'small' | 'large' = 'large') => {
    const py = size === 'large' ? 2 : 1.5
    const fontSize = size === 'large' ? '1.2rem' : undefined

    if (ebook.tieneAcceso) {
      return (
        <Button variant='contained' color='success' fullWidth size='large' component={Link}
          href={`/estudiante/mis-ebooks/${ebook.id}`}
          startIcon={<i className='tabler-book-open' />}
          sx={{ py, borderRadius: '16px', fontWeight: 700, fontSize, textTransform: 'none', boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
        >
          Leer Ebook
        </Button>
      )
    }

    if (ebook.es_gratis) {
      return (
        <Button variant='contained' color='primary' fullWidth size='large'
          onClick={handleObtenerGratis} disabled={obtaining}
          sx={{ py, borderRadius: '16px', fontWeight: 700, fontSize, textTransform: 'none' }}
        >
          {obtaining ? <CircularProgress size={24} color='inherit' /> : 'Obtener gratis'}
        </Button>
      )
    }

    return (
      <Button variant='contained' color='primary' fullWidth size='large'
        onClick={handleComprar}
        sx={{ py, borderRadius: '16px', fontWeight: 700, fontSize, textTransform: 'none' }}
      >
        ¡Lo quiero!
      </Button>
    )
  }

  return (
    <Box sx={{ pb: 10, bgcolor: '#f8fafc' }}>

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <Box sx={{
        position: 'relative',
        background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)',
        pt: { xs: 4, md: 6 },
        pb: { xs: 8, md: 14 },
        minHeight: { md: '600px' },
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fondo difuminado */}
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: ebook.miniatura ? `url(${ebook.miniatura})` : 'none', backgroundColor: 'var(--web-dark-deep, #012d22)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(60px)', opacity: 0.25, transform: 'scale(1.2)', zIndex: 0 }} />
        <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 100%)' }} />

        <Container maxWidth={false} sx={{ px: { xs: 3, md: 8, lg: 12 }, position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Ebooks', href: '/ebooks' },
              ...(ebook.categoria ? [{ label: ebook.categoria.nombre, href: null }] : []),
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {item.href
                  ? <Link href={item.href} style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>{item.label}</Link>
                  : <span style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>}
                <ChevronRight size={12} color='rgba(255,255,255,0.3)' />
              </Box>
            ))}
            <span style={{ fontFamily: FONT, fontSize: '0.8125rem', fontWeight: 700, color: 'var(--web-light, #BDD962)' }}>{ebook.titulo}</span>
          </Box>

          {/* 50 / 50 — igual que CourseDetail */}
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems='center'>

            {/* Portada */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: '100%', maxWidth: 300 }}>
                <Box sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)', aspectRatio: '2/3', position: 'relative', bgcolor: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {ebook.miniatura ? (
                    <Box component='img' src={ebook.miniatura} alt={ebook.titulo}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.3)' }}>
                      <i className='tabler-book' style={{ fontSize: '5rem' }} />
                      <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)' }}>Sin portada</Typography>
                    </Box>
                  )}
                </Box>
                {(ebook.es_gratis || ebook.tieneAcceso) && (
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    {ebook.tieneAcceso
                      ? <Chip icon={<i className='tabler-circle-check-filled' style={{ fontSize: '1rem', color: '#0A0A0A' }} />} label='Tu Ebook' sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '0.7rem', bgcolor: 'var(--web-light, #BDD962)', color: '#0A0A0A' }} />
                      : <Chip label='GRATUITO' sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '0.7rem', bgcolor: 'var(--web-light, #BDD962)', color: '#0A0A0A' }} />}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Info */}
            <Grid item xs={12} md={6}>
              <Stack spacing={2.5}>
                {/* Chips */}
                <Stack direction='row' spacing={1} flexWrap='wrap' gap={1}>
                  {ebook.tieneAcceso ? (
                    <Chip icon={<i className='tabler-circle-check-filled' style={{ fontSize: '1rem', color: '#0A0A0A' }} />}
                      label='Tu Ebook'
                      sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '0.75rem', bgcolor: 'var(--web-light, #BDD962)', color: '#0A0A0A', borderRadius: '8px' }} />
                  ) : ebook.genero ? (
                    <Chip label={ebook.genero}
                      sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.75rem', bgcolor: 'rgba(var(--web-light-rgb, 189,217,98),0.15)', color: 'var(--web-light, #BDD962)', borderRadius: '8px', border: '1px solid rgba(var(--web-light-rgb,189,217,98),0.3)' }} />
                  ) : null}
                  {ebook.paginas && (
                    <Chip label={`${ebook.paginas} páginas`}
                      sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.75rem', bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }} />
                  )}
                  <Chip label='PDF'
                    sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.75rem', bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)' }} />
                </Stack>

                {/* Título */}
                <Typography sx={{ fontFamily: FONT, fontWeight: 900, fontSize: { xs: '2rem', md: '2.75rem' }, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {ebook.titulo}
                </Typography>

                {/* Autor */}
                {ebook.autor && (
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction='row' spacing={1.5} alignItems='center'>
                        <Avatar sx={{ bgcolor: 'rgba(var(--web-light-rgb,189,217,98),0.2)', color: 'var(--web-light, #BDD962)', width: 44, height: 44, border: '2px solid rgba(var(--web-light-rgb, 189,217,98),0.4)' }}>
                          <i className='tabler-user' style={{ fontSize: '1.25rem' }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>Autor</Typography>
                          <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '0.9375rem', color: 'var(--web-light, #BDD962)' }}>
                            {ebook.autor}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    {ebook._count?.accesos ? (
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '12px', p: 1.5, border: '1px solid rgba(255,255,255,0.08)' }}>
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lectores</Typography>
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.9rem', color: '#fff', fontWeight: 700, mt: 0.25 }}>{ebook._count.accesos}</Typography>
                        </Box>
                      </Grid>
                    ) : null}
                  </Grid>
                )}

                {/* Precio */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 900, fontSize: { xs: '2.5rem', md: '3rem' }, color: 'var(--web-light, #BDD962)', lineHeight: 1 }}>
                    {ebook.tieneAcceso ? 'Adquirido' : ebook.es_gratis ? 'Gratis' : `${ebook.moneda} ${precio.toFixed(2)}`}
                  </Typography>
                  {!ebook.es_gratis && !ebook.tieneAcceso && precioFalso > 0 && (
                    <Typography sx={{ fontFamily: FONT, fontSize: '1rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>
                      {ebook.moneda} {precioFalso.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                {/* CTA hero */}
                {renderCTA('large')}
              </Stack>
            </Grid>
          </Grid>

          {/* Benefit cards */}
          <Grid container spacing={2} sx={{ mt: 6 }}>
            {beneficios.map((item, i) => (
              <Grid item xs={6} sm={6} md={3} key={i}>
                <Box sx={{ p: { xs: 2, md: 2.5 }, borderRadius: '16px', textAlign: 'center', bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', '&:hover': { bgcolor: 'rgba(255,255,255,0.09)' } }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(var(--web-light-rgb,189,217,98),0.12)', color: 'var(--web-light, #BDD962)', mx: 'auto', mb: 1.5 }}>
                    <i className={item.icon} style={{ fontSize: '1.375rem' }} />
                  </Box>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: { xs: '0.8rem', md: '0.9rem' }, color: '#fff', lineHeight: 1.3, mb: 0.5 }}>{item.title}</Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: { xs: '0.7rem', md: '0.8125rem' }, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>{item.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── CONTENIDO ────────────────────────────────────────────────────── */}
      <Container maxWidth={false} sx={{ mt: 6, px: { xs: 3, md: 8, lg: 12 } }}>
        <Grid container spacing={4}>

          {/* Columna principal */}
          <Grid item xs={12} md={8}>
            <Stack spacing={5}>

              {/* Reseña */}
              {ebook.descripcion && (
                <Box>
                  <SectionTitle>Acerca del ebook</SectionTitle>
                  <Typography sx={{ fontFamily: FONT, fontSize: '1rem', color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                    {ebook.descripcion}
                  </Typography>
                </Box>
              )}

              {/* Qué obtienes */}
              <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: { xs: 3, md: 5 }, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <Typography sx={{ fontFamily: FONT, fontWeight: 900, fontSize: '1.5rem', color: '#0A0A0A', textAlign: 'center', mb: 0.5 }}>
                  ¿Qué obtienes con este ebook?
                </Typography>
                <Typography sx={{ fontFamily: FONT, fontSize: '0.9375rem', color: '#64748b', textAlign: 'center', mb: 4 }}>
                  Todo lo que necesitas para aprender a tu ritmo
                </Typography>
                <Grid container spacing={2}>
                  {[
                    { icon: 'tabler-device-laptop', title: 'Multiplataforma', desc: 'Lee en PC, tablet o móvil.' },
                    { icon: 'tabler-clock', title: 'A tu ritmo', desc: 'Sin fechas límite ni horarios.' },
                    { icon: 'tabler-lock-open', title: 'Acceso de por vida', desc: 'Sin caducidad de ningún tipo.' },
                    { icon: 'tabler-infinity', title: 'Sin expiración', desc: 'Tu acceso no caduca nunca.' },
                  ].map((m, i) => (
                    <Grid item xs={12} md={6} key={i}>
                      <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'rgba(var(--web-primary-rgb,37,146,127),0.1)', color: 'var(--web-primary, #25927F)', width: 48, height: 48, flexShrink: 0 }}>
                          <i className={m.icon} style={{ fontSize: '1.5rem' }} />
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: '0.9375rem', mb: 0.25 }}>{m.title}</Typography>
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#64748b' }}>{m.desc}</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Detalles */}
              <Box>
                <SectionTitle>Detalles del ebook</SectionTitle>
                <Paper sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
                  {[
                    ...(ebook.autor ? [{ label: 'Autor', value: ebook.autor, icon: 'tabler-user' }] : []),
                    ...(ebook.paginas ? [{ label: 'Páginas', value: `${ebook.paginas} páginas`, icon: 'tabler-file-text' }] : []),
                    { label: 'Formato', value: 'PDF', icon: 'tabler-file-type-pdf' },
                    ...(ebook.genero ? [{ label: 'Género', value: ebook.genero, icon: 'tabler-tag' }] : []),
                    ...(ebook.categoria ? [{ label: 'Categoría', value: ebook.categoria.nombre, icon: 'tabler-category' }] : []),
                    { label: 'Idioma', value: 'Español', icon: 'tabler-language' },
                  ].map((row, i, arr) => (
                    <Box key={i}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 3, py: 2, bgcolor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <Avatar sx={{ bgcolor: 'rgba(var(--web-primary-rgb,37,146,127),0.08)', color: 'var(--web-primary, #25927F)', width: 36, height: 36 }}>
                          <i className={row.icon} style={{ fontSize: '1rem' }} />
                        </Avatar>
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#64748b', fontWeight: 500, minWidth: 100 }}>{row.label}</Typography>
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: '#1e293b', fontWeight: 700 }}>{row.value}</Typography>
                      </Box>
                      {i < arr.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Paper>
              </Box>

            </Stack>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
              <Paper sx={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
                <Box sx={{ background: 'linear-gradient(135deg, var(--web-dark, #025E44), var(--web-primary, #25927F))', p: 3, textAlign: 'center' }}>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 800, fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', mb: 0.5 }}>
                    Ebook {ebook.es_gratis ? 'Gratuito' : 'Premium'}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 900, fontSize: '2rem', color: 'var(--web-light, #BDD962)', lineHeight: 1 }}>
                    {ebook.tieneAcceso ? 'Adquirido' : ebook.es_gratis ? 'Gratis' : `${ebook.moneda} ${precio.toFixed(2)}`}
                  </Typography>
                  {!ebook.es_gratis && !ebook.tieneAcceso && precioFalso > 0 && (
                    <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through', mt: 0.5 }}>
                      {ebook.moneda} {precioFalso.toFixed(2)}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ p: 3 }}>
                  <Stack spacing={1.25} sx={{ mb: 3 }}>
                    {defaultIncluye.map((item, i) => (
                      <Stack key={i} direction='row' spacing={1.25} alignItems='center'>
                        {item.active
                          ? <CheckCircle size={18} color='var(--web-primary, #25927F)' />
                          : <XCircle size={18} color='#cbd5e1' />}
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', color: item.active ? '#1e293b' : '#94a3b8', fontWeight: item.active ? 600 : 400 }}>
                          {item.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  {renderCTA('small')}

                  <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #f1f5f9' }}>
                    <Stack spacing={1.5}>
                      {ebook.paginas && (
                        <Stack direction='row' spacing={1.5} alignItems='center'>
                          <i className='tabler-file-text' style={{ fontSize: '1.1rem', color: 'var(--web-primary, #25927F)' }} />
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569' }}><strong>{ebook.paginas}</strong> páginas</Typography>
                        </Stack>
                      )}
                      {ebook.autor && (
                        <Stack direction='row' spacing={1.5} alignItems='center'>
                          <i className='tabler-user' style={{ fontSize: '1.1rem', color: 'var(--web-primary, #25927F)' }} />
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569' }}>Por <strong>{ebook.autor}</strong></Typography>
                        </Stack>
                      )}
                      <Stack direction='row' spacing={1.5} alignItems='center'>
                        <i className='tabler-file-type-pdf' style={{ fontSize: '1.1rem', color: 'var(--web-primary, #25927F)' }} />
                        <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569' }}>Formato <strong>PDF</strong></Typography>
                      </Stack>
                      {ebook._count && ebook._count.accesos > 0 && (
                        <Stack direction='row' spacing={1.5} alignItems='center'>
                          <i className='tabler-users' style={{ fontSize: '1.1rem', color: 'var(--web-primary, #25927F)' }} />
                          <Typography sx={{ fontFamily: FONT, fontSize: '0.8125rem', color: '#475569' }}><strong>{ebook._count.accesos}</strong> lectores</Typography>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

function SectionTitle({ children, sx = {} }: { children: React.ReactNode; sx?: object }) {
  return (
    <Typography sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.375rem', color: '#0A0A0A', letterSpacing: '-0.01em', mb: 2.5, ...sx }}>
      {children}
    </Typography>
  )
}
