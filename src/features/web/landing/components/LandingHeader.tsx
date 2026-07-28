'use client'

import React, { useEffect, useState } from 'react'

import Link from 'next/link'

import { Box, Typography, Container } from '@mui/material'
import { motion } from 'framer-motion'

interface Props {
  logo: string
  targetDate: string | Date | null | undefined
}

export default function LandingHeader({ logo, targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isStarted, setIsStarted] = useState(false)
  
  useEffect(() => {
    if (!targetDate) {
      setIsStarted(true)

      return
    }

    const target = new Date(targetDate).getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        clearInterval(interval)
        setIsStarted(true)
      } else {
        setIsStarted(false)
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <Box 
      component={motion.header}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      sx={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        zIndex: 1000, 
        bgcolor: '#082823', // Deep forest green/teal as in reference
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        py: { xs: 2.5, md: 3.5 } // Larger height/padding
      }}
    >
      <style>{`
        @keyframes timer-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .pulse-box {
          animation: timer-pulse 1s ease-in-out infinite;
        }
      `}</style>
      <Container maxWidth='xl'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 2 }}>
          
          {/* Logo & Volver a Cursos (Left side) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, sm: 3 } }}>
             {/* Volver a cursos */}
             <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Link href='/cursos' style={{ textDecoration: 'none' }}>
                  <Typography sx={{ color: '#a0aab2', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: '#fff' }, transition: 'color 0.2s', fontSize: '0.9rem', fontWeight: 600 }}>
                    <i className='tabler-arrow-left' /> Volver a cursos
                  </Typography>
                </Link>
             </Box>
             
             {/* Divider */}
             <Box sx={{ display: { xs: 'none', md: 'block' }, width: '1px', height: '24px', bgcolor: 'rgba(255,255,255,0.15)' }} />

             {/* Logo */}
             <Link href='/'>
               <Box 
                 component='img' 
                 src={logo} 
                 alt='Logo' 
                 sx={{ height: { xs: 45, sm: 55, md: 65 }, objectFit: 'contain', cursor: 'pointer' }}
               />
             </Link>
          </Box>

          {/* Right Section: Timer and text stacked vertically */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, gap: 1.5, width: { xs: '100%', md: 'auto' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, lg: 4 }, flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'flex-end' }}>
              
              {/* Comenzamos en Text */}
              {!isStarted && (
                <Typography 
                  variant='h4' 
                  sx={{ 
                    fontWeight: 900, 
                    color: '#ffffff', 
                    letterSpacing: '0.05em',
                    fontSize: { xs: '1.2rem', sm: '1.4rem', lg: '1.8rem' },
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    textAlign: { xs: 'center', sm: 'right' }
                  }}
                >
                  COMENZAMOS EN:
                </Typography>
              )}
              
              {/* Timer Boxes */}
              <Box sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 } }}>
                {[
                  { label: 'Días', value: isStarted ? 0 : timeLeft.days },
                  { label: 'Horas', value: isStarted ? 0 : timeLeft.hours },
                  { label: 'Minutos', value: isStarted ? 0 : timeLeft.minutes },
                  { label: 'Segundos', value: isStarted ? 0 : timeLeft.seconds }
                ].map((item, index) => (
                  <Box 
                    key={index} 
                    className={isStarted ? "" : "pulse-box"}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      bgcolor: 'white', 
                      color: '#000', 
                      borderRadius: 2, 
                      px: { xs: 1.5, sm: 2.5 }, 
                      py: 1, 
                      minWidth: { xs: 55, sm: 75, md: 85 },
                      border: '2px solid #000',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Typography 
                      variant='h3' 
                      sx={{ 
                        fontWeight: 900, 
                        lineHeight: 1,
                        fontSize: { xs: '1.5rem', sm: '2.1rem', md: '2.4rem' },
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      {item.value.toString().padStart(2, '0')}
                    </Typography>
                    <Typography 
                      variant='caption' 
                      sx={{ 
                        fontWeight: 800, 
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }, 
                        textTransform: 'uppercase', 
                        mt: 0.5, 
                        color: '#333',
                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Subtitle Message (aligned under the timer) */}
            {isStarted && (
              <Typography 
                variant='body2' 
                sx={{ 
                  fontWeight: 700, 
                  color: '#ffffff',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  letterSpacing: '0.02em',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  textAlign: { xs: 'center', md: 'right' },
                  pr: { xs: 0, md: 1 }
                }}
              >
                El curso ya inició, te esperamos.
              </Typography>
            )}
          </Box>

        </Box>
      </Container>
    </Box>
  )
}
