'use client'

import React, { useEffect, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import Swal from 'sweetalert2'

import CustomTextField from '@core/components/mui/TextField'
import MediaLibrary from '@/features/admin/cursos/components/MediaLibrary'

import type { Ruta, CreateRutaDto, Benefit } from '../entity/Ruta'
import { useCreateRuta, useUpdateRuta } from '../hooks/useRutas'

const DEFAULT_BENEFITS: Benefit[] = [
  { title: 'Secuencia lógica', desc: 'Contenido progresivo diseñado por expertos para tu maestría.', icon: 'tabler-list-numbers' },
  { title: 'Certificaciones', desc: 'Podrás solicitar certificados por cada nivel completado.', icon: 'tabler-certificate' },
  { title: 'Acceso total', desc: 'Estudia a tu propio ritmo con acceso de por vida.', icon: 'tabler-device-laptop' },
  { title: 'Soporte premium', desc: 'Acompañamiento constante durante todo el proceso.', icon: 'tabler-headset' }
]

interface RutaDialogProps {
  open: boolean
  onClose: () => void
  ruta?: Ruta | null
}

export const RutaDialog: React.FC<RutaDialogProps> = ({ open, onClose, ruta }) => {
  const createRuta = useCreateRuta()
  const updateRuta = useUpdateRuta()

  const [openMedia, setOpenMedia] = useState(false)

  const { control, handleSubmit, reset, setValue } = useForm<CreateRutaDto>({
    defaultValues: {
      titulo: '',
      slug: '',
      descripcion: '',
      miniatura: '',
      beneficios: DEFAULT_BENEFITS,
      esta_activo: true
    }
  })

  const { fields: benefitFields } = useFieldArray({
    control,
    name: 'beneficios'
  })


  useEffect(() => {
    if (ruta) {
      reset({
        titulo: ruta.titulo,
        slug: ruta.slug,
        descripcion: ruta.descripcion || '',
        miniatura: ruta.miniatura || '',
        beneficios: (ruta.beneficios && ruta.beneficios.length > 0) ? (ruta.beneficios as Benefit[]) : DEFAULT_BENEFITS,
        esta_activo: ruta.esta_activo
      })
    } else {
      reset({
        titulo: '',
        slug: '',
        descripcion: '',
        miniatura: '',
        beneficios: DEFAULT_BENEFITS,
        esta_activo: true
      })
    }
  }, [ruta, reset])

  const onSubmit = async (data: CreateRutaDto) => {
    try {
      if (ruta) {

        await updateRuta.mutateAsync({ id: ruta.id, payload: data })

        Swal.fire({ title: '¡Éxito!', text: 'Ruta actualizada correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
      } else {
        await createRuta.mutateAsync(data)

        Swal.fire({ title: '¡Éxito!', text: 'Ruta creada correctamente', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
      }

      onClose()
    } catch (err: any) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Error al guardar la ruta', icon: 'error' })
    }
  }

  // Generar slug automáticamente desde el título
  const handleTitleChange = (val: string) => {
    setValue('titulo', val)

    if (!ruta) {
      
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
        <DialogTitle>{ruta ? 'Editar Ruta de Aprendizaje' : 'Nueva Ruta de Aprendizaje'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name='titulo'
                control={control}
                rules={{ required: 'El título es requerido' }}
                
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Título'
                    placeholder='Ej: Especialista en Backend con Node.js'
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
                    placeholder='ej-especialista-backend'
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
                    multiline
                    rows={3}
                    label='Descripción'
                    placeholder='Describe el objetivo de esta ruta...'
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>Imagen de Portada (Miniatura)</Typography>
              <Controller
                name='miniatura'
                control={control}
                render={({ field }) => (
                  <Box>
                    {field.value ? (
                      <Box sx={{ position: 'relative', width: '100%', borderRadius: 1, overflow: 'hidden', mb: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                        <img
                          src={field.value}
                          alt='Vista previa'
                          style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', maxHeight: 200 }}
                        />
                        <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
                          <IconButton
                            size='small'
                            sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
                            onClick={() => setValue('miniatura', '')}
                          >
                            <i className='tabler-trash text-error text-sm' />
                          </IconButton>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        onClick={() => setOpenMedia(true)}
                        sx={{
                          width: '100%',
                          height: 100,
                          borderRadius: 1,
                          border: '1px dashed',
                          borderColor: 'divider',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          bgcolor: 'action.hover',
                          mb: 2,
                          '&:hover': { borderColor: 'primary.main' }
                        }}
                      >
                        <i className='tabler-photo-plus text-xl text-textDisabled' />
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>Click para seleccionar imagen</Typography>
                      </Box>
                    )}
                    <Button
                      variant='outlined'
                      size='small'
                      fullWidth
                      startIcon={<i className='tabler-photo' />}
                      onClick={() => setOpenMedia(true)}
                    >
                      {field.value ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                    </Button>
                    <MediaLibrary
                      open={openMedia}
                      onClose={() => setOpenMedia(false)}
                      onSelect={(url) => {
                        setValue('miniatura', url)
                        setOpenMedia(false)
                      }}
                    />
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='esta_activo'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth label='Estado'>
                    <MenuItem value={true as any}>Activo (Visible en web)</MenuItem>
                    <MenuItem value={false as any}>Inactivo (Borrador)</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Beneficios Section */}
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 2, mt: 4, fontWeight: 700 }}>Beneficios (4 Tarjetas)</Typography>
              <Typography variant='caption' sx={{ mb: 4, display: 'block', color: 'text.secondary' }}>
                Configura los 4 puntos clave que se muestran en el detalle de la ruta.
              </Typography>
              
            <Grid container spacing={4}>
                {benefitFields.map((field, index) => (
                  <Grid item xs={12} key={field.id}>
                    <Box sx={{ p: 4, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'action.hover' }}>
                      <Typography variant='subtitle2' sx={{ mb: 3, fontWeight: 800 }}>Tarjeta {index + 1}</Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Controller
                            name={`beneficios.${index}.icon`}
                            control={control}
                            rules={{ required: 'Icono requerido' }}
                            render={({ field: iconField, fieldState }) => (
                              <CustomTextField
                                {...iconField}
                                fullWidth
                                label='Icono (Tabler)'
                                placeholder='tabler-star'
                                size='small'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <Controller
                            name={`beneficios.${index}.title`}
                            control={control}
                            rules={{ required: 'Título requerido' }}
                            render={({ field: titleField, fieldState }) => (
                              <CustomTextField
                                {...titleField}
                                fullWidth
                                label='Título'
                                placeholder='Título del beneficio'
                                size='small'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Controller
                            name={`beneficios.${index}.desc`}
                            control={control}
                            rules={{ required: 'Descripción requerida' }}
                            render={({ field: descField, fieldState }) => (
                              <CustomTextField
                                {...descField}
                                fullWidth
                                multiline
                                rows={2}
                                label='Descripción'
                                placeholder='Breve descripción'
                                size='small'
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color='secondary'>Cancelar</Button>
          <Button type='submit' variant='contained' disabled={createRuta.isPending || updateRuta.isPending}>
            {ruta ? 'Actualizar' : 'Crear Ruta'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
