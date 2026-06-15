'use client'

import { Box, Button, Chip, Divider, Typography } from '@mui/material'

import AppModal from '@/utils/components/AppModal'

const TIPO_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  CLASE_VIVO:   { label: 'Clase en Vivo',    icon: 'tabler-video',      color: '#1565C0' },
  EXAMEN:       { label: 'Examen',            icon: 'tabler-file-text',  color: '#C62828' },
  CURSO_INICIO: { label: 'Inicio de Curso',   icon: 'tabler-book-open',  color: '#2E7D32' },
  CURSO_FIN:    { label: 'Fin de Curso',      icon: 'tabler-flag',       color: '#E65100' }
}

type Props = {
  open: boolean
  handleClose: () => void
  basePath?: string
  evento: {
    title: string
    start: string
    end?: string
    extendedProps: {
      tipo: string
      curso: string
      cursoSlug?: string
      leccionId?: string
      enlace?: string
      descripcion?: string
      examenId?: string
      puntajeAprobacion?: number
    }
  } | null
}

function formatFecha(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function EventoModal({ open, handleClose, basePath = '/estudiante/aprender', evento }: Props) {
  if (!evento) return null

  const { tipo, curso, cursoSlug, leccionId, enlace, descripcion, examenId, puntajeAprobacion } = evento.extendedProps
  const config = TIPO_CONFIG[tipo] ?? TIPO_CONFIG.CLASE_VIVO

  const cursohref = `${basePath}/${cursoSlug}`

  return (
    <AppModal open={open} handleClose={handleClose}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          bgcolor: config.color + '20'
        }}>
          <i className={`${config.icon} text-2xl`} style={{ color: config.color }} />
        </Box>
        <Box>
          <Chip label={config.label} size='small' sx={{ bgcolor: config.color + '18', color: config.color, fontWeight: 700, fontSize: 11, mb: 0.5 }} />
          <Typography variant='h6' fontWeight={700} lineHeight={1.2}>{evento.title}</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Curso */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <i className='tabler-book text-lg text-textSecondary' />
        <Box>
          <Typography variant='caption' color='text.secondary'>Curso</Typography>
          <Typography variant='body2' fontWeight={600}>{curso}</Typography>
        </Box>
      </Box>

      {/* Fecha inicio */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <i className='tabler-calendar text-lg text-textSecondary' />
        <Box>
          <Typography variant='caption' color='text.secondary'>Inicio</Typography>
          <Typography variant='body2' fontWeight={600} sx={{ textTransform: 'capitalize' }}>
            {formatFecha(evento.start)}
          </Typography>
        </Box>
      </Box>

      {/* Fecha fin */}
      {evento.end && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <i className='tabler-calendar-off text-lg text-textSecondary' />
          <Box>
            <Typography variant='caption' color='text.secondary'>Fin</Typography>
            <Typography variant='body2' fontWeight={600} sx={{ textTransform: 'capitalize' }}>
              {formatFecha(evento.end)}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Puntaje mínimo examen */}
      {tipo === 'EXAMEN' && puntajeAprobacion !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <i className='tabler-award text-lg text-textSecondary' />
          <Box>
            <Typography variant='caption' color='text.secondary'>Puntaje mínimo de aprobación</Typography>
            <Typography variant='body2' fontWeight={600}>{puntajeAprobacion}%</Typography>
          </Box>
        </Box>
      )}

      {/* Descripción */}
      {descripcion && (
        <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2, mb: 2 }}>
          <Typography variant='body2' color='text.secondary'>{descripcion}</Typography>
        </Box>
      )}

      {/* Ir al curso */}
      {(tipo === 'CURSO_INICIO' || tipo === 'CURSO_FIN') && cursoSlug && (
        <Button
          fullWidth variant='contained'
          startIcon={<i className='tabler-book-open' />}
          href={cursohref}
          sx={{ mt: 1, bgcolor: tipo === 'CURSO_INICIO' ? '#2E7D32' : '#E65100', '&:hover': { filter: 'brightness(0.9)' } }}
        >
          Ir al curso
        </Button>
      )}

      {/* Botones de clase en vivo */}
      {tipo === 'CLASE_VIVO' && cursoSlug && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
          <Button
            fullWidth variant='contained'
            startIcon={<i className='tabler-player-play' />}
            href={leccionId ? `/estudiante/aprender/${cursoSlug}?leccion=${leccionId}` : `/estudiante/aprender/${cursoSlug}`}
            sx={{ bgcolor: '#1565C0', '&:hover': { bgcolor: '#0D47A1' } }}
          >
            Ir a la lección
          </Button>
          {enlace && (
            <Button
              fullWidth variant='outlined'
              startIcon={<i className='tabler-video' />}
              href={enlace} target='_blank' rel='noopener noreferrer'
              sx={{ borderColor: '#1565C0', color: '#1565C0', '&:hover': { borderColor: '#0D47A1', bgcolor: '#1565C010' } }}
            >
              Unirse a Zoom / Meet
            </Button>
          )}
        </Box>
      )}

      {/* Ir al examen */}
      {tipo === 'EXAMEN' && cursoSlug && examenId && (
        <Button
          fullWidth variant='contained' color='error'
          startIcon={<i className='tabler-pencil' />}
          href={`/estudiante/aprender/${cursoSlug}?examen=${examenId}`}
          sx={{ mt: 1 }}
        >
          Ir al Examen
        </Button>
      )}
    </AppModal>
  )
}
