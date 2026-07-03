'use client'

import { Avatar, Box, Paper, Typography, Chip } from '@mui/material'

import { Icon } from '@iconify/react'

import type { MensajeChatItem } from '../entity/Chat'

interface Props {
  mensaje: MensajeChatItem
  esMio: boolean
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

export default function MensajeBurbuja({ mensaje, esMio }: Props) {
  const isImagen = mensaje.adjunto?.mimetype.startsWith('image/')

  return (
    <Box
      display='flex'
      flexDirection={esMio ? 'row-reverse' : 'row'}
      alignItems='flex-end'
      gap={1}
      mb={1.5}
    >
      {!esMio && (
        <Avatar
          src={mensaje.remitente.avatar ?? undefined}
          alt={mensaje.remitente.nombre}
          sx={{ width: 32, height: 32, flexShrink: 0 }}
        >
          {mensaje.remitente.nombre[0]}
        </Avatar>
      )}

      <Box maxWidth='70%'>
        <Paper
          elevation={0}
          sx={{
            px: 2,
            py: 1,
            borderRadius: esMio ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            bgcolor: esMio ? 'primary.main' : 'action.hover',
            color: esMio ? 'primary.contrastText' : 'text.primary'
          }}
        >
          {mensaje.adjunto && (
            <Box mb={mensaje.contenido ? 1 : 0}>
              {isImagen ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mensaje.adjunto.url}
                  alt={mensaje.adjunto.nombre}
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, display: 'block' }}
                />
              ) : (
                <Chip
                  icon={<Icon icon='tabler:file' />}
                  label={mensaje.adjunto.nombre}
                  component='a'
                  href={mensaje.adjunto.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  clickable
                  size='small'
                  sx={{ color: esMio ? 'primary.contrastText' : 'text.primary' }}
                />
              )}
            </Box>
          )}
          {mensaje.contenido && (
            <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {mensaje.contenido}
            </Typography>
          )}
        </Paper>
        <Box display='flex' justifyContent={esMio ? 'flex-end' : 'flex-start'} alignItems='center' gap={0.5} mt={0.25}>
          <Typography variant='caption' color='text.disabled'>
            {formatHora(mensaje.creado_en)}
          </Typography>
          {esMio && (
            <Icon
              icon={mensaje.leido ? 'tabler:checks' : 'tabler:check'}
              width={14}
              color={mensaje.leido ? '#4caf50' : undefined}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}
