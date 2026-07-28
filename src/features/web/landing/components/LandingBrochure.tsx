'use client'

import React from 'react'

import { motion } from 'framer-motion'
import { Box, Typography, Button, Container } from '@mui/material'

interface Props {
  url: string
}

export default function LandingBrochure({ url }: Props) {
  return (
    <Container maxWidth='md'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{
          bgcolor: 'rgba(255,255,255,0.03)',
          borderRadius: 4,
          p: { xs: 4, md: 6 },
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}>
          <Box sx={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            bgcolor: 'rgba(var(--mui-palette-error-mainChannel), 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'error.main'
          }}>
            <i className='tabler-file-type-pdf text-4xl' />
          </Box>
          
          <Typography variant='h4' sx={{ fontWeight: 800, color: '#fff' }}>
            TEMARIO COMPLETO
          </Typography>
          
          <Typography variant='body1' sx={{ color: '#aaa', maxWidth: 500 }}>
            Descarga nuestro brochure oficial en formato PDF para conocer a detalle todos los módulos, metodología y beneficios que obtendrás.
          </Typography>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant='contained'
              color='error'
              size='large'
              href={url}
              target='_blank'
              startIcon={<i className='tabler-download' />}
              sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 8, fontWeight: 700 }}
            >
              DESCARGAR BROCHURE
            </Button>
          </motion.div>
        </Box>
      </motion.div>
    </Container>
  )
}
