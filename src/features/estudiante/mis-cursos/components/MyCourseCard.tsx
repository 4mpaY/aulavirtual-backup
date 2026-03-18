'use client'


import { useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack,
  Box,
  Chip,
  LinearProgress
} from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  position: 'relative',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
  }
}))

interface MyCourseCardProps {
  titulo: string
  slug: string
  miniatura?: string
  profesor: {
    nombre: string
    apellido: string
  }
  progreso: number
  categoria?: string
}

const MyCourseCard = ({
  titulo,
  slug,
  miniatura,
  profesor,
  progreso,
  categoria
}: MyCourseCardProps) => {
  const router = useRouter()

  return (
    <StyledCard onClick={() => router.push(`/estudiante/aprender/${slug}`)}>
      <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          image={miniatura || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
          alt={titulo}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          {categoria && (
            <Chip
              label={categoria}
              size="small"
              sx={{
                bgcolor: 'primary.50',
                color: 'primary.main',
                fontWeight: 700,
                mb: 1,
                borderRadius: '6px',
                fontSize: '0.65rem',
                textTransform: 'uppercase'
              }}
            />
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 0.5,
              color: '#1e293b',
              fontSize: '1.1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '44px'
            }}
          >
            {titulo}
          </Typography>

          <Typography variant="body2" sx={{ color: '#334155', fontWeight: 600, mb: 2 }}>
            Por {profesor.nombre} {profesor.apellido}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
                Progreso
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>
                {Math.round(progreso)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progreso}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'primary.50',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 700,
              py: 1.2,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            Continuar aprendiendo
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  )
}

export default MyCourseCard
