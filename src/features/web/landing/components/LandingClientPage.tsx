'use client'

import React from 'react'

import Link from 'next/link'

import { Box, Button } from '@mui/material'
import { motion } from 'framer-motion'

import type { Curso } from '@/features/admin/cursos/entity/Curso'
import LandingHeader from './LandingHeader'
import LandingHero from './LandingHero'
import LandingTicker from './LandingTicker'
import LandingCarousel from './LandingCarousel'
import LandingPremiumDetails from './LandingPremiumDetails'
import LandingBrochure from './LandingBrochure'
import LandingSyllabus from './LandingSyllabus'

interface Props {
  curso: Curso
  logo: string
}

export default function LandingClientPage({ curso, logo }: Props) {
  return (
    <Box sx={{ bgcolor: '#f9fafb', color: '#111827', minHeight: '100vh', overflowX: 'hidden', pb: 10 }}>
      {/* HEADER FIXO */}
      <LandingHeader logo={logo} targetDate={curso.landing_timer} />

      {/* HERO SECTION (No mt offset so background starts from top) */}
      <LandingHero curso={curso} />

      {/* TICKER RIBBON (Below Hero) */}
      <LandingTicker curso={curso} />

      {/* CAROUSEL SECTION (Full-width dark band) */}
      <LandingCarousel curso={curso} />

      {/* SECOND CTA */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
         <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              scale: [1, 1.05, 1], 
              boxShadow: [
                '0px 4px 15px rgba(37,211,102,0.25)', 
                '0px 12px 35px rgba(37,211,102,0.7)', 
                '0px 4px 15px rgba(37,211,102,0.25)'
              ] 
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ borderRadius: '50px' }}
         >
            <Button
               variant='contained'
               href={(curso as any).landing_wsp_link || (curso.numero_asesor ? `https://wa.me/${curso.numero_asesor}` : 'https://chat.whatsapp.com/')}
               target='_blank'
               sx={{ 
                  bgcolor: '#25D366', 
                  color: 'white', 
                  px: { xs: 6, sm: 10 }, 
                  py: 2.5, 
                  fontSize: { xs: '1.2rem', sm: '1.45rem' },
                  fontWeight: 900,
                  borderRadius: '50px', // Pill shape for modern look
                  letterSpacing: '0.05em',
                  boxShadow: 'none',
                  '&:hover': { 
                    bgcolor: '#1ebe57',
                    boxShadow: 'none'
                  }
               }}
               startIcon={<i className='tabler-brand-whatsapp text-4xl' style={{ marginRight: 4 }} />}
             >
               UNIRME AL GRUPO
            </Button>
         </motion.div>
      </Box>

      {/* SYLLABUS SECTION */}
      <LandingSyllabus curso={curso} />

      {/* BROCHURE SECTION */}
      {curso.brochure && (
        <Box sx={{ mt: 8, mb: 8 }}>
            <LandingBrochure url={curso.brochure} />
        </Box>
      )}

      {/* PREMIUM DETAILS SECTION (Full-width block matching syllabus background) */}
      <Box sx={{ 
        bgcolor: '#f9fafb', 
        width: '100%', 
        py: { xs: 8, md: 12 }, 
        mt: 0
      }}>
        <LandingPremiumDetails curso={curso} />
      </Box>

      {/* VER MÁS DETALLES LINK */}
      <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Button 
          component={Link} 
          href={`/cursos/${curso.slug}?skipLanding=true`}
          variant='text' 
          sx={{ color: '#aaa', textDecoration: 'underline', '&:hover': { color: '#000' } }}
        >
          Ver más detalles en la página principal del curso
        </Button>
      </Box>
    </Box>
  )
}
