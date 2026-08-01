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
    ? curso.beneficios.map((b: any, index) => {
        if (typeof b === 'object' && b !== null) {
          return {
            icon: b.icon || 'tabler-check',
            title: b.title || '',
            desc: b.desc || ''
          }
        }

        return {
          icon: defaultItems[index]?.icon || 'tabler-check',
          title: b,
          desc: defaultItems[index]?.desc || ''
        }
      })
    : defaultItems

  const finalItems = [...items]

  while (finalItems.length < 4) {
    const idx = finalItems.length

    finalItems.push(defaultItems[idx] || { icon: 'tabler-check', title: '', desc: '' })
  }

  return (
    <Box sx={{ 
      bgcolor: '#0B0F19', // Sleek dark navy background for the entire section
      width: '100%', 
      py: { xs: 8, md: 10 },
      border: 'none',
      borderRadius: 0,
      boxShadow: 'none'
    }}>
      <Container maxWidth='xl'>
        <Grid container spacing={4} justifyContent="center">
          {finalItems.map((item, index) => (
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
                  p: 2, 
                  height: '100%',
                  bgcolor: 'transparent',
                  border: 'none'
                }}>
                  {/* Icon Container */}
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%', 
                    bgcolor: '#025E44', // Brand deep teal
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3,
                    boxShadow: '0 4px 15px rgba(2, 94, 68, 0.3)'
                  }}>
                    <i className={`${item.icon} text-4xl text-white`} />
                  </Box>
                  <Typography 
                    variant='h5' 
                    sx={{ 
                      fontWeight: 800, 
                      mb: 1.5, 
                      color: '#ffffff', 
                      fontSize: { xs: '1.25rem', md: '1.45rem' },
                      fontFamily: "'Plus Jakarta Sans', sans-serif"
                    }}
                  >
                    {item.title}
                  </Typography>
                  {item.desc && (
                    <Typography 
                      variant='body1' 
                      sx={{ 
                        color: '#9ca3af',
                        fontSize: '1.05rem',
                        lineHeight: 1.6,
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      {item.desc}
                    </Typography>
                  )}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
