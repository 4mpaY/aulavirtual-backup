'use client'

import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  IconButton,
  Switch,
  CircularProgress,
  Paper,
  Stack
} from '@mui/material'
import { useSnackbar } from 'notistack'

import { useMetodosPagoMutation } from '../hooks/useMetodosPago'
import type { MetodoPagoManual } from '../entity/MetodoPagoManual'
import MediaLibrary from '../../cursos/components/MediaLibrary'

const DEFAULT: Partial<MetodoPagoManual> = {
  nombre: '',
  nombre_banco: '',
  numero_cuenta: '',
  cci: '',
  descripcion: '',
  imagen_url: '',
  orden: 0,
  estado: true
}

interface Props {
  open: boolean
  metodo?: MetodoPagoManual | null
  onClose: () => void
}

export default function MetodoPagoForm({ open, metodo, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const { crear, actualizar } = useMetodosPagoMutation()
  const [form, setForm] = useState<Partial<MetodoPagoManual>>(DEFAULT)
  const [showMedia, setShowMedia] = useState(false)
  const [errors, setErrors] = useState<{ nombre_banco?: string; numero_cuenta?: string }>({})

  useEffect(() => {
    setForm(metodo ? { ...metodo } : DEFAULT)
    setErrors({})
  }, [metodo, open])

  const set = (field: keyof MetodoPagoManual, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const isLoading = crear.isPending || actualizar.isPending
  const isEditing = !!metodo?.id

  const validate = () => {
    const e: typeof errors = {}

    if (!form.nombre_banco?.trim()) e.nombre_banco = 'El nombre del banco es obligatorio'
    if (!form.numero_cuenta?.trim()) e.numero_cuenta = 'El número de cuenta es obligatorio'
    setErrors(e)

    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    const payload = {
      ...form,
      nombre: form.nombre_banco || form.nombre || ''
    }

    try {
      if (isEditing) {
        await actualizar.mutateAsync({ id: metodo.id, data: payload })
        enqueueSnackbar('Método actualizado correctamente', { variant: 'success' })
      } else {
        await crear.mutateAsync(payload)
        enqueueSnackbar('Método creado correctamente', { variant: 'success' })
      }

      onClose()
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar el método', { variant: 'error' })
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='sm'
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {/* Header personalizado */}
        <Box sx={{ px: 3, pt: 3, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant='h6' fontWeight={700}>
            {isEditing ? 'Editar Método de pago' : 'Añadir Método de pago'}
          </Typography>
          <IconButton onClick={onClose} size='small' sx={{ color: 'text.secondary' }}>
            <i className='tabler-x' style={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <DialogContent sx={{ px: 3, pb: 2 }}>
          <Grid container spacing={2}>

            {/* Nombre del Banco + Número de Cuenta */}
            <Grid item xs={12} sm={6}>
              <TextField
                label='Nombre del Banco'
                fullWidth
                required
                placeholder='Ej: Yape, Plin, BCP,...'
                value={form.nombre_banco || ''}
                onChange={e => {
                  set('nombre_banco', e.target.value)
                  if (errors.nombre_banco) setErrors(p => ({ ...p, nombre_banco: undefined }))
                }}
                error={!!errors.nombre_banco}
                helperText={errors.nombre_banco}
                InputLabelProps={{ sx: { color: errors.nombre_banco ? 'error.main' : undefined } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label='Número de Cuenta'
                fullWidth
                required
                placeholder='Ej: 9999999999'
                value={form.numero_cuenta || ''}
                onChange={e => {
                  set('numero_cuenta', e.target.value)
                  if (errors.numero_cuenta) setErrors(p => ({ ...p, numero_cuenta: undefined }))
                }}
                error={!!errors.numero_cuenta}
                helperText={errors.numero_cuenta}
              />
            </Grid>

            {/* CCI */}
            <Grid item xs={12}>
              <TextField
                label='CCI (opcional)'
                fullWidth
                placeholder='Ej: 00219100123456789012'
                value={form.cci || ''}
                onChange={e => set('cci', e.target.value)}
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                label='Descripción'
                fullWidth
                multiline
                rows={3}
                placeholder='Información adicional sobre el método de pago...'
                value={form.descripcion || ''}
                onChange={e => set('descripcion', e.target.value)}
              />
            </Grid>

            {/* Imagen */}
            <Grid item xs={12}>
              <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 1 }}>
                <Typography variant='subtitle2' fontWeight={600}>Imágenes</Typography>
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<i className='tabler-photo' style={{ fontSize: 16 }} />}
                  onClick={() => setShowMedia(true)}
                >
                  Seleccionar
                </Button>
              </Stack>

              <Paper
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                  transition: 'all 0.2s'
                }}
                onClick={() => setShowMedia(true)}
              >
                {form.imagen_url ? (
                  <Box
                    component='img'
                    src={form.imagen_url}
                    alt='Preview'
                    sx={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain', borderRadius: 1 }}
                  />
                ) : (
                  <>
                    <Box sx={{ color: 'text.disabled', mb: 1 }}>
                      <i className='tabler-photo-off' style={{ fontSize: 40 }} />
                    </Box>
                    <Typography variant='caption' color='text.disabled' display='block'>
                      No hay imágenes seleccionadas
                    </Typography>
                    <Typography
                      variant='caption'
                      color='primary.main'
                      fontWeight={600}
                      sx={{ mt: 0.5, cursor: 'pointer' }}
                    >
                      Seleccionar imágenes
                    </Typography>
                  </>
                )}
              </Paper>
            </Grid>

            {/* Estado — toggle con estilo destacado */}
            <Grid item xs={12}>
              <Paper
                variant='outlined'
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  borderColor: form.estado ? 'warning.main' : 'divider',
                  bgcolor: form.estado ? 'warning.lighterOpacity' : 'transparent',
                  transition: 'all 0.2s'
                }}
              >
                <Stack direction='row' alignItems='center' spacing={2}>
                  <Box
                    sx={{
                      width: 40, height: 40, borderRadius: 1, flexShrink: 0,
                      bgcolor: 'warning.lighterOpacity',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <i className='tabler-qrcode' style={{ fontSize: 22 }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='subtitle2' fontWeight={700}>Mostrar en checkout</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Este método de pago será visible para el estudiante en el checkout
                    </Typography>
                  </Box>
                  <Switch
                    checked={form.estado ?? true}
                    onChange={e => set('estado', e.target.checked)}
                    color='warning'
                  />
                </Stack>
              </Paper>
            </Grid>

          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant='outlined'
            color='error'
            fullWidth
            sx={{ borderRadius: 2, py: 1.2 }}
          >
            Cancelar
          </Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={isLoading}
            fullWidth
            startIcon={isLoading ? <CircularProgress size={16} color='inherit' /> : <i className='tabler-plus' />}
            sx={{ borderRadius: 2, py: 1.2, fontWeight: 700 }}
          >
            {isLoading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Añadir'}
          </Button>
        </DialogActions>
      </Dialog>

      <MediaLibrary
        open={showMedia}
        onClose={() => setShowMedia(false)}
        onSelect={(url: string) => {
          set('imagen_url', url)
          setShowMedia(false)
        }}
      />
    </>
  )
}
