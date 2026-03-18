'use client'


import Link from 'next/link'

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Avatar,
  AvatarGroup,
  Chip
} from '@mui/material'
import { styled } from '@mui/material/styles'

interface RutaCardProps {
  titulo: string
  slug: string
  descripcion?: string
  miniatura?: string
  total_cursos: number
  cursos: any[]
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    borderColor: theme.palette.primary.main,
    '& .ruta-image': {
      transform: 'scale(1.1)'
    }
  }
}))

const RutaCard = ({
  titulo,
  slug,
  descripcion,
  miniatura,
  total_cursos,
  cursos
}: RutaCardProps) => {
  return (
    <StyledCard>
      <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden', bgcolor: 'primary.50' }}>
        <CardMedia
          component="img"
          className="ruta-image"
          image={miniatura || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80'}
          alt={titulo}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease'
          }}
        />
        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
          zIndex: 1
        }} />
        <Chip
          label="RUTA DE APRENDIZAJE"
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.7rem',
            height: 24
          }}
        />
        <Box sx={{ position: 'absolute', bottom: 16, left: 16, zIndex: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem', border: '2px solid white' } }}>
            {cursos.map((c, i) => (
              <Avatar key={i} src={c.miniatura || ''} alt={c.titulo} />
            ))}
          </AvatarGroup>
          <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
            {total_cursos} Cursos incluidos
          </Typography>
        </Box>
      </Box>

      <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: 'text.primary',
            lineHeight: 1.2,
            minHeight: '2.4em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {titulo}
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 3,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1
          }}
        >
          {descripcion || 'Sigue esta ruta estructurada para dominar esta especialidad desde cero hasta un nivel avanzado.'}
        </Typography>

        <Button
          component={Link}
          href={`/rutas/${slug}`}
          variant="outlined"
          fullWidth
          endIcon={<i className="tabler-arrow-right" />}
          sx={{
            borderRadius: '12px',
            py: 1.5,
            fontWeight: 700,
            textTransform: 'none',
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              bgcolor: 'primary.main',
              color: 'white'
            }
          }}
        >
          Ver Ruta de Aprendizaje
        </Button>
      </CardContent>
    </StyledCard>
  )
}

export default RutaCard
