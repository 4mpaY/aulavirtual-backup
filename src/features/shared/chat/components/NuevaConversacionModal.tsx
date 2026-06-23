'use client'

import { useMemo, useState } from 'react'

import {
  Avatar, Box, Chip, CircularProgress, InputAdornment,
  List, ListItemAvatar, ListItemButton, ListItemText,
  MenuItem, TextField, Typography
} from '@mui/material'

import { Icon } from '@iconify/react'

import AppModal from '@/utils/components/AppModal'

import { useContactos, useIniciarConversacion } from '../hooks/useChat'
import type { ContactoDisponible } from '../entity/Chat'

interface Props {
  open: boolean
  handleClose: () => void
  onConversacionIniciada: (conversacionId: string) => void
}

const ROL_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  PROFESOR: 'Profesor',
  ESTUDIANTE: 'Alumno'
}

const ROL_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'> = {
  ADMIN: 'error',
  PROFESOR: 'primary',
  ESTUDIANTE: 'success'
}

export default function NuevaConversacionModal({ open, handleClose, onConversacionIniciada }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [cursoFiltro, setCursoFiltro] = useState('')
  const { data: contactos = [], isLoading } = useContactos(open)
  const iniciar = useIniciarConversacion()

  const cursosDisponibles = useMemo(() => {
    const mapa = new Map<string, string>()

    for (const c of contactos) {
      for (const curso of c.cursos) {
        mapa.set(curso.id, curso.titulo)
      }
    }

    return Array.from(mapa.entries()).map(([id, titulo]) => ({ id, titulo }))
  }, [contactos])

  const filtrados = useMemo(() => {
    return contactos.filter(c => {
      const nombre = `${c.nombre} ${c.apellido}`.toLowerCase()
      const matchNombre = nombre.includes(busqueda.toLowerCase())
      const matchCurso = !cursoFiltro || c.cursos.some(cur => cur.id === cursoFiltro)

      return matchNombre && matchCurso
    })
  }, [contactos, busqueda, cursoFiltro])

  async function handleSeleccionar(contacto: ContactoDisponible) {
    if (contacto.conversacion_id) {
      onConversacionIniciada(contacto.conversacion_id)
      handleClose()

      return
    }

    iniciar.mutate(contacto.id, {
      onSuccess: data => {
        onConversacionIniciada(data.conversacion_id)
        handleClose()
      }
    })
  }

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Typography variant='h6' fontWeight={600} mb={2}>
        Nueva conversación
      </Typography>

      <Box display='flex' gap={1} mb={1}>
        <TextField
          fullWidth
          size='small'
          placeholder='Buscar persona...'
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Icon icon='tabler:search' width={18} />
              </InputAdornment>
            )
          }}
        />

        {cursosDisponibles.length > 0 && (
          <TextField
            select
            size='small'
            value={cursoFiltro}
            onChange={e => setCursoFiltro(e.target.value)}
            sx={{ minWidth: 160 }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todos los cursos</MenuItem>
            {cursosDisponibles.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {isLoading ? (
        <Box display='flex' justifyContent='center' py={4}>
          <CircularProgress size={28} />
        </Box>
      ) : filtrados.length === 0 ? (
        <Typography variant='body2' color='text.disabled' textAlign='center' py={4}>
          No hay contactos disponibles
        </Typography>
      ) : (
        <List disablePadding sx={{ maxHeight: 380, overflow: 'auto' }}>
          {filtrados.map(c => (
            <ListItemButton
              key={c.id}
              onClick={() => handleSeleccionar(c)}
              disabled={iniciar.isPending}
              sx={{ borderRadius: 1, gap: 1 }}
            >
              <ListItemAvatar>
                <Avatar src={c.avatar ?? undefined}>{c.nombre[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${c.nombre} ${c.apellido}`}
                secondary={c.cursos.length > 0 ? c.cursos.map(cur => cur.titulo).join(', ') : null}
                secondaryTypographyProps={{ noWrap: true, sx: { maxWidth: 220 } }}
              />
              <Chip
                label={ROL_LABELS[c.rol] ?? c.rol}
                color={ROL_COLORS[c.rol] ?? 'default'}
                size='small'
                variant='tonal'
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </AppModal>
  )
}
