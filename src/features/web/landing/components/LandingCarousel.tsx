'use client'

import React from 'react'
import { Box, Typography, Container, Grid } from '@mui/material'
import { motion } from 'framer-motion'
import type { Curso } from '@/features/admin/cursos/entity/Curso'

interface Props {
  curso: Curso
}

export default function LandingCarousel({ curso }: Props) {
  // We'll use the benefits or default ones if empty
  const defaultItems = [
    { icon: 'tabler-video', title: 'Clase en vivo', desc: 'Clases 100% en vivo por Zoom.' },
    { icon: 'tabler-headset', title: 'Seguimiento personalizado', desc: 'Apoyo y soporte de la coordinadora.' },
    { icon: 'tabler-device-laptop', title: 'Plataforma virtual', desc: 'Acceso 24/7 durante el programa.' },
    { icon: 'tabler-certificate', title: 'Certificado Opcional', desc: 'Solicítalo al finalizar el curso.' }
  ]

  const items = Array.isArray(curso.beneficios) && curso.beneficios.length > 0 
    ? curso.beneficios.map((b: any) => ({
        icon: 'tabler-check',
        title: b,
        desc: ''
      }))
    : defaultItems

  return (
    <Container maxWidth='xl'>
      <Box sx={{ 
        bgcolor: '#111827', 
        borderRadius: 4, 
        border: '1px solid rgba(255,255,255,0.05)',
        p: { xs: 3, md: 5 },
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <Grid container spacing={4} justifyContent="center">
          {items.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  p: 3,
                  bgcolor: 'rgba(255,255,255,0.02)',
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.03)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)',
                    borderColor: 'primary.main',
                    boxShadow: '0 0 20px rgba(var(--mui-palette-primary-mainChannel), 0.2)'
                  }
                }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.dark', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <i className={`${item.icon} text-3xl text-primary-light`} style={{ color: '#fff' }} />
                  </Box>
                  <Typography variant='h6' sx={{ fontWeight: 700, mb: 1, color: '#e0e0e0', fontSize: '1.1rem' }}>
                    {item.title}
                  </Typography>
                  {item.desc && (
                    <Typography variant='body2' sx={{ color: '#9ca3af' }}>
                      {item.desc}
                    </Typography>
                  )}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}
