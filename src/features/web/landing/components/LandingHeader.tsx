'use client'

import React, { useEffect, useState } from 'react'
import { Box, Typography, Container } from '@mui/material'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Props {
  logo: string
  targetDate: string | Date | null | undefined
  courseSlug: string
}

export default function LandingHeader({ logo, targetDate, courseSlug }: Props) {
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
        bgcolor: 'rgba(11, 15, 25, 0.85)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        py: 2
      }}
    >
      <Container maxWidth='xl'>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          
          {/* Volver a cursos button (Left) */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
             <Link href='/cursos' style={{ textDecoration: 'none' }}>
               <Typography sx={{ color: '#aaa', display: 'flex', alignItems: 'center', gap: 0.5, '&:hover': { color: '#fff' }, transition: 'color 0.2s' }}>
                 <i className='tabler-arrow-left' /> Volver a cursos
               </Typography>
             </Link>
          </Box>

          {/* Logo (Center - absolute on desktop) */}
          <Box sx={{ 
             position: { xs: 'static', md: 'absolute' }, 
             left: '50%', 
             transform: { xs: 'none', md: 'translateX(-50%)' }
          }}>
            <Link href='/'>
              <Box 
                component='img' 
                src={logo} 
                alt='Logo' 
                sx={{ height: { xs: 45, md: 60 }, objectFit: 'contain', cursor: 'pointer' }}
              />
            </Link>
          </Box>

          {/* Timer (Right) */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isStarted && (
               <Typography variant='h5' sx={{ display: { xs: 'none', lg: 'block' }, fontWeight: 800, fontStyle: 'italic', color: '#ffeb3b', textShadow: '0 0 10px rgba(255,235,59,0.5)' }}>
                 COMENZAMOS EN:
               </Typography>
            )}
            
            {isStarted ? (
              <Box sx={{ bgcolor: 'rgba(37,211,102,0.15)', px: 3, py: 1.5, borderRadius: 2, border: '1px solid #25D366', boxShadow: '0 0 15px rgba(37,211,102,0.3)' }}>
                 <Typography variant='h6' sx={{ fontWeight: 800, color: '#25D366' }}>
                   El curso ya inició, te esperamos.
                 </Typography>
              </Box>
            ) : (
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {[
                    { label: 'Días', value: timeLeft.days },
                    { label: 'Horas', value: timeLeft.hours },
                    { label: 'Minutos', value: timeLeft.minutes },
                    { label: 'Segundos', value: timeLeft.seconds }
                  ].map((item, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      bgcolor: 'white', 
                      color: '#000', 
                      borderRadius: 2, 
                      px: { xs: 2, sm: 3 }, 
                      py: 1.5, 
                      minWidth: { xs: 70, sm: 90 },
                      boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                    }}>
                      <Typography variant='h3' sx={{ fontWeight: 900, lineHeight: 1 }}>
                        {item.value.toString().padStart(2, '0')}
                      </Typography>
                      <Typography variant='caption' sx={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', mt: 0.5, color: '#444' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </motion.div>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
