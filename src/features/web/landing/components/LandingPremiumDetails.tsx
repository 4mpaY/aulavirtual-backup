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
    <Container maxWidth='xl'>
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant='h4' sx={{ fontWeight: 800, mb: 1, color: '#fff' }}>
              Acerca del curso
            </Typography>
            <Typography variant='body1' sx={{ color: '#aaa', mb: 4 }}>
              Descripción detallada de todo lo que aprenderás.
            </Typography>

            {/* Metodología */}
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.02)', p: 4, borderRadius: 4, mb: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 1, textAlign: 'center', color: '#fff' }}>
                Metodología de Aprendizaje
              </Typography>
              <Typography variant='body2' sx={{ color: '#aaa', textAlign: 'center', mb: 4 }}>
                Basado en la experiencia del profesional
              </Typography>
              
              <Grid container spacing={3}>
                {metodologia.map((item: any, i: number) => (
                  <Grid item xs={12} sm={4} key={i}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                      <Box sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: 'rgba(var(--mui-palette-primary-mainChannel), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2, color: 'primary.main' }}>
                        <i className={`${item.icon || 'tabler-check'} text-3xl`} />
                      </Box>
                      <Typography variant='subtitle2' sx={{ fontWeight: 600, color: '#e0e0e0' }}>
                        {item.title || item}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Objetivos */}
            <Box>
              <Typography variant='h5' sx={{ fontWeight: 700, mb: 3, color: '#fff' }}>
                Objetivos del curso
              </Typography>
              <List sx={{ p: 0 }}>
                {objetivos.map((obj: any, i: number) => (
                  <ListItem key={i} sx={{ px: 0, py: 1, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5, color: 'primary.main' }}>
                      <i className='tabler-circle-check text-xl' />
                    </ListItemIcon>
                    <ListItemText 
                      primary={obj} 
                      primaryTypographyProps={{ color: '#d1d5db', fontSize: '1rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper elevation={24} sx={{ 
              borderRadius: 4, 
              overflow: 'hidden', 
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Box sx={{ bgcolor: 'primary.main', p: 3, textAlign: 'center', color: '#fff' }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 }}>
                  Programa Premium
                </Typography>
                <Typography variant='h3' sx={{ fontWeight: 900, mt: 1 }}>
                  {curso.moneda} {curso.es_gratis ? 'GRATIS' : Number(curso.precio).toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ p: 4 }}>
                <List sx={{ p: 0 }}>
                  {incluye.map((inc: any, i: number) => (
                    <ListItem key={i} sx={{ px: 0, py: 1.5, borderBottom: i === incluye.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                      <ListItemIcon sx={{ minWidth: 36, color: '#10b981' }}>
                        <i className='tabler-check text-lg' />
                      </ListItemIcon>
                      <ListItemText 
                        primary={inc} 
                        primaryTypographyProps={{ color: '#e5e7eb', fontWeight: 500, fontSize: '0.95rem' }}
                      />
                    </ListItem>
                  ))}
                </List>

                {(curso as any).landing_wsp_link && (
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    animate={{ scale: [1, 1.05, 1], boxShadow: ['0px 0px 0px rgba(37,211,102,0)', '0px 0px 30px rgba(37,211,102,0.6)', '0px 0px 0px rgba(37,211,102,0)'] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ marginTop: 24 }}
                  >
                    <Button
                      variant='contained'
                      fullWidth
                      href={(curso as any).landing_wsp_link}
                      target='_blank'
                      sx={{ 
                        bgcolor: '#25D366', 
                        color: 'white', 
                        py: 1.5, 
                        fontSize: '1rem',
                        fontWeight: 700,
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#1ebe57' }
                      }}
                      startIcon={<i className='tabler-brand-whatsapp text-xl' />}
                    >
                      UNIRME AL GRUPO
                    </Button>
                  </motion.div>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  )
}
