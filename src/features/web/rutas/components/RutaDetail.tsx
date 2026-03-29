'use client'

import Link from 'next/link'

import {
  Container,
  Grid,
  Typography,
  Box,
  Stack,
  Paper,
  Breadcrumbs,
  Avatar,
  Card,
  Chip,
  Button
} from '@mui/material'

import { styled } from '@mui/material/styles'

import CourseThumbnail from '@/utils/components/CourseThumbnail'

interface CursoEnRuta {
  id: string
  titulo: string
  slug: string
  miniatura?: string
  descripcion?: string
  orden: number
  precio: number
  precio_oferta?: number
  seccion_id?: string | null
}

interface RutaSeccion {
  id: string
  titulo: string
  descripcion?: string
  orden: number
}

interface RutaDetailProps {
  ruta: {
    id: string
    titulo: string
    slug: string
    descripcion?: string
    miniatura?: string
    cursos: CursoEnRuta[]
    beneficios?: { title: string; desc: string; icon: string }[] | null
    secciones?: RutaSeccion[] | null
  }
}

const DEFAULT_BENEFITS = [
  { title: 'Secuencia lógica', desc: 'Contenido progresivo diseñado por expertos para tu maestría.', icon: 'tabler-list-numbers' },
  { title: 'Certificaciones', desc: 'Podrás solicitar certificados por cada nivel completado.', icon: 'tabler-certificate' },
  { title: 'Acceso total', desc: 'Estudia a tu propio ritmo con acceso de por vida.', icon: 'tabler-device-laptop' },
  { title: 'Soporte premium', desc: 'Acompañamiento constante durante todo el proceso.', icon: 'tabler-headset' }
]

const StepCircle = styled(Box)(({ theme }) => ({
  width: 44,
  height: 44,
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
  fontSize: '1.25rem',
  zIndex: 2,
  flexShrink: 0,
  boxShadow: '0 4px 12px rgba(var(--mui-palette-primary-mainChannel), 0.3)',
  transform: 'rotate(-5deg)',
  '& > span': {
    transform: 'rotate(5deg)'
  }
}))

const ConnectorLine = styled(Box)(({ theme }) => ({
  position: 'absolute',
  left: 21,
  top: 44,
  bottom: 0,
  width: 2,
  background: `linear-gradient(to bottom, ${theme.palette.primary.main} 0%, ${theme.palette.divider} 100%)`,
  zIndex: 1
}))

const CourseCard = ({ curso, index, total }: { curso: CursoEnRuta; index: number; total: number }) => {
  return (
    <Box key={curso.id} sx={{ position: 'relative', pb: 8 }}>
      {index < total - 1 && <ConnectorLine />}

      <Stack direction="row" spacing={4} alignItems="flex-start">
        <StepCircle><span>{index + 1}</span></StepCircle>

        <Card sx={{
          flexGrow: 1,
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'transform 0.3s ease, border-color 0.3s ease',
          '&:hover': {
            transform: 'translateX(10px)',
            borderColor: 'primary.main'
          }
        }}>
            <Grid container alignItems="stretch">
              <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex' }}>
                <CourseThumbnail
                  src={curso.miniatura}
                  title={curso.titulo}
                  aspectRatio="auto"
                  sx={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 0 // Se apoya en el overflow:hidden del Card
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={8} md={9}>
                <Box sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{curso.titulo}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {curso.descripcion || 'Aprende los fundamentos y aplicaciones prácticas en este curso integral.'}
                  </Typography>
                  <Stack spacing={2} alignItems="flex-start">
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="baseline">
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                          S/. {curso.precio_oferta ? curso.precio_oferta : curso.precio}
                        </Typography>
                        {curso.precio_oferta && (
                          <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                            S/. {curso.precio}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                    <Button
                      component={Link}
                      href={`/cursos/${curso.slug}`}
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 3 }}
                    >
                      Ver detalles del curso
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
        </Card>
      </Stack>
    </Box>
  )
}

const RutaDetail = ({ ruta }: RutaDetailProps) => {
  return (
    <Box sx={{ pb: 10, bgcolor: '#f8fafc' }}>
      {/* New Premium Hero Section - Aligned with CourseDetail */}
      <Box sx={{
        position: 'relative',
        bgcolor: '#0f172a', // Dark base to make colors pop
        pt: { xs: 4, md: 6 },
        pb: { xs: 10, md: 16 },
        minHeight: { md: '650px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden'
      }}>
        {/* Background Blur Image - More prominent */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: ruta.miniatura ? `url(${ruta.miniatura})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(40px)',
            opacity: 0.4,
            transform: 'scale(1.1)',
            zIndex: 0
          }}
        />

        {/* Darker Overlay for Contrast */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)',
            zIndex: 0
          }}
        />

        <Container maxWidth={false} sx={{ px: { xs: 4, md: 8, lg: 12 }, position: 'relative', zIndex: 1 }}>
          {/* Breadcrumbs inside Hero */}
          <Box sx={{ mb: 6, mt: 2 }}>
            <Breadcrumbs
              separator={<i className="tabler-chevron-right" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }} />}
              aria-label="breadcrumb"
            >
              <Link
                href="/"
                style={{
                  textDecoration: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
              >
                Inicio
              </Link>
              <Link
                href="/rutas"
                style={{
                  textDecoration: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
              >
                Rutas de Aprendizaje
              </Link>
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                {ruta.titulo}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Grid container spacing={6} alignItems="center">
            {/* Left: Featured Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: '32px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  aspectRatio: '16/9'
                }}
              >
                <CourseThumbnail
                  src={ruta.miniatura}
                  title={ruta.titulo}
                  icon="tabler-map-2"
                  aspectRatio="16/9"
                />
                <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                  <Chip label="RUTA DE APRENDIZAJE" color="primary" sx={{ fontWeight: 800, px: 1 }} />
                </Box>
              </Box>
            </Grid>

            {/* Right: Ruta Core Info */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={1}>
                  <Chip label="PREMIUM" size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />
                  <Chip label="EXPERTO" size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }} />
                </Stack>

                <Typography variant="h2" component="h1" sx={{ fontWeight: 900, color: 'white', lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                  {ruta.titulo}
                </Typography>

                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', lineHeight: 1.6 }}>
                  {ruta.descripcion || 'Domina esta especialidad siguiendo nuestro camino curado de cursos paso a paso.'}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                        <i className="tabler-book-2" style={{ fontSize: '1.4rem' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Cursos</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>{ruta.cursos.length} módulos</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                        <i className="tabler-certificate" style={{ fontSize: '1.4rem' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Certificación</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>Especialista</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{
                    py: 2,
                    borderRadius: '16px',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    boxShadow: 'var(--mui-palette-primary-darkOpacity)',
                    textTransform: 'none',
                    mt: 2
                  }}
                  onClick={() => {
                    document.getElementById('cursos-ruta')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Ver cursos de la ruta
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Benefit Highlights Cards - Aligned with CourseDetail */}
          <Box sx={{ mt: 8 }}>
            <Grid container spacing={3}>
              {(ruta.beneficios && ruta.beneficios.length > 0 ? ruta.beneficios : DEFAULT_BENEFITS).map((item, index) => (
                <Grid item xs={6} sm={6} md={3} key={`benefit-hero-${index}`}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 3 },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: '24px',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255, 255, 255, 0.08)' }
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'primary.lighterOpacity',
                        color: 'primary.light',
                        mb: 2
                      }}
                    >
                      <i className={item.icon} style={{ fontSize: '1.5rem' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: { xs: '0.9rem', md: '1.1rem' }, fontWeight: 800, mb: { xs: 0.5, md: 1 }, color: 'white', lineHeight: 1.2 }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1.4 }}>{item.desc}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Course Sequence Section */}
      <Container id="cursos-ruta" maxWidth={false} sx={{ mt: -6, px: { xs: 4, md: 8, lg: 12 }, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={8}>
          <Grid item xs={12} lg={8}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 6, color: 'text.primary' }}>
              Tu camino hacia la <span style={{ color: 'var(--mui-palette-primary-main)' }}>maestría</span>
            </Typography>

            <Stack spacing={0}>
              {(!ruta.secciones || ruta.secciones.length === 0) ? (

                // Flat list if no sections defined
                ruta.cursos.map((c, index) => (
                  <CourseCard key={c.id} curso={c} index={index} total={ruta.cursos.length} />
                ))
              ) : (
                ruta.secciones.sort((a, b) => a.orden - b.orden).map((seccion) => {
                  const cursosInSeccion = ruta.cursos.filter(c => c.seccion_id === seccion.id)

                  if (cursosInSeccion.length === 0) return null

                  return (
                    <Box key={seccion.id} sx={{ mb: 10 }}>
                      <Box sx={{ mb: 6 }}>
                        <Typography variant='h5' sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                          {seccion.titulo}
                        </Typography>
                      </Box>
                      <Stack spacing={0}>
                        {cursosInSeccion.map((c, index) => (
                          <CourseCard
                            key={c.id}
                            curso={c}
                            index={index}
                            total={cursosInSeccion.length}

                          // Global index if needed for sequence numbering, but maybe local is better for sections
                          />
                        ))}
                      </Stack>
                    </Box>
                  )
                })
              )}

              {/* Courses without section (if any) */}
              {ruta.secciones && ruta.secciones.length > 0 && ruta.cursos.filter(c => !c.seccion_id).length > 0 && (
                <Box sx={{ mb: 10 }}>
                  <Box sx={{ mb: 6 }}>
                    <Typography variant='h5' sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                      Otros cursos
                    </Typography>
                  </Box>
                  <Stack spacing={0}>
                    {ruta.cursos.filter(c => !c.seccion_id).map((c, index, arr) => (
                      <CourseCard key={c.id} curso={c} index={index} total={arr.length} />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Grid>

          {/* Sidebar Info */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: { lg: 'sticky' }, top: 100 }}>
              <Paper sx={{
                p: 6,
                borderRadius: '32px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: 'radial-gradient(circle, rgba(var(--mui-palette-primary-mainChannel), 0.2) 0%, transparent 70%)',
                  zIndex: 0
                }
              }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: 'primary.light' }}>¿Por qué seguir esta ruta?</Typography>
                  <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                    Nuestras rutas están diseñadas por expertos para asegurar que el contenido sea progresivo y coherente. No pierda tiempo decidiendo qué aprender después.
                  </Typography>
                  <Stack spacing={3}>
                    {(ruta.beneficios && ruta.beneficios.length > 0 ? ruta.beneficios : DEFAULT_BENEFITS).slice(0, 3).map((item, i) => (
                      <Stack key={i} direction="row" spacing={3} alignItems="center">
                        <Box sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: 'rgba(255,255,255,0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.light'
                        }}>
                          <i className={item.icon} style={{ fontSize: '1.75rem' }} />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '1rem', color: 'white' }}>{item.title}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default RutaDetail
