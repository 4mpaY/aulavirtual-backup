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
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {suscritoActualmente && (
        <Chip
          label='Tu plan actual'
          color='success'
          size='small'
          sx={{ position: 'absolute', top: 12, right: 12 }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant='h6' fontWeight={700} gutterBottom>
          {plan.nombre}
        </Typography>

        {plan.descripcion && (
          <Typography variant='body2' color='text.secondary' mb={2}>
            {plan.descripcion}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
          <Typography variant='h4' fontWeight={700} color='primary'>
            {plan.moneda === 'PEN' ? 'S/' : '$'} {Number(plan.precio).toFixed(2)}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            / {INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}
          </Typography>
        </Box>

        {plan.dias_prueba > 0 && (
          <Chip
            label={`${plan.dias_prueba} días gratis`}
            color='info'
            size='small'
            variant='tonal'
            sx={{ mb: 2 }}
          />
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant='subtitle2' fontWeight={600} mb={1}>
          Cursos incluidos ({plan.cursos.length}):
        </Typography>
        <List dense disablePadding>
          {plan.cursos.slice(0, 5).map(c => (
            <ListItem key={c.curso_id} disablePadding disableGutters>
              <ListItemIcon sx={{ minWidth: 24 }}>
                <i className='tabler-check' style={{ color: 'var(--mui-palette-success-main)', fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText
                primary={c.curso.titulo}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
          {plan.cursos.length > 5 && (
            <ListItem disablePadding disableGutters>
              <ListItemText
                primary={`+${plan.cursos.length - 5} cursos más`}
                primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
              />
            </ListItem>
          )}
        </List>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant={suscritoActualmente ? 'tonal' : 'contained'}
          color={suscritoActualmente ? 'success' : 'primary'}
          disabled={suscritoActualmente}
          onClick={() => onSuscribirse(plan)}
        >
          {suscritoActualmente ? 'Plan activo' : 'Suscribirse'}
        </Button>
      </CardActions>
    </Card>
  )
}

export default PlanCard
