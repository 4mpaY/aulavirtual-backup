'use client'

import { useState } from 'react'

import { Avatar, Box, Button, Card, CardHeader, Chip, IconButton, Stack, Switch, TextField, Typography, Grid } from '@mui/material'
import { useSnackbar } from 'notistack'

import AppModal from '@/utils/components/AppModal'
import SignatureUpload from '../../usuarios/components/SignatureUpload'

import { useFirmantes, useFirmantesMutation } from '../hooks/useFirmantes'
import type { Firmante } from '../entity/Firmante'

const FIRMANTE_VACIO: Partial<Firmante> = { nombre: '', cargo: '', firma: '', sello: '' }

export default function FirmantesView() {
  const { data: firmantes = [], isLoading } = useFirmantes()
  const { crear, actualizar, eliminar } = useFirmantesMutation()
  const { enqueueSnackbar } = useSnackbar()

  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<Firmante | null>(null)
  const [form, setForm] = useState<Partial<Firmante>>(FIRMANTE_VACIO)

  const abrirCrear = () => {
    setEditando(null)
    setForm(FIRMANTE_VACIO)
    setModalOpen(true)
  }

  const abrirEditar = (f: Firmante) => {
    setEditando(f)
    setForm({ nombre: f.nombre, cargo: f.cargo || '', firma: f.firma || '', sello: f.sello || '' })
    setModalOpen(true)
  }

  const handleGuardar = async () => {
    if (!form.nombre?.trim()) {
      enqueueSnackbar('Ingresa el nombre del firmante', { variant: 'warning' })

      return
    }

    try {
      if (editando) {
        await actualizar.mutateAsync({ id: editando.id, data: form })
        enqueueSnackbar('Firmante actualizado', { variant: 'success' })
      } else {
        await crear.mutateAsync(form)
        enqueueSnackbar('Firmante creado', { variant: 'success' })
      }

      setModalOpen(false)
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar el firmante', { variant: 'error' })
    }
  }

  const handleToggle = async (f: Firmante) => {
    try {
      await actualizar.mutateAsync({ id: f.id, data: { activo: !f.activo } })
      enqueueSnackbar(`Firmante ${!f.activo ? 'activado' : 'desactivado'}`, { variant: 'success' })
    } catch {
      enqueueSnackbar('Error al cambiar el estado', { variant: 'error' })
    }
  }

  const handleEliminar = async (f: Firmante) => {
    if (!confirm(`¿Eliminar al firmante "${f.nombre}"?`)) return

    try {
      await eliminar.mutateAsync(f.id)
      enqueueSnackbar('Firmante eliminado', { variant: 'success' })
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'No se pudo eliminar. Puede estar en uso, desactívalo en su lugar.', { variant: 'error' })
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Firmantes'
          subheader='Catálogo de firmantes (nombre, cargo, firma y sello) reutilizable para las plantillas de certificado personalizadas.'
          className='pbe-4'
          action={
            <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={abrirCrear}>
              Nuevo firmante
            </Button>
          }
        />

        <Box p={4} pt={0}>
          {isLoading ? (
            <Typography color='text.secondary'>Cargando...</Typography>
          ) : firmantes.length === 0 ? (
            <Typography color='text.secondary'>Aún no has creado ningún firmante.</Typography>
          ) : (
            <Grid container spacing={4}>
              {firmantes.map(f => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={f.id}>
                  <Card variant='outlined' sx={{ height: '100%', p: 3 }}>
                    <Stack direction='row' spacing={2} alignItems='center'>
                      <Avatar src={f.firma || undefined} sx={{ width: 48, height: 48, bgcolor: 'action.hover' }}>
                        <i className='tabler-signature' />
                      </Avatar>
                      <Box flex={1} minWidth={0}>
                        <Typography fontWeight={600} noWrap title={f.nombre}>{f.nombre}</Typography>
                        <Typography variant='body2' color='text.secondary' noWrap title={f.cargo || ''}>
                          {f.cargo || 'Sin cargo'}
                        </Typography>
                      </Box>
                    </Stack>

                    <Box display='flex' alignItems='center' justifyContent='space-between' mt={3}>
                      <Box display='flex' alignItems='center' gap={1}>
                        <Switch size='small' checked={f.activo} onChange={() => handleToggle(f)} />
                        <Chip label={f.activo ? 'Activo' : 'Inactivo'} color={f.activo ? 'success' : 'default'} variant='tonal' size='small' />
                      </Box>
                      <Box>
                        <IconButton size='small' onClick={() => abrirEditar(f)} title='Editar'>
                          <i className='tabler-edit text-[18px]' />
                        </IconButton>
                        <IconButton size='small' color='error' onClick={() => handleEliminar(f)} title='Eliminar'>
                          <i className='tabler-trash text-[18px]' />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Card>

      <AppModal open={modalOpen} handleClose={() => setModalOpen(false)}>
        <Typography variant='h5' sx={{ mb: 4 }}>{editando ? 'Editar firmante' : 'Nuevo firmante'}</Typography>

        <Stack spacing={4}>
          <TextField
            fullWidth
            autoFocus
            label='Nombre'
            placeholder='Ej. María López'
            value={form.nombre || ''}
            onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
          />

          <TextField
            fullWidth
            label='Cargo'
            placeholder='Ej. Directora Académica'
            value={form.cargo || ''}
            onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
          />

          <Box>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>Firma</Typography>
            <SignatureUpload value={form.firma || ''} onChange={firma => setForm(f => ({ ...f, firma }))} />
          </Box>

          <Box>
            <Typography variant='body2' fontWeight={500} sx={{ mb: 1 }}>Sello</Typography>
            <SignatureUpload value={form.sello || ''} onChange={sello => setForm(f => ({ ...f, sello }))} />
          </Box>
        </Stack>

        <Box display='flex' justifyContent='flex-end' gap={2} mt={4}>
          <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
          <Button variant='contained' onClick={handleGuardar} disabled={crear.isPending || actualizar.isPending}>
            Guardar
          </Button>
        </Box>
      </AppModal>
    </>
  )
}
