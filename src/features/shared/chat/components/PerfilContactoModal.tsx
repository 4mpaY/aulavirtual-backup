'use client'

import {
  Avatar, Box, Chip, Divider, List, ListItem,
  ListItemText, Typography
} from '@mui/material'

import { Icon } from '@iconify/react'

import AppModal from '@/utils/components/AppModal'

import type { UsuarioChatInfo } from '../entity/Chat'

interface Props {
  open: boolean
  handleClose: () => void
  usuario: UsuarioChatInfo
  cursos: { id: string; titulo: string }[]
}

const ROL_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  PROFESOR: 'Profesor',
  ESTUDIANTE: 'Estudiante'
}

const ROL_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  ADMIN: 'error',
  PROFESOR: 'primary',
  ESTUDIANTE: 'success'
}

export default function PerfilContactoModal({ open, handleClose, usuario, cursos }: Props) {
  return (
    <AppModal open={open} handleClose={handleClose}>
      <Box display='flex' flexDirection='column' alignItems='center' gap={1.5} pb={2}>
        <Avatar
          src={usuario.avatar ?? undefined}
          sx={{ width: 72, height: 72, fontSize: 28 }}
        >
          {usuario.nombre[0]}
        </Avatar>

        <Box textAlign='center'>
          <Typography variant='h6' fontWeight={600}>
            {usuario.nombre} {usuario.apellido}
          </Typography>
          <Chip
            label={ROL_LABELS[usuario.rol] ?? usuario.rol}
            color={ROL_COLORS[usuario.rol] ?? 'default'}
            size='small'
            variant='tonal'
            sx={{ mt: 0.5 }}
          />
        </Box>
      </Box>

      {cursos.length > 0 && (
        <>
          <Divider sx={{ mb: 1 }} />
          <Typography variant='overline' color='text.secondary' display='block' mb={0.5}>
            Cursos en común
          </Typography>
          <List disablePadding dense>
            {cursos.map(curso => (
              <ListItem key={curso.id} disablePadding sx={{ py: 0.25 }}>
                <Icon icon='tabler:book' width={16} style={{ marginRight: 8, flexShrink: 0 }} />
                <ListItemText primary={curso.titulo} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </AppModal>
  )
}
