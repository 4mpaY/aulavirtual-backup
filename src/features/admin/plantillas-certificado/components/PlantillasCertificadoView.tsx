'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Button, Card, CardHeader, Chip, IconButton, TextField, Typography, Grid, Switch } from '@mui/material'
import { useSnackbar } from 'notistack'

import AppModal from '@/utils/components/AppModal'

import { usePlantillasCertificado, usePlantillasCertificadoMutation } from '../hooks/usePlantillasCertificado'
import type { PlantillaCertificado } from '../entity/PlantillaCertificado'

export default function PlantillasCertificadoView() {
  const router = useRouter()
  const { data: plantillas = [], isLoading } = usePlantillasCertificado()
  const { crear, actualizar, eliminar } = usePlantillasCertificadoMutation()
  const { enqueueSnackbar } = useSnackbar()

  const [createOpen, setCreateOpen] = useState(false)
  const [nombreNueva, setNombreNueva] = useState('')

  const handleCreate = async () => {
    if (!nombreNueva.trim()) {
      enqueueSnackbar('Ingresa un nombre para la plantilla', { variant: 'warning' })

      return
    }

    try {
      const nueva = await crear.mutateAsync({ nombre: nombreNueva.trim() })

      setCreateOpen(false)
      setNombreNueva('')
      router.push(`/admin/plantillas-certificado/${nueva.id}`)
    } catch {
      enqueueSnackbar('Error al crear la plantilla', { variant: 'error' })
    }
  }

  const handleToggle = async (p: PlantillaCertificado) => {
    try {
      await actualizar.mutateAsync({ id: p.id, data: { activo: !p.activo } })
      enqueueSnackbar(`Plantilla ${!p.activo ? 'activada' : 'desactivada'}`, { variant: 'success' })
    } catch {
      enqueueSnackbar('Error al cambiar el estado', { variant: 'error' })
    }
  }

  const handleDelete = async (p: PlantillaCertificado) => {
    if (!confirm(`¿Eliminar la plantilla "${p.nombre}"?`)) return

    try {
      await eliminar.mutateAsync(p.id)
      enqueueSnackbar('Plantilla eliminada', { variant: 'success' })
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'No se pudo eliminar. Puede estar en uso, desactívala en su lugar.', { variant: 'error' })
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Plantillas de Certificado Personalizadas'
          subheader='Sube el diseño de cara 1 y cara 2 de un certificado y coloca los campos dinámicos (nombre, curso, fechas, QR, firmas) donde quieras.'
          className='pbe-4'
          action={
            <Button variant='contained' startIcon={<i className='tabler-plus' />} onClick={() => setCreateOpen(true)}>
              Nueva plantilla
            </Button>
          }
        />

        <Box p={4} pt={0}>
          {isLoading ? (
            <Typography color='text.secondary'>Cargando...</Typography>
          ) : plantillas.length === 0 ? (
            <Typography color='text.secondary'>Aún no has creado ninguna plantilla personalizada.</Typography>
          ) : (
            <Grid container spacing={4}>
              {plantillas.map(p => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                  <Card variant='outlined' sx={{ height: '100%' }}>
                    <Box
                      onClick={() => router.push(`/admin/plantillas-certificado/${p.id}`)}
                      sx={{
                        aspectRatio: '297/210',
                        bgcolor: 'action.hover',
                        backgroundImage: p.cara_frente_url ? `url(${p.cara_frente_url})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {!p.cara_frente_url && <i className='tabler-photo-off' style={{ fontSize: 28, opacity: 0.4 }} />}
                    </Box>
                    <Box p={3}>
                      <Typography fontWeight={600} noWrap title={p.nombre}>{p.nombre}</Typography>
                      <Box display='flex' alignItems='center' justifyContent='space-between' mt={1}>
                        <Box display='flex' alignItems='center' gap={1}>
                          <Switch size='small' checked={p.activo} onChange={() => handleToggle(p)} />
                          <Chip label={p.activo ? 'Activa' : 'Inactiva'} color={p.activo ? 'success' : 'default'} variant='tonal' size='small' />
                        </Box>
                        <Box>
                          <IconButton size='small' onClick={() => router.push(`/admin/plantillas-certificado/${p.id}`)} title='Editar'>
                            <i className='tabler-edit text-[18px]' />
                          </IconButton>
                          <IconButton size='small' color='error' onClick={() => handleDelete(p)} title='Eliminar'>
                            <i className='tabler-trash text-[18px]' />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Card>

      <AppModal open={createOpen} handleClose={() => setCreateOpen(false)}>
        <Typography variant='h5' sx={{ mb: 4 }}>Nueva plantilla de certificado</Typography>
        <TextField
          fullWidth
          autoFocus
          label='Nombre de la plantilla'
          placeholder='Ej. Certificado corporativo 2026'
          value={nombreNueva}
          onChange={e => setNombreNueva(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <Box display='flex' justifyContent='flex-end' gap={2} mt={4}>
          <Button onClick={() => setCreateOpen(false)}>Cancelar</Button>
          <Button variant='contained' onClick={handleCreate} disabled={crear.isPending}>
            Continuar
          </Button>
        </Box>
      </AppModal>
    </>
  )
}
