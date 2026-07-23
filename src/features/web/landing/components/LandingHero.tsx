'use client'

import React from 'react'
import { Box, Typography, Button, Container, Grid } from '@mui/material'
import { motion } from 'framer-motion'
import type { Curso } from '@/features/admin/cursos/entity/Curso'

interface Props {
  curso: Curso
}

export default function LandingHero({ curso }: Props) {
  const bgImage = (curso as any).landing_bg_image || curso.miniatura
  const flyerImage = (curso as any).landing_flyer_image || curso.miniatura

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        minHeight: { xs: 'auto', md: '80vh' },
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 8, md: 8 },
        pb: { xs: 8, md: 8 },
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay para oscurecer el fondo */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, rgba(11,15,25,0.85) 0%, rgba(11,15,25,0.55) 50%, rgba(11,15,25,0.3) 100%)',
          zIndex: 0
        }}
      />

      <Container maxWidth='xl' sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems='center'>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box 
                sx={{ 
                  p: { xs: 2, md: 4 }, 
                  ml: { xs: 0, md: 4, lg: 8 }, 
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant='h2' 
                  sx={{ 
                    fontWeight: 900, 
                    mb: 3, 
                    lineHeight: 1.1, 
                    color: '#fff', 
                    textTransform: 'uppercase',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    textShadow: '0 4px 10px rgba(0,0,0,0.6)'
                  }}
                >
                  {curso.titulo}
                </Typography>
                
                <Typography 
                  variant='h5' 
                  sx={{ 
                    mb: 4, 
                    color: '#e0e0e0', 
                    fontWeight: 600, 
                    lineHeight: 1.5,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    textShadow: '0 2px 5px rgba(0,0,0,0.5)'
                  }}
                >
                  {curso.descripcion}
                </Typography>

                {/* Mostrar el primer beneficio si existe */}
                {Array.isArray((curso as any).incluye) && (curso as any).incluye.length > 0 && (
                  <Typography variant='h6' sx={{ color: '#4ade80', fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                     <i className='tabler-checkbox text-2xl' /> {(curso as any).incluye[0]}
                  </Typography>
                )}

                {(curso as any).landing_wsp_link && (
                  <Box sx={{ mt: 3 }}>
                    <Typography 
                      variant='subtitle1' 
                      sx={{ 
                        color: '#25D366', 
                        mb: 2, 
                        fontWeight: 900, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      ▼ Únete al grupo WhatsApp y asegura tu cupo AHORA ▼
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ scale: [1, 1.05, 1], boxShadow: ['0px 0px 0px rgba(37,211,102,0)', '0px 0px 30px rgba(37,211,102,0.6)', '0px 0px 0px rgba(37,211,102,0)'] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      style={{ display: 'inline-block' }}
                    >
                      <Button
                        variant='contained'
                        href={(curso as any).landing_wsp_link}
                        target='_blank'
                        size='large'
                        sx={{ 
                          bgcolor: '#25D366', 
                          color: 'white', 
                          px: 6, 
                          py: 2.5, 
                          fontSize: '1.5rem',
                          fontWeight: 900,
                          borderRadius: 2,
                          textTransform: 'none',
                          boxShadow: '0 10px 20px rgba(37,211,102,0.4)',
                          '&:hover': { bgcolor: '#1ebe57' }
                        }}
                        endIcon={<i className='tabler-brand-whatsapp text-4xl' />}
                      >
                        Unirme al Grupo
                      </Button>
                    </motion.div>
                  </Box>
                )}
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
             {flyerImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  whileHover={{ scale: 1.02, rotate: 1 }}
                >
                  <Box 
                    component='img'
                    src={flyerImage}
                    alt='Flyer del curso'
                    sx={{
                      width: '100%',
                      maxWidth: '500px',
                      height: 'auto',
                      borderRadius: 4,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                      display: 'block',
                      margin: '0 auto',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  />
                </motion.div>
             )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
