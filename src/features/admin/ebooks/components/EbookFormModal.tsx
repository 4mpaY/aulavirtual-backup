'use client'

import { useEffect, useState } from 'react'

import {
  Button,
  Grid,
  MenuItem,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  InputAdornment,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'
import axios from 'axios'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import MediaLibrary from '@/features/admin/cursos/components/MediaLibrary'

import type { Ebook, CreateEbookDto } from '../entity/Ebook'
import { useCreateEbook, useUpdateEbook } from '../hooks/useEbooks'

interface Props {
  open: boolean
  handleClose: () => void
  ebook?: Ebook | null
}

export const EbookFormModal = ({ open, handleClose, ebook }: Props) => {
  const createEbook = useCreateEbook()
  const updateEbook = useUpdateEbook()

  const [openMedia, setOpenMedia] = useState(false)
  const [uploading, setUploading] = useState(false)

  const { control, handleSubmit, reset, setValue, watch } = useForm<CreateEbookDto>({
    defaultValues: {
      titulo: '',
      descripcion: '',
      autor: '',
      miniatura: '',
      archivo_pdf: '',
      precio: 0,
      precio_falso: 0,
      moneda: 'PEN',
      es_gratis: false,
      paginas: undefined,
      genero: '',
      estado: 'BORRADOR',
    },
  })

  const esGratis = watch('es_gratis')
  const miniatura = watch('miniatura')
  const archivoPdf = watch('archivo_pdf')

  const contarPaginasPdf = (file: File): Promise<number> =>
    new Promise(resolve => {
      const reader = new FileReader()

      // Cada página individual tiene /Type /Page (sin 's')
      reader.onload = e => {
        const content = e.target?.result as string
        const matches = content.match(/\/Type\s*\/Page[^s]/g)

        resolve(matches ? matches.length : 0)
      }

      reader.readAsText(file, 'latin1')
    })

  useEffect(() => {
    if (ebook) {
      reset({
        titulo: ebook.titulo,
        descripcion: ebook.descripcion ?? '',
        autor: ebook.autor ?? '',
        miniatura: ebook.miniatura ?? '',
        archivo_pdf: ebook.archivo_pdf,
        precio: Number(ebook.precio),
        precio_falso: Number(ebook.precio_falso),
        moneda: ebook.moneda,
        es_gratis: ebook.es_gratis,
        paginas: ebook.paginas ?? undefined,
        genero: ebook.genero ?? '',
        estado: ebook.estado,
      })
    } else {
      reset({
        titulo: '',
        descripcion: '',
        autor: '',
        miniatura: '',
        archivo_pdf: '',
        precio: 0,
        precio_falso: 0,
        moneda: 'PEN',
        es_gratis: false,
        paginas: undefined,
        genero: '',
        estado: 'BORRADOR',
      })
    }
  }, [ebook, open, reset])

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file || file.type !== 'application/pdf') return

    setUploading(true)

    try {
      // Contar páginas antes de subir
      const paginas = await contarPaginasPdf(file)

      if (paginas > 0) setValue('paginas', paginas)

      const formData = new FormData()

      formData.append('file', file)

      const { data } = await axios.post('/api/media', formData)

      setValue('archivo_pdf', data.result?.url ?? data.url, { shouldValidate: true })
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo subir el PDF', icon: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (values: CreateEbookDto) => {
    try {
      if (ebook) {
        await updateEbook.mutateAsync({ id: ebook.id, payload: values })
      } else {
        await createEbook.mutateAsync(values)
      }

      Swal.fire({
        title: ebook ? 'Ebook actualizado' : 'Ebook creado',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })

      handleClose()
    } catch (err: any) {
      const msg = err?.error ?? err?.message ?? err?.result?.message ?? 'Error al guardar el ebook'

      Swal.fire({ title: 'Error', text: msg, icon: 'error' })
    }
  }

  return (
    <AppModal open={open} handleClose={handleClose} sx={{ maxWidth: 760 }}>
      <Typography variant='h5' fontWeight={700} mb={4}>
        {ebook ? 'Editar Ebook' : 'Nuevo Ebook'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
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
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='autor'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth label='Autor' />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name='genero'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Género'
                  placeholder='Ej: Ficción, Ciencia, Historia, Autoayuda...'
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name='descripcion'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} fullWidth multiline rows={3} label='Reseña' />
              )}
            />
          </Grid>

          {/* Miniatura */}
          <Grid item xs={12}>
            <Typography variant='subtitle2' mb={1}>Miniatura (portada)</Typography>
            {miniatura ? (
              <Box mb={2} display='flex' alignItems='flex-end' gap={2}>
                <img
                  src={miniatura}
                  alt='portada'
                  style={{ width: 60, aspectRatio: '2/3', borderRadius: 8, objectFit: 'cover', display: 'block', border: '1px solid #e2e8f0' }}
                />
                <Button variant='outlined' size='small' onClick={() => setOpenMedia(true)}>
                  Cambiar imagen
                </Button>
              </Box>
            ) : (
              <Box mb={1}>
                <Button variant='outlined' size='small' onClick={() => setOpenMedia(true)}>
                  Seleccionar imagen
                </Button>
              </Box>
            )}
            <Typography variant='caption' color='text.secondary'>
              Tamaño recomendado: 800 × 1200 px (proporción 2:3, igual que la portada de un libro)
            </Typography>
          </Grid>

          {/* Archivo PDF */}
          <Grid item xs={12}>
            <Typography variant='subtitle2' mb={1}>Archivo PDF *</Typography>
            {archivoPdf && (
              <Typography variant='caption' color='success.main' display='block' mb={1}>
                PDF cargado: {archivoPdf.split('/').pop()}
              </Typography>
            )}
            <Box display='flex' gap={2} alignItems='center'>
              <Button
                variant='outlined'
                component='label'
                size='small'
                disabled={uploading}
              >
                {uploading ? 'Subiendo...' : 'Subir PDF'}
                <input type='file' accept='application/pdf' hidden onChange={handlePdfUpload} />
              </Button>
              <Typography variant='caption' color='text.secondary'>o pegar URL:</Typography>
              <Controller
                name='archivo_pdf'
                control={control}
                rules={{ required: 'El archivo PDF es requerido' }}
                render={({ field, fieldState }) => (
                  <CustomTextField
                    {...field}
                    size='small'
                    placeholder='https://...'
                    sx={{ flex: 1 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name='es_gratis'
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={e => {
                        field.onChange(e.target.checked)

                        if (e.target.checked) {
                          setValue('precio', 0)
                          setValue('precio_falso', 0)
                        }
                      }}
                    />
                  }
                  label='Es gratis'
                />
              )}
            />
          </Grid>

          {!esGratis && (
            <>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='moneda'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField {...field} select fullWidth label='Moneda'>
                      <MenuItem value='PEN'>PEN (Soles)</MenuItem>
                      <MenuItem value='USD'>USD (Dólares)</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='precio'
                  control={control}
                  rules={{ validate: v => Number(v) > 0 || 'El precio debe ser mayor a 0' }}
                  render={({ field, fieldState }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label='Precio'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{ startAdornment: <InputAdornment position='start'>S/</InputAdornment> }}
                      inputProps={{ min: 0.01, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Controller
                  name='precio_falso'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label='Precio tachado'
                      InputProps={{ startAdornment: <InputAdornment position='start'>S/</InputAdornment> }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} sm={4}>
            <Controller
              name='paginas'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='number'
                  label='N° de páginas'
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  helperText='Se calcula automáticamente al subir el PDF'
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name='estado'
              control={control}
              render={({ field }) => (
                <CustomTextField {...field} select fullWidth label='Estado'>
                  <MenuItem value='BORRADOR'>Borrador</MenuItem>
                  <MenuItem value='PUBLICADO'>Publicado</MenuItem>
                  <MenuItem value='ARCHIVADO'>Archivado</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='flex-end' gap={2}>
            <Button variant='outlined' color='secondary' onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={createEbook.isPending || updateEbook.isPending}
            >
              {ebook ? 'Guardar cambios' : 'Crear ebook'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <MediaLibrary
        open={openMedia}
        onClose={() => setOpenMedia(false)}
        onSelect={url => {
          setValue('miniatura', url)
          setOpenMedia(false)
        }}
        acceptType='IMAGEN'
        title='Seleccionar portada'
      />
    </AppModal>
  )
}
