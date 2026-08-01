'use client'

import React from 'react'

import { Box, Typography, Container, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Button } from '@mui/material'
import { motion } from 'framer-motion'

import type { Curso } from '@/features/admin/cursos/entity/Curso'

interface Props {
  curso: Curso
}

export default function LandingPremiumDetails({ curso }: Props) {
  const objetivos = Array.isArray(curso.objetivos) && curso.objetivos.length > 0
    ? curso.objetivos
    : [
        'Aplicar metodologías avanzadas para transformar procesos reales.',
        'Aprender flujos de trabajo eficientes desde el inicio hasta el despliegue.',
        'Identificar causas raíz y optimizar el rendimiento con herramientas modernas.'
      ]

  const metodologia = Array.isArray(curso.metodologia) && curso.metodologia.length > 0
    ? curso.metodologia
    : [
        { icon: 'tabler-presentation', title: 'Presentación de clase' },
        { icon: 'tabler-folder', title: 'Material de clases y adicionales' },
        { icon: 'tabler-message-circle-2', title: 'Resolución de casos reales' }
      ]

  const defaultIncludes = [
    'Clases en vivo',
    'Clases grabadas',
    'Comunidad del curso',
    'Materiales y adicionales',
    'Seguimiento académico',
    'Evaluación programada'
  ]

  const incluye = Array.isArray((curso as any).incluye) && (curso as any).incluye.length > 0 
    ? (curso as any).incluye 
    : defaultIncludes

  return (
    <Container maxWidth='xl' sx={{ px: { xs: 6, sm: 8, md: 12 } }}>
      <Grid container spacing={6}>
        {/* Left Column: Info, Metodología and Objetivos */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Metodología Card (Now first) */}
            <Box 
              sx={{ 
                bgcolor: '#ffffff', 
                p: { xs: 3, md: 5 }, 
                borderRadius: 6, 
                mb: 6, 
                boxShadow: '0 10px 30px rgba(11, 15, 25, 0.04)',
                border: '1px solid #e5e7eb' 
              }}
            >
              <Typography 
                variant='h5' 
                sx={{ 
                  fontWeight: 800, 
                  mb: 1, 
                  textAlign: 'center', 
                  color: '#0B0F19',
                  fontSize: { xs: '1.35rem', md: '1.6rem' },
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                Metodología de Aprendizaje
              </Typography>
              <Typography 
                variant='body1' 
                sx={{ 
                  color: '#6B7280', 
                  textAlign: 'center', 
                  mb: 5,
                  fontSize: '1rem'
                }}
              >
                Basado en la experiencia del profesional
              </Typography>
              
              <Grid container spacing={4}>
                {metodologia.map((item: any, i: number) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 70, 
                          height: 70, 
                          borderRadius: 4, 
                          bgcolor: 'rgba(37, 146, 127, 0.08)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          mb: 2.5, 
                          color: '#025E44', // Dark Teal
                          boxShadow: '0 4px 12px rgba(2, 94, 68, 0.04)'
                        }}
                      >
                        <i className={`${item.icon || 'tabler-check'} text-3xl`} />
                      </Box>
                      <Typography 
                        variant='subtitle1' 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#1F2937',
                          fontSize: '1.05rem',
                          lineHeight: 1.4,
                          fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}
                      >
                        {item.title || item}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Title (Now second) */}
            <Typography 
              variant='h4' 
              sx={{ 
                fontWeight: 900, 
                mb: 1.5, 
                color: '#0B0F19', // Dark text for light background
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              Acerca del curso
            </Typography>
            <Typography 
              variant='body1' 
              sx={{ 
                color: '#4B5563', // Slate gray for readability
                mb: 5,
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.6
              }}
            >
              Descripción detallada de todo lo que aprenderás.
            </Typography>

            {/* Objetivos (Now third) */}
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant='h5' 
                sx={{ 
                  fontWeight: 800, 
                  mb: 3, 
                  color: '#0B0F19',
                  fontSize: { xs: '1.35rem', md: '1.6rem' },
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}
              >
                Objetivos del curso
              </Typography>
              <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {objetivos.map((obj: any, i: number) => (
                  <ListItem key={i} sx={{ px: 0, py: 0.5, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 36, mt: 0.5, color: '#025E44' }}>
                      <i className='tabler-circle-check-filled text-2xl' />
                    </ListItemIcon>
                    <ListItemText 
                      primary={obj} 
                      primaryTypographyProps={{ 
                        color: '#374151', 
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </motion.div>
        </Grid>

        {/* Right Column: Pricing and CTA Box */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 6, 
                overflow: 'hidden', 
                bgcolor: '#ffffff',
                border: '1px solid #e5e7eb',
                boxShadow: '0 20px 40px rgba(11, 15, 25, 0.06)'
              }}
            >
              {/* Premium Gradient Header */}
              <Box 
                sx={{ 
                  background: 'linear-gradient(135deg, #025E44 0%, #25927F 100%)', 
                  p: 4, 
                  textAlign: 'center', 
                  color: '#fff' 
                }}
              >
                <Typography 
                  variant='subtitle2' 
                  sx={{ 
                    fontWeight: 800, 
                    textTransform: 'uppercase', 
                    letterSpacing: 2, 
                    color: '#BDD962', // Lime Green accent for premium look
                    fontSize: '0.85rem'
                  }}
                >
                  Programa Premium
                </Typography>
                <Typography 
                  variant='h3' 
                  sx={{ 
                    fontWeight: 900, 
                    mt: 1.5,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  {curso.moneda} {curso.es_gratis ? 'GRATIS' : Number(curso.precio).toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ p: 4 }}>
                <List sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {incluye.map((inc: any, i: number) => (
                    <ListItem 
                      key={i} 
                      sx={{ 
                        px: 0, 
                        py: 2, 
                        borderBottom: i === incluye.length - 1 ? 'none' : '1px solid #f3f4f6' 
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32, color: '#10b981' }}>
                        <i className='tabler-circle-check text-xl' />
                      </ListItemIcon>
                      <ListItemText 
                        primary={inc} 
                        primaryTypographyProps={{ 
                          color: '#4B5563', 
                          fontWeight: 600, 
                          fontSize: '1.05rem',
                          fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <motion.div 
                  whileHover={{ scale: 1.03 }} 
                  whileTap={{ scale: 0.97 }} 
                  animate={{ scale: [1, 1.03, 1], boxShadow: ['0px 0px 0px rgba(37,211,102,0)', '0px 0px 20px rgba(37,211,102,0.4)', '0px 0px 0px rgba(37,211,102,0)'] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ marginTop: 32 }}
                >
                  <Button
                    variant='contained'
                    fullWidth
                    href={(curso as any).landing_wsp_link || ((curso as any).numero_asesor ? `https://wa.me/${(curso as any).numero_asesor}` : 'https://chat.whatsapp.com/')}
                    target='_blank'
                    sx={{ 
                      bgcolor: '#25D366', 
                      color: 'white', 
                      py: 2, 
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      borderRadius: 4,
                      boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)',
                      '&:hover': { 
                        bgcolor: '#1ebe57',
                        boxShadow: '0 12px 28px rgba(37, 211, 102, 0.4)'
                      }
                    }}
                    startIcon={<i className='tabler-brand-whatsapp text-2xl' />}
                  >
                    UNIRME AL GRUPO
                  </Button>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  )
}
