'use client'

import React from 'react'

import { Box, Typography } from '@mui/material'

import type { Curso } from '@/features/admin/cursos/entity/Curso'

interface Props {
  curso: Curso
}

export default function LandingTicker({ curso }: Props) {
  // Format start date
  const formatFechaInicio = (fecha: string | Date | null | undefined) => {
    if (!fecha) {
      return 'Próximamente'
    }

    const date = new Date(fecha)

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]

    const dia = date.getUTCDate()
    const mes = meses[date.getUTCMonth()]

    return `${dia} de ${mes}`
  }

  // Map emission type
  const getModalidad = (tipoEmision: string) => {
    switch (tipoEmision) {
      case 'SINCRONO': return 'Virtual (Clases en Vivo)'
      case 'ASINCRONO': return 'Virtual (A tu propio ritmo)'
      case 'MIXTO': return 'Mixta (Virtual + Presencial)'
      default: return 'Online'
    }
  }

  // Map course level
  const getNivel = (nivel: string) => {
    switch (nivel) {
      case 'BASICO': return 'Nivel Básico'
      case 'INTERMEDIO': return 'Nivel Intermedio'
      case 'AVANZADO': return 'Nivel Avanzado'
      default: return ''
    }
  }

  // Map investment / price
  const getInversion = () => {
    if (curso.es_gratis || curso.precio === 0) {
      return '¡Acceso Gratuito!'
    }

    const symbol = curso.moneda === 'USD' ? '$' : 'S/'

    return `Inversión: ${symbol} ${curso.precio}`
  }

  // Map course type
  const getTipo = () => {
    switch (curso.tipo) {
      case 'DIPLOMADO': return 'DIPLOMADO DE POSGRADO'
      case 'ESPECIALIZACION': return 'PROGRAMA DE ESPECIALIZACIÓN'
      default: return 'CURSO PRÁCTICO'
    }
  }

  const items = [
    { text: getTipo(), icon: '🏷️' },
    { text: `Inicio: ${formatFechaInicio(curso.fecha_inicio)}`, icon: '📅' },
    { text: getInversion(), icon: '💰' },
    { text: `Modalidad: ${getModalidad(curso.tipo_emision)}`, icon: '💻' },
    { text: `Duración: ${curso.duracion || '120 horas'}`, icon: '⏱️' },
    { text: getNivel(curso.nivel), icon: '🎓' }
  ].filter(item => item.text)

  // Duplicate items array to make the infinite scroll loop seamless
  const repeatedItems = [...items, ...items, ...items, ...items]

  return (
    <Box 
      sx={{ 
        width: '100%', 
        bgcolor: '#FFC700', // Vibrant yellow/gold
        color: '#000000', // Pure black text as requested
        py: { xs: 2.2, md: 3 }, // Taller height
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        borderTop: '2px solid rgba(0,0,0,0.08)',
        borderBottom: '2px solid rgba(0,0,0,0.08)',
        zIndex: 5
      }}
    >
      <style>{`
        @keyframes ticker {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .ticker-container {
          display: flex;
          white-space: nowrap;
          width: max-content;
          animation: ticker 40s linear infinite;
        }
        .ticker-container:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="ticker-container">
        {repeatedItems.map((item, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              mx: { xs: 4, md: 6 } 
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 900, // Extra bold
                fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.35rem' }, // Larger font size
                letterSpacing: '0.04em',
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                color: '#000000', // Pure black text
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{item.icon}</span> {item.text}
            </Typography>
            
            <Typography 
              sx={{ 
                ml: { xs: 8, md: 12 }, 
                fontWeight: 900, 
                color: '#000000',
                opacity: 0.25,
                fontSize: '1.5rem' 
              }}
            >
              |
            </Typography>
          </Box>
        ))}
      </div>
    </Box>
  )
}
