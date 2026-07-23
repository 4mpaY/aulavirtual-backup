'use client'

import React, { useEffect, useState } from 'react'
import { Box, Typography, Button, Container, Grid, useTheme } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

import type { Curso } from '@/features/admin/cursos/entity/Curso'
import LandingHeader from './LandingHeader'
import LandingHero from './LandingHero'
import LandingCarousel from './LandingCarousel'
import LandingPremiumDetails from './LandingPremiumDetails'
import LandingBrochure from './LandingBrochure'

interface Props {
  curso: Curso
  logo: string
}

export default function LandingClientPage({ curso, logo }: Props) {
  const theme = useTheme()

  return (
    <Box sx={{ bgcolor: '#f9fafb', color: '#111827', minHeight: '100vh', overflowX: 'hidden', pb: 10 }}>
      {/* HEADER FIXO */}
      <LandingHeader logo={logo} targetDate={curso.landing_timer} courseSlug={curso.slug} />

      {/* HERO SECTION */}
      <Box sx={{ mt: '80px' }}> {/* Compensate for fixed header */}
        <LandingHero curso={curso} />
      </Box>

      {/* CAROUSEL SECTION */}
      <Box sx={{ mt: 8, mb: 8 }}>
        <LandingCarousel curso={curso} />
      </Box>

      {/* SECOND CTA */}
      {curso.landing_wsp_link && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
           <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.05, 1], boxShadow: ['0px 0px 0px rgba(37,211,102,0)', '0px 0px 30px rgba(37,211,102,0.6)', '0px 0px 0px rgba(37,211,102,0)'] }}
              transition={{ repeat: Infinity, duration: 2 }}
           >
              <Button
                 variant='contained'
                 href={curso.landing_wsp_link}
                 target='_blank'
                 size='large'
                 sx={{ 
                    bgcolor: '#25D366', 
                    color: 'white', 
                    px: 6, 
                    py: 2, 
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    borderRadius: 8,
                    '&:hover': { bgcolor: '#1ebe57' }
                 }}
                 startIcon={<i className='tabler-brand-whatsapp text-3xl' />}
              >
                 UNIRME AL GRUPO
              </Button>
           </motion.div>
        </Box>
      )}

      {/* BROCHURE SECTION */}
      {curso.brochure && (
        <Box sx={{ mt: 8, mb: 8 }}>
            <LandingBrochure url={curso.brochure} />
        </Box>
      )}

      {/* PREMIUM DETAILS SECTION */}
      <Box sx={{ mt: 8, px: 2 }}>
        <LandingPremiumDetails curso={curso} />
      </Box>

      {/* VER MÁS DETALLES LINK */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Button 
          component={Link} 
          href={`/cursos/${curso.slug}?skipLanding=true`}
          variant='text' 
          sx={{ color: '#aaa', textDecoration: 'underline', '&:hover': { color: '#fff' } }}
        >
          Ver más detalles en la página principal del curso
        </Button>
      </Box>
    </Box>
  )
}
