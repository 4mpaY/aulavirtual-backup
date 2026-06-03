'use client'

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider
} from '@mui/material'

import type { PlanPublico } from '../entity/Suscripcion'
import { INTERVALO_LABELS } from '../entity/Suscripcion'

interface PlanCardProps {
  plan: PlanPublico
  onSuscribirse: (plan: PlanPublico) => void
  suscritoActualmente?: boolean
}

const PlanCard = ({ plan, onSuscribirse, suscritoActualmente = false }: PlanCardProps) => {
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderRadius: '24px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
      transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.22s ease',
      '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 25px -5px rgba(2, 94, 68, 0.08), 0 10px 10px -5px rgba(0,0,0,0.01)',
        borderColor: 'var(--web-primary,#25927F)'
      }
    }}>
      {suscritoActualmente && (
        <Chip
          label='Tu plan actual'
          color='success'
          size='small'
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontWeight: 700,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            borderRadius: '8px',
            px: 0.5
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, p: 3.5 }}>
        <Typography variant='h6' sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em', mb: 1 }}>
          {plan.nombre}
        </Typography>

        {plan.descripcion && (
          <Typography variant='body2' color='text.secondary' sx={{ minHeight: '3em', mb: 2.5, lineHeight: 1.5, fontWeight: 500 }}>
            {plan.descripcion}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 2 }}>
          <Typography variant='h4' sx={{ fontWeight: 800, color: 'var(--web-primary,#25927F)', letterSpacing: '-0.02em' }}>
            {plan.moneda === 'PEN' ? 'S/' : '$'} {Number(plan.precio).toFixed(2)}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ fontWeight: 600 }}>
            / {INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}
          </Typography>
        </Box>

        {plan.dias_prueba > 0 && (
          <Chip
            label={`${plan.dias_prueba} días gratis`}
            color='info'
            size='small'
            variant='tonal'
            sx={{
              fontWeight: 700,
              fontSize: '0.7rem',
              borderRadius: '8px',
              mb: 2.5
            }}
          />
        )}

        <Divider sx={{ my: 2.5, borderColor: '#f1f5f9' }} />

        {(() => {
          const beneficios: string[] = Array.isArray(plan.beneficios) ? plan.beneficios : []
          const tieneBeneficios = beneficios.length > 0

          if (tieneBeneficios) {
            return (
              <>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569', mb: 1.5, textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>
                  ¿Qué incluye?
                </Typography>
                <List dense disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {beneficios.map((beneficio, idx) => (
                    <ListItem key={idx} disablePadding disableGutters sx={{ alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 22, mt: 0.2 }}>
                        <i className='tabler-check' style={{ color: 'var(--web-primary,#25927F)', fontSize: 14, fontWeight: 900 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={beneficio}
                        primaryTypographyProps={{ variant: 'body2', sx: { lineHeight: 1.4, color: '#475569', fontWeight: 500 } }}
                      />
                    </ListItem>
                  ))}
                </List>
                {plan.cursos.length > 0 && (
                  <Box sx={{
                    mt: 2.5, display: 'flex', alignItems: 'center', gap: 1,
                    bgcolor: '#f8fafc', border: '1px solid #f1f5f9',
                    p: 1.25, borderRadius: '12px'
                  }}>
                    <i className='tabler-book-2' style={{ color: '#64748b', fontSize: 16 }} />
                    <Typography variant='caption' fontWeight={700} color='text.secondary'>
                      {plan.cursos.length} curso{plan.cursos.length !== 1 ? 's' : ''} incluido{plan.cursos.length !== 1 ? 's' : ''}
                    </Typography>
                  </Box>
                )}
              </>
            )
          }

          return (
            <>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#475569', mb: 1.5, textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>
                Cursos incluidos ({plan.cursos.length}):
              </Typography>
              <List dense disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {plan.cursos.slice(0, 5).map(c => (
                  <ListItem key={c.curso_id} disablePadding disableGutters sx={{ alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 22, mt: 0.2 }}>
                      <i className='tabler-check' style={{ color: 'var(--web-primary,#25927F)', fontSize: 14, fontWeight: 900 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={c.curso.titulo}
                      primaryTypographyProps={{ variant: 'body2', sx: { lineHeight: 1.4, color: '#475569', fontWeight: 500 } }}
                    />
                  </ListItem>
                ))}
                {plan.cursos.length > 5 && (
                  <ListItem disablePadding disableGutters>
                    <ListItemText
                      primary={`+${plan.cursos.length - 5} cursos más`}
                      primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', sx: { fontWeight: 600, pl: '22px' } }}
                    />
                  </ListItem>
                )}
              </List>
            </>
          )
        })()}
      </CardContent>

      <CardActions sx={{ p: 3.5, pt: 0 }}>
        {suscritoActualmente ? (
          <Button
            fullWidth
            variant='tonal'
            color='success'
            disabled
            sx={{
              py: 1.2,
              borderRadius: '14px',
              fontWeight: 700,
              textTransform: 'none',
              bgcolor: 'rgba(76,175,80,0.08) !important',
              color: '#2e7d32 !important',
              border: '1px solid rgba(76,175,80,0.2)'
            }}
          >
            Plan activo
          </Button>
        ) : (
          <Button
            fullWidth
            variant='contained'
            onClick={() => onSuscribirse(plan)}
            sx={{
              py: 1.2,
              borderRadius: '14px',
              fontWeight: 700,
              textTransform: 'none',
              background: 'linear-gradient(135deg, var(--web-primary,#25927F) 0%, var(--web-dark,#025E44) 100%)',
              boxShadow: '0 4px 12px rgba(37,146,127,0.15)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(135deg, var(--web-primary,#1d7364) 0%, var(--web-dark,#014a35) 100%)',
                boxShadow: '0 6px 16px rgba(37,146,127,0.25)'
              }
            }}
          >
            Suscribirse
          </Button>
        )}
      </CardActions>
    </Card>
  )
}

export default PlanCard
