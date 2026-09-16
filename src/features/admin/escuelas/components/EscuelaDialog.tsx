'use client'

import { useEffect, useState, useRef } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'
import axios from 'axios'

import CustomTextField from '@core/components/mui/TextField'
import type { CreateEscuelaDto, Escuela } from '../entity/Escuela'
import { useCreateEscuela, useUpdateEscuela } from '../hooks/useEscuelas'

interface EscuelaDialogProps {
  open: boolean
  onClose: () => void
  escuela?: Escuela | null
}

const ESTADOS = [
  { value: 'DISPONIBLE', label: 'Disponible' },
  { value: 'PROXIMAMENTE', label: 'Próximamente' },
  { value: 'MEDIANTE_ALIANZAS', label: 'Mediante alianzas' },
  { value: 'EN_DESARROLLO', label: 'En desarrollo' }
]

export const EscuelaDialog = ({ open, onClose, escuela }: EscuelaDialogProps) => {
  const createEscuela = useCreateEscuela()
  const updateEscuela = useUpdateEscuela()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)

  const { control, handleSubmit, reset, setValue, watch } = useForm<CreateEscuelaDto>({
    defaultValues: {
      nombre: '',
      slug: '',
      descripcion: '',
      imagen: '',
      estado: 'DISPONIBLE',
      orden: 0
    }
  })

  const currentImagen = watch('imagen')

  useEffect(() => {
    if (open) {
      if (escuela) {
        reset({
          nombre: escuela.nombre,
          slug: escuela.slug,
          descripcion: escuela.descripcion || '',
          imagen: escuela.imagen || '',
          estado: escuela.estado,
          orden: escuela.orden
        })
      } else {
        reset({
          nombre: '',
          slug: '',
          descripcion: '',
          imagen: '',
          estado: 'DISPONIBLE',
          orden: 0
        })
      }
    }
  }, [escuela, open, reset])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    try {
      setUploading(true)
      const formData = new FormData()

      formData.append('file', file)

      const res = await axios.post('/api/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const uploadedUrl = res.data?.result?.url || res.data?.url

      if (uploadedUrl) {
        setValue('imagen', uploadedUrl, { shouldValidate: true })
      } else {
        throw new Error('No se recibió la URL de la imagen')
      }
    } catch (err: any) {
      console.error('Error al subir imagen:', err)
      Swal.fire({
        title: 'Error',
        text: err?.response?.data?.message || 'Error al subir la imagen de portada',
        icon: 'error'
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveImage = () => {
    setValue('imagen', '')
  }

  const onSubmit = async (data: CreateEscuelaDto) => {
    try {
      if (escuela) {
        await updateEscuela.mutateAsync({ id: escuela.id, payload: data })
        Swal.fire({ title: '¡Éxito!', text: 'Escuela actualizada correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
      } else {
        await createEscuela.mutateAsync(data)
        Swal.fire({ title: '¡Éxito!', text: 'Escuela creada correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
      }

      onClose()
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al guardar la escuela', icon: 'error' })
    }
  }

  const handleTitleChange = (val: string) => {
    setValue('nombre', val)

    if (!escuela) {
      const slug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

      setValue('slug', slug)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{escuela ? 'Editar Escuela' : 'Nueva Escuela'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name='nombre'
                control={control}
                rules={{ required: 'El nombre es requerido' }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Nombre'
                    placeholder='Ej: Tecnología e Innovación'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='slug'
                control={control}
                rules={{ required: 'El slug es requerido' }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Slug'
                    placeholder='ej-tecnologia-e-innovacion'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='descripcion'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    rows={3}
                    multiline
                    label='Descripción'
                    placeholder='Escribe una descripción corta de la escuela...'
                  />
                )}
              />
            </Grid>

            {/* Subida de Imagen de Portada con Vista Previa */}
            <Grid item xs={12}>
              <Typography variant='body2' fontWeight={600} sx={{ mb: 1.5 }}>
                Imagen de Portada (Fondo)
              </Typography>

              <input
                ref={fileInputRef}
                type='file'
                accept='image/jpeg,image/png,image/webp,image/gif'
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {currentImagen ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: 180,
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundImage: `url(${currentImagen})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    p: 1.5
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 1, p: 0.5 }}>
                    <Tooltip title='Cambiar Imagen'>
                      <IconButton
                        size='small'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        sx={{ color: '#fff' }}
                      >
                        <i className='tabler-photo-edit text-[18px]' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Eliminar Imagen'>
                      <IconButton
                        size='small'
                        onClick={handleRemoveImage}
                        disabled={uploading}
                        sx={{ color: '#ff4d4f' }}
                      >
                        <i className='tabler-trash text-[18px]' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ) : (
                <Box
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  sx={{
                    width: '100%',
                    height: 140,
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: uploading ? 'default' : 'pointer',
                    backgroundColor: 'action.hover',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.selected'
                    }
                  }}
                >
                  {uploading ? (
                    <CircularProgress size={32} />
                  ) : (
                    <>
                      <i className='tabler-cloud-upload text-[36px] text-textSecondary mb-2' />
                      <Typography variant='body2' fontWeight={600}>
                        Haz clic para subir una imagen de portada
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        Soporta JPG, PNG, WEBP o GIF
                      </Typography>
                    </>
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Controller
                name='estado'
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Estado'
                    value={field.value}
                    onChange={field.onChange}
                  >
                    {ESTADOS.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ pt: 2, pb: 4, px: 6 }}>
          <Button onClick={onClose} color='secondary' variant='outlined'>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' color='primary' disabled={uploading}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
