'use client'

import { useEffect, useRef, useState } from 'react'

import {
  Avatar, Box, Button, Chip, CircularProgress,
  InputAdornment, List, ListItemAvatar, ListItemButton,
  ListItemText, MenuItem, TextField, Typography
} from '@mui/material'

import AppModal from '@/utils/components/AppModal'

import { useContactos, useCursosChat, useIniciarConversacion } from '../hooks/useChat'
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
  const [cursoId, setCursoId] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [buscarServer, setBuscarServer] = useState('')
  const [page, setPage] = useState(1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: cursos = [] } = useCursosChat(open)

  const { data: paginado, isFetching } = useContactos(
    { curso_id: cursoId || undefined, buscar: buscarServer || undefined, page },
    open
  )

  const contactos = paginado?.results ?? []
  const paginacion = paginado?.paginacion

  const iniciar = useIniciarConversacion()

  useEffect(() => {
    setPage(1)
  }, [cursoId, buscarServer])

  useEffect(() => {
    if (!open) {
      setCursoId('')
      setBusqueda('')
      setBuscarServer('')
      setPage(1)
    }
  }, [open])

  function handleBusqueda(valor: string) {
    setBusqueda(valor)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      setBuscarServer(valor)
    }, 300)
  }

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

  const totalPages = paginacion?.totalPages ?? 1
  const currentPage = paginacion?.page ?? 1

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Typography variant='h6' fontWeight={600} mb={2}>
        Nueva conversación
      </Typography>

      {/* Filtros */}
      <Box display='flex' gap={1} mb={1.5}>
        {cursos.length > 0 && (
          <TextField
            select
            size='small'
            value={cursoId}
            onChange={e => setCursoId(e.target.value)}
            sx={{ minWidth: 170 }}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value=''>Todos los cursos</MenuItem>
            {cursos.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.titulo}</MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          fullWidth
          size='small'
          placeholder='Buscar persona...'
          value={busqueda}
          onChange={e => handleBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-search text-[18px]' />
              </InputAdornment>
            ),
            endAdornment: isFetching ? (
              <InputAdornment position='end'>
                <CircularProgress size={14} />
              </InputAdornment>
            ) : null
          }}
        />
      </Box>

      {/* Lista de contactos */}
      <Box sx={{ minHeight: 200 }}>
        {contactos.length === 0 && !isFetching ? (
          <Typography variant='body2' color='text.disabled' textAlign='center' py={4}>
            No hay contactos disponibles
          </Typography>
        ) : (
          <List disablePadding sx={{ maxHeight: 340, overflow: 'auto' }}>
            {contactos.map(c => (
              <ListItemButton
                key={c.id}
                onClick={() => handleSeleccionar(c)}
                disabled={iniciar.isPending}
                sx={{ borderRadius: 1 }}
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
      </Box>

      {/* Paginación */}
      {totalPages > 1 && (
        <Box display='flex' alignItems='center' justifyContent='space-between' mt={1.5}>
          <Button
            size='small'
            variant='outlined'
            startIcon={<i className='tabler-chevron-left text-[16px]' />}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1 || isFetching}
          >
            Anterior
          </Button>

          <Typography variant='caption' color='text.secondary'>
            Página {currentPage} de {totalPages}
          </Typography>

          <Button
            size='small'
            variant='outlined'
            endIcon={<i className='tabler-chevron-right text-[16px]' />}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages || isFetching}
          >
            Siguiente
          </Button>
        </Box>
      )}
    </AppModal>
  )
}
