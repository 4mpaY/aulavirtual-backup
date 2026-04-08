'use client'

import { Fragment, useState } from 'react'

import Link from 'next/link'

import {
  Container,
  Grid,
  Typography,
  Box,
  Stack,
  Chip,
  Avatar,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'

import VideoPlayer from '@/features/estudiante/player/components/VideoPlayer'
import UserAvatar from '@/utils/components/UserAvatar'
import HydratedDate from '@/utils/components/HydratedDate'
import CourseThumbnail from '@/utils/components/CourseThumbnail'

interface Leccion {
  id: string
  titulo: string
  duracion?: number
}

interface Modulo {
  id: string
  titulo: string
  lecciones: Leccion[]
}

interface CourseDetailProps {
  course: {
    id: string
    titulo: string
    slug: string
    descripcion?: string
    miniatura?: string
    precio: number
    moneda: string
    es_gratis: boolean
    es_comprado?: boolean
    nivel: string
    tipo_emision: string
    profesor: {
      id: string
      slug: string
      nombre: string
      apellido: string
      avatar?: string
      cargo?: string
      biografia?: string
    }
    categoria?: {
      nombre: string
    }
    video_presentacion?: string | null
    duracion?: string | null
    fecha_inicio?: string | Date | null
    creado_en?: string | Date
    modulos: Modulo[]
    objetivos?: string[]
    metodologia?: any[]
    beneficios?: any[]
    incluye?: any[]
    brochure?: string | null
  }
}

const CourseDetail = ({ course }: CourseDetailProps) => {
  const [previewLesson, setPreviewLesson] = useState<any>(null)

  // Helper para obtener el ID de video y la URL de embebido
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return null

    // YouTube (incluye shorts, embed, watch, etc.)
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)

    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0`
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)

    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=0`
    }

    return null
  }

  const embedUrl = getEmbedUrl(course.video_presentacion)

  const getDisplayDate = () => {
    const isSincrono = course.tipo_emision === 'SINCRONO' || course.tipo_emision === 'MIXTO'
    const dateToUse = isSincrono ? course.fecha_inicio : course.creado_en

    if (!dateToUse) return { label: isSincrono ? 'Inicio' : 'Publicado', value: 'Próximamente' }

    return {
      label: isSincrono ? 'Inicio' : 'Publicado',
      value: (
        <HydratedDate
          date={dateToUse}
          format="date"
          options={{
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }}
        />
      )
    }
  }

  const { label: dateLabel, value: dateValue } = getDisplayDate()

  return (
    <Box sx={{ pb: 10, bgcolor: '#f8fafc' }}>
      {/* New Premium Hero Section */}
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
            backgroundImage: course.miniatura ? `url(${course.miniatura})` : 'none',
            bgcolor: '#0f172a',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(60px)',
            opacity: 0.3,
            transform: 'scale(1.2)',
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
                href="/cursos"
                style={{
                  textDecoration: 'none',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.95rem',
                  fontWeight: 500
                }}
              >
                Cursos
              </Link>
              {course.categoria && (
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '0.95rem',
                    fontWeight: 500
                  }}
                >
                  {course.categoria.nombre}
                </Typography>
              )}
              <Typography
                sx={{
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: 700
                }}
              >
                {course.titulo}
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
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)', // Stronger shadow
                  aspectRatio: '16/9'
                }}
              >
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                    title={course.titulo}
                  />
                ) : (
                <CourseThumbnail
                  src={course.miniatura}
                  title={course.titulo}
                  aspectRatio="16/9"
                />
                )}
                {course.es_gratis && (
                  <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                    <Chip label="CURSO GRATUITO" color="success" sx={{ fontWeight: 800, px: 1 }} />
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Right: Course Core Info */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Stack direction="row" spacing={1}>
                  {course.es_comprado ? (
                    <Chip
                      icon={<i className="tabler-circle-check-filled" style={{ fontSize: '1.2rem', color: 'white' }} />}
                      label="TU CURSO"
                      sx={{
                        bgcolor: '#10b981', // green
                        color: 'white',
                        fontWeight: 800,
                        borderRadius: '12px',
                        pl: 0.5,
                        pr: 1,
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                      }}
                    />
                  ) : (
                    <Chip label={course.nivel === 'BASICO' ? 'Intermedio' : 'Avanzado'} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />
                  )}
                  <Chip label={course.tipo_emision === 'MIXTO' ? 'Mixto' : 'Sincrónico'} size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }} />
                </Stack>

                <Typography variant="h2" component="h1" sx={{ fontWeight: 900, color: 'white', lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                  {course.titulo}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <UserAvatar
                        src={course.profesor.avatar}
                        name={course.profesor.nombre}
                        apellido={course.profesor.apellido}
                        size={44}
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.1)',
                          border: '2px solid rgba(16, 185, 129, 0.3)'
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Docente</Typography>
                        {course.profesor.slug ? (
                          <Link
                            href={`/docentes/${course.profesor.slug}`}
                            style={{
                              color: '#10b981',
                              textDecoration: 'none',
                              fontWeight: 800,
                              fontSize: '1.1rem',
                              display: 'block',
                              marginTop: -2
                            }}
                          >
                            {course.profesor.nombre} {course.profesor.apellido}
                          </Link>
                        ) : (
                          <Typography sx={{ color: '#10b981', fontWeight: 800, fontSize: '1.1rem', mt: -0.25 }}>
                            {course.profesor.nombre} {course.profesor.apellido}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                        <i className="tabler-calendar" style={{ fontSize: '1.4rem' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">{dateLabel}</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>{dateValue}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  {course.duracion && (
                    <Grid item xs={6}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                          <i className="tabler-clock" style={{ fontSize: '1.4rem' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Duración</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>{course.duracion}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Typography variant="h2" sx={{ fontWeight: 900, color: course.es_comprado ? '#10b981' : 'primary.light', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                    {course.es_comprado ? 'Adquirido' : (course.es_gratis ? 'S/. 0.00' : `${course.moneda} ${course.precio}`)}
                  </Typography>
                  {(!course.es_gratis && !course.es_comprado) && (
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                      {course.moneda} {(course.precio * 1.5).toFixed(2)}
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  color={course.es_comprado ? "success" : "primary"}
                  fullWidth
                  size="large"
                  component={Link}
                  href={course.es_comprado ? `/estudiante/aprender/${course.slug}` : `/checkout/${course.slug}`}
                  sx={{
                    py: 2,
                    borderRadius: '16px',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    boxShadow: course.es_comprado ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'var(--mui-palette-primary-darkOpacity)',
                    textTransform: 'none'
                  }}
                >
                  {course.es_comprado ? 'Seguir aprendiendo' : 'Matricúlate'}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Benefit Highlights Cards - Now inside Hero */}
          <Box sx={{ mt: 8 }}>
            <Grid container spacing={3}>
              {(course.beneficios?.length ? course.beneficios : [
                { title: 'Clase en vivo', desc: 'Clases 100% en vivo por la plataforma de Zoom.', icon: 'tabler-video' },
                { title: 'Seguimiento personalizado', desc: 'Apoyo y soporte de la coordinadora académica.', icon: 'tabler-headset' },
                { title: 'Plataforma virtual', desc: 'Acceso 24/7 durante la duración del programa.', icon: 'tabler-device-laptop' },
                { title: 'Certificado Opcional', desc: 'Podrás solicitarlo durante o al finalizar el curso.', icon: 'tabler-certificate' }
              ]).map((item, index) => (
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
                      bgcolor: 'rgba(255, 255, 255, 0.05)', // Transparent white
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
                      <i className={item.icon.startsWith('tabler-') ? item.icon : `tabler-${item.icon}`} style={{ fontSize: '1.5rem' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: { xs: '0.9rem', md: '1.25rem' }, fontWeight: 800, mb: { xs: 0.5, md: 1 }, color: 'white', lineHeight: 1.2 }}>{item.title}</Typography>
                      <Typography sx={{ fontSize: { xs: '0.8rem', md: '1rem' }, color: 'rgba(255,255,255,0.8)', fontWeight: 500, lineHeight: 1.4 }}>{item.desc}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      <Container maxWidth={false} sx={{ mt: 6, px: { xs: 4, md: 8, lg: 12 } }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {/* Description Section */}
              {course.descripcion && (
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                    Acerca de este <span style={{ color: 'primary.main' }}>curso</span>
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#475569', fontSize: '1.1rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {course.descripcion}
                  </Typography>
                </Box>
              )}

              {/* Methodology Section */}
              <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Typography variant="h3" align="center" sx={{ fontWeight: 900, mb: 1 }}>
                  Metodología de <span style={{ color: 'primary.main' }}>Aprendizaje</span>
                </Typography>
                <Typography variant="h6" align="center" sx={{ color: '#475569', mb: 5, fontWeight: 500 }}>
                  Basado en la experiencia del profesional
                </Typography>

                <Grid container spacing={2}>
                  {(course.metodologia?.length ? course.metodologia : [
                    { title: 'Presentación de clase', icon: 'tabler-presentation' },
                    { title: 'Material de clases y adicionales', icon: 'tabler-folder' },
                    { title: 'Discusión y/o solución de casos reales', icon: 'tabler-messages' }
                  ]).map((m, i) => (
                    <Grid item xs={12} md={4} key={`metodologia-${i}`}>
                      <Box sx={{
                        p: 3,
                        bgcolor: 'white',
                        borderRadius: '20px',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2
                      }}>
                        <Avatar sx={{ bgcolor: 'primary.lighterOpacity', color: 'primary.main', width: 70, height: 70 }}>
                          <i className={m.icon.startsWith('tabler-') ? m.icon : `tabler-${m.icon}`} style={{ fontSize: '2.5rem' }} />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                          {m.title}
                        </Typography>
                        {m.desc && (
                          <Typography variant="body2" color="text.secondary">
                            {m.desc}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  Objetivos del <span style={{ color: 'primary.main' }}>curso</span>
                </Typography>
                <Stack spacing={2}>
                  {(course.objetivos?.length ? course.objetivos : [
                    'Formar profesionales capaces de aplicar metodologías avanzadas para transformar procesos reales.',
                    'Aprender flujos de trabajo eficientes desde el inicio hasta el despliegue final.',
                    'Identificar causas raíz y optimizar el rendimiento utilizando herramientas de última generación.'
                  ]).map((text, idx) => (
                    <Stack key={`objetivo-${idx}`} direction="row" spacing={2} alignItems="flex-start">
                      <i className="tabler-check" style={{ color: 'var(--mui-palette-primary-main)', marginTop: '4px', fontSize: '1.4rem', fontWeight: 900 }} />
                      <Typography variant="h6" sx={{ color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{text}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    Contenido del <span style={{ color: 'primary.main' }}>curso</span>
                  </Typography>

                  {course.brochure && (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="medium"
                      component="a"
                      href={course.brochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<i className="tabler-file-download" />}
                      sx={{
                        borderRadius: '12px',
                        fontWeight: 700,
                        textTransform: 'none',
                        px: 3,
                        borderColor: 'rgba(var(--mui-palette-primary-mainChannel), 0.3)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.lighterOpacity'
                        }
                      }}
                    >
                      Descargar Brochure
                    </Button>
                  )}
                </Stack>

                <Box>
                  {course.modulos.length > 0 ? (
                    <Stack spacing={1}>
                      {course.modulos
                        .filter(modulo => modulo.lecciones.some(l => (l as any).estado !== 'BORRADOR'))
                        .map((modulo, index) => (
                          <Accordion
                            key={modulo.id}
                            defaultExpanded={index === 0}
                            sx={{
                              borderRadius: '16px !important',
                              boxShadow: 'none',
                              border: '1px solid',
                              borderColor: '#e2e8f0',
                              bgcolor: 'white',
                              '&:before': { display: 'none' }
                            }}
                          >
                            <AccordionSummary
                              expandIcon={<i className="tabler-chevron-down" />}
                              sx={{ px: 3, py: 1 }}
                            >
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '8px',
                                  bgcolor: 'primary.lighterOpacity',
                                  color: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: '0.875rem'
                                }}>
                                  {index + 1}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>{modulo.titulo}</Typography>
                              </Stack>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                              <List disablePadding>
                                {modulo.lecciones
                                  .filter(leccion => (leccion as any).estado !== 'BORRADOR')
                                  .map((leccion) => (
                                    <Fragment key={leccion.id}>
                                      <Divider />
                                      <ListItem
                                        sx={{
                                          py: 2,
                                          px: 3,
                                          cursor: (leccion as any).es_vista_previa ? 'pointer' : 'default',
                                          transition: 'background-color 0.2s',
                                          '&:hover': (leccion as any).es_vista_previa ? { bgcolor: 'action.hover' } : {}
                                        }}
                                        onClick={() => {
                                          if ((leccion as any).es_vista_previa) {
                                            setPreviewLesson(leccion)
                                          }
                                        }}
                                      >
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                          <i className="tabler-player-play" style={{ color: (leccion as any).es_vista_previa ? 'primary.main' : 'text.disabled' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                          primary={
                                            <Stack direction="row" spacing={1} alignItems="center">
                                              <Typography variant='body1' fontWeight={600}>{leccion.titulo}</Typography>
                                              {(leccion as any).es_vista_previa && (
                                                <Chip
                                                  size='small'
                                                  label='VISTA PREVIA'
                                                  color='primary'
                                                  sx={{ height: 20, fontSize: '0.625rem', fontWeight: 800 }}
                                                />
                                              )}
                                            </Stack>
                                          }
                                        />
                                        {leccion.duracion && (
                                          <Typography variant="caption" color="text.disabled">
                                            {leccion.duracion} min
                                          </Typography>
                                        )}
                                      </ListItem>
                                    </Fragment>
                                  ))}
                              </List>
                            </AccordionDetails>
                          </Accordion>
                      ))}
                    </Stack>
                  ) : (
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', borderRadius: '16px' }}>
                      <Typography color="text.secondary">Aún no hay módulos publicados para este curso.</Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* New Premium Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
              <Paper sx={{ p: 4, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                <Typography variant="h6" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Programa {course.es_gratis ? 'Gratuito' : 'Premium'}
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: '#475569', mb: 3, fontWeight: 600 }}>
                  Regular
                </Typography>

                <Stack spacing={1.5} sx={{ mb: 4 }}>
                  {(course.incluye?.length ? course.incluye : [
                    { text: 'Clases en vivo', active: true },
                    { text: 'Clases grabadas', active: true },
                    { text: 'Comunidad del curso', active: true },
                    { text: 'Materiales de clase / Adicionales', active: true },
                    { text: 'Seguimiento académico', active: true },
                    { text: 'Evaluación programada', active: true },
                    { text: 'Evaluación en Cualquier momento', active: false },
                    { text: 'Recuperación de evaluación', active: false },
                    { text: 'Certificado por Ecoambiental o CIP', active: false }
                  ]).map((benefit, i) => (
                    <Stack key={`sidebar-benefit-${i}`} direction="row" spacing={1.5} alignItems="center">
                      <i
                        className={benefit.active ? "tabler-circle-check" : "tabler-circle-x"}
                        style={{ color: benefit.active ? 'var(--mui-palette-primary-main)' : '#ef4444', fontSize: '1.2rem' }}
                      />
                      <Typography variant="body1" sx={{ color: benefit.active ? 'text.primary' : 'text.secondary', fontWeight: benefit.active ? 600 : 400 }}>
                        {benefit.text}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Button
                  variant="contained"
                  color={course.es_comprado ? "success" : "primary"}
                  fullWidth
                  size="large"
                  component={Link}
                  href={course.es_comprado ? `/estudiante/aprender/${course.slug}` : `/checkout/${course.slug}`}
                  sx={{
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 700,
                    boxShadow: course.es_comprado ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'var(--mui-palette-primary-darkOpacity)',
                    textTransform: 'none'
                  }}
                >
                  {course.es_comprado ? 'Seguir aprendiendo' : 'Matricúlate'}
                </Button>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog para la Vista Previa */}
      <Dialog
        open={Boolean(previewLesson)}
        onClose={() => setPreviewLesson(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, bgcolor: 'background.paper', overflow: 'hidden' }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight={700}>
            Vista Previa: {previewLesson?.titulo}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setPreviewLesson(null)}
            sx={{ color: 'text.secondary' }}
          >
            <i className="tabler-x" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, bgcolor: 'black' }}>
          {previewLesson && (
            <VideoPlayer
              url={(previewLesson as any).video_url}
              tipo="VIDEO"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de biografía eliminado — ahora se navega a /docentes/[id] */}
    </Box>
  )
}

export default CourseDetail
