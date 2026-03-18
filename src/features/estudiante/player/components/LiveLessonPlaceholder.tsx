'use client'

import { useState, useEffect } from 'react'

import { Box, Typography, Button, Paper, Stack, alpha } from '@mui/material'

interface LiveLessonPlaceholderProps {
  titulo: string
  fechaProgramada?: string | Date | null
  enlaceReunion?: string | null
  esEnVivo: boolean
}

const LiveLessonPlaceholder = ({
  titulo,
  fechaProgramada,
  enlaceReunion,
  esEnVivo
}: LiveLessonPlaceholderProps) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    if (!fechaProgramada || !esEnVivo) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(fechaProgramada).getTime()
      const difference = target - now

      if (difference <= 0) {
        setIsLive(true)
        setTimeLeft(null)
        clearInterval(timer)
      } else {
        setIsLive(false)
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [fechaProgramada, esEnVivo])

  const formattedDate = fechaProgramada
    ? new Date(fechaProgramada).toLocaleString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    })
    : ''

  return (
    <Paper
      sx={{
        width: '100%',
        aspectRatio: '16/9',
        bgcolor: '#0f172a', // Slate 900
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: { xs: 0, md: '16px' },
        overflow: 'hidden',
        position: 'relative',
        color: 'white',
        textAlign: 'center',
        p: 4,
        border: '1px solid',
        borderColor: alpha('#3b82f6', 0.2)
      }}
    >
      {/* Background elements for "Live" feel */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        bgcolor: alpha('#3b82f6', 0.1),
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: -100,
        left: -100,
        width: 300,
        height: 300,
        bgcolor: alpha('#8b5cf6', 0.1),
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      <Stack spacing={3} alignItems="center" sx={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.5,
            borderRadius: '100px',
            bgcolor: isLive ? alpha('#ef4444', 0.1) : alpha('#3b82f6', 0.1),
            border: '1px solid',
            borderColor: isLive ? alpha('#ef4444', 0.5) : alpha('#3b82f6', 0.5),
            color: isLive ? '#f87171' : '#60a5fa'
          }}
        >
          <Box sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: isLive ? '#ef4444' : '#3b82f6',
            animation: isLive ? 'pulse 2s infinite' : 'none'
          }} />
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: 'inherit' }}>
            {isLive ? 'Transmisión en Vivo' : 'Próximamente'}
          </Typography>
        </Box>

        <Typography variant="h3" sx={{ fontWeight: 900, lineHeight: 1.2, color: 'common.white' }}>
          {titulo}
        </Typography>

        {!isLive && timeLeft && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)', opacity: 0.8 }}>
              La clase iniciará en:
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              {[
                { label: 'Días', value: timeLeft.days },
                { label: 'Hrs', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Seg', value: timeLeft.seconds }
              ].map((item, index) => (
                <Box key={index} sx={{ minWidth: 70 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'common.white' }}>
                    {String(item.value).padStart(2, '0')}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Typography variant="h6" sx={{ mt: 3, fontWeight: 600, color: '#e2e8f0' }}>
              {formattedDate}
            </Typography>
          </Box>
        )}

        {isLive ? (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8' }}>
              La sesión ha comenzado. Haz clic abajo para unirte a la sala virtual.
            </Typography>
            <Button
              variant="contained"
              size="large"
              href={enlaceReunion || '#'}
              target="_blank"
              sx={{
                py: 2,
                px: 6,
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)'
                }
              }}
              startIcon={<i className="tabler-external-link" />}
            >
              Unirse a la Clase en Vivo
            </Button>
          </Box>
        ) : (
          !timeLeft && !isLive && (
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Esta sesión en vivo ya ha finalizado.
            </Typography>
          )
        )}
      </Stack>

      <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
    </Paper>
  )
}

export default LiveLessonPlaceholder
