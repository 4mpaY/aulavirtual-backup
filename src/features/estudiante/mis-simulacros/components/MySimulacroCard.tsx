'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, Typography, Button, Stack, Box, Chip } from '@mui/material'
import { styled } from '@mui/material/styles'

const nivelLabel: Record<string, string> = { BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado' }
const nivelColor: Record<string, 'success' | 'warning' | 'error'> = {
  BASICO: 'success', INTERMEDIO: 'warning', AVANZADO: 'error'
}

const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  cursor: 'pointer',
  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' },
}))

interface Props {
  id: string
  titulo: string
  slug: string
  miniatura?: string | null
  nivel: string
  duracion?: string | null
  numero_preguntas: number
  area_tematica?: string | null
  intentos: number
  mejor_puntaje?: number | null
}

export default function MySimulacroCard({ titulo, slug, miniatura, nivel, duracion, numero_preguntas, area_tematica, intentos, mejor_puntaje }: Props) {
  const router = useRouter()
  const aprobado = mejor_puntaje != null && mejor_puntaje >= 60

  return (
    <StyledCard onClick={() => router.push(`/simulacros/${slug}`)}>
      {/* Imagen / placeholder */}
      <Box sx={{ position: 'relative', height: 160, bgcolor: 'grey.100', overflow: 'hidden', flexShrink: 0 }}>
        {miniatura
          ? <img src={miniatura} alt={titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9' }}>
              <i className='tabler-clipboard-list' style={{ fontSize: '3rem', color: '#cbd5e1' }} />
            </Box>}
        <Chip
          label={nivelLabel[nivel] ?? nivel}
          size='small'
          color={nivelColor[nivel] ?? 'default'}
          sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}
        />
        {intentos > 0 && (
          <Chip
            label={aprobado ? '✓ Aprobado' : `Mejor: ${mejor_puntaje?.toFixed(0)}%`}
            size='small'
            color={aprobado ? 'success' : 'warning'}
            sx={{ position: 'absolute', top: 10, right: 10, fontWeight: 700, fontSize: '0.6rem' }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Typography variant='h6' sx={{ fontWeight: 800, lineHeight: 1.3, fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 44 }}>
          {titulo}
        </Typography>

        {area_tematica && (
          <Typography variant='caption' color='text.secondary' sx={{ fontWeight: 600 }}>{area_tematica}</Typography>
        )}

        {/* Stats */}
        <Stack direction='row' spacing={2} sx={{ mt: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <i className='tabler-help-circle' style={{ fontSize: '0.9rem', color: '#64748b' }} />
            <Typography variant='caption' color='text.secondary'>{numero_preguntas} preguntas</Typography>
          </Box>
          {duracion && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <i className='tabler-clock' style={{ fontSize: '0.9rem', color: '#64748b' }} />
              <Typography variant='caption' color='text.secondary'>{duracion} min</Typography>
            </Box>
          )}
        </Stack>

        {/* Intentos */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <i className='tabler-refresh' style={{ fontSize: '0.9rem', color: '#94a3b8' }} />
          <Typography variant='caption' color='text.secondary'>
            {intentos === 0 ? 'Sin intentos aún' : `${intentos} intento${intentos > 1 ? 's' : ''} realizados`}
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Button fullWidth variant='contained' sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, py: 1.5 }}>
            {intentos === 0 ? 'Comenzar simulacro' : 'Reintentar simulacro'}
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  )
}
