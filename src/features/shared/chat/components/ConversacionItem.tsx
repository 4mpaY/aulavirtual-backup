'use client'

import { Avatar, Badge, Box, ListItemButton, Typography } from '@mui/material'

import type { ConversacionResumen } from '../entity/Chat'

interface Props {
  conversacion: ConversacionResumen
  seleccionada: boolean
  onClick: () => void
}

function formatFecha(iso: string) {
  const d = new Date(iso)
  const hoy = new Date()

  if (d.toDateString() === hoy.toDateString()) {
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
  }

  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })
}

export default function ConversacionItem({ conversacion, seleccionada, onClick }: Props) {
  const otro = conversacion.otroParticipante

  return (
    <ListItemButton
      selected={seleccionada}
      onClick={onClick}
      sx={{ gap: 1.5, py: 1.25, px: 2 }}
    >
      <Badge
        badgeContent={conversacion.mensajesNoLeidos}
        color='error'
        overlap='circular'
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Avatar src={otro?.avatar ?? undefined} alt={otro?.nombre} sx={{ width: 40, height: 40 }}>
          {otro?.nombre?.[0]}
        </Avatar>
      </Badge>
      <Box flex={1} minWidth={0}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography
            variant='subtitle2'
            fontWeight={conversacion.mensajesNoLeidos > 0 ? 700 : 500}
            noWrap
          >
            {otro ? `${otro.nombre} ${otro.apellido}` : 'Usuario'}
          </Typography>
          {conversacion.ultimoMensaje && (
            <Typography variant='caption' color='text.disabled' flexShrink={0} ml={1}>
              {formatFecha(conversacion.ultimoMensaje.creado_en)}
            </Typography>
          )}
        </Box>
        {conversacion.ultimoMensaje && (
          <Typography
            variant='caption'
            color={conversacion.mensajesNoLeidos > 0 ? 'text.primary' : 'text.disabled'}
            fontWeight={conversacion.mensajesNoLeidos > 0 ? 600 : 400}
            noWrap
            display='block'
          >
            {conversacion.ultimoMensaje.contenido || '📎 Adjunto'}
          </Typography>
        )}
      </Box>
    </ListItemButton>
  )
}
