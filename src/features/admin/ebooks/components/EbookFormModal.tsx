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
  Divider,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'

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

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Grid item xs={12}>
      <Typography variant='subtitle1' fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}
      <Divider sx={{ mt: 1.5 }} />
    </Grid>
  )
}

export const EbookFormModal = ({ open, handleClose, ebook }: Props) => {
  const createEbook = useCreateEbook()
  const updateEbook = useUpdateEbook()

  const [openMedia, setOpenMedia] = useState(false)
  const [openPdfMedia, setOpenPdfMedia] = useState(false)

  const [opcionesAvanzadas, setOpcionesAvanzadas] = useState(false)

  const { control, handleSubmit, reset, setValue, watch } = useForm<CreateEbookDto>({
    defaultValues: {
      titulo: '',
      descripcion: '',
      resena: '',
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
      editorial: '',
      anio_edicion: undefined,
      saga: '',
      idioma: 'Español',
    },
  })

  const esGratis = watch('es_gratis')
  const miniatura = watch('miniatura')
  const archivoPdf = watch('archivo_pdf')

  // Cada página individual del PDF tiene /Type /Page (sin 's')
  const contarPaginasPdf = async (url: string): Promise<number> => {
    try {
      const res = await fetch(url)
      const buffer = await res.arrayBuffer()
      const content = new TextDecoder('latin1').decode(buffer)
      const matches = content.match(/\/Type\s*\/Page[^s]/g)

      return matches ? matches.length : 0
    } catch {
      return 0
    }
  }

  useEffect(() => {
    if (ebook) {
      reset({
        titulo: ebook.titulo,
        descripcion: ebook.descripcion ?? '',
        resena: ebook.resena ?? '',
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
        editorial: ebook.editorial ?? '',
        anio_edicion: ebook.anio_edicion ?? undefined,
        saga: ebook.saga ?? '',
        idioma: ebook.idioma ?? 'Español',
      })
      setOpcionesAvanzadas(Boolean(ebook.editorial || ebook.anio_edicion || ebook.saga || (ebook.moneda && ebook.moneda !== 'PEN')))
    } else {
      reset({
        titulo: '',
        descripcion: '',
        resena: '',
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
        editorial: '',
        anio_edicion: undefined,
        saga: '',
        idioma: 'Español',
      })
      setOpcionesAvanzadas(false)
    }
  }, [ebook, open, reset])

  const handleSelectPdf = async (url: string) => {
    setValue('archivo_pdf', url, { shouldValidate: true })
    setOpenPdfMedia(false)

    const paginas = await contarPaginasPdf(url)

    if (paginas > 0) setValue('paginas', paginas)
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
          {/* ── Información básica ─────────────────────────────── */}
          <SectionHeader title='Información básica' />

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
                <CustomTextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label='Detalle (sinopsis)'
                  helperText='Se muestra en la pestaña "Detalle" de la página del ebook'
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name='resena'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  label='Reseña'
                  helperText='Opcional. Se muestra en la pestaña "Reseña"; si se deja vacío, esa pestaña no aparece'
                />
              )}
            />
          </Grid>

          {/* ── Contenido ───────────────────────────────────────── */}
          <SectionHeader title='Contenido' subtitle='Archivo que verá el lector' />

          <Grid item xs={12}>
            <Typography variant='subtitle2' mb={1}>Archivo PDF *</Typography>
            <Controller
              name='archivo_pdf'
              control={control}
              rules={{ required: 'El archivo PDF es requerido' }}
              render={({ fieldState }) => (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: fieldState.error ? 'error.main' : 'divider',
                    bgcolor: 'action.hover',
                  }}
                >
                  <Box display='flex' gap={2} alignItems='center' flexWrap='wrap'>
                    <Button variant='outlined' size='small' onClick={() => setOpenPdfMedia(true)}>
                      {archivoPdf ? 'Cambiar PDF' : 'Seleccionar PDF'}
                    </Button>
                    {archivoPdf && (
                      <Typography variant='caption' color='success.main'>
                        PDF cargado: {archivoPdf.split('/').pop()}
                      </Typography>
                    )}
                  </Box>
                  {fieldState.error && (
                    <Typography variant='caption' color='error.main' display='block' sx={{ mt: 1 }}>
                      {fieldState.error.message}
                    </Typography>
                  )}
                </Box>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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

          {/* ── Precio ──────────────────────────────────────────── */}
          <SectionHeader title='Precio' />

          <Grid item xs={12}>
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <Controller
                  name='precio_falso'
                  control={control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      type='number'
                      label='Precio tachado'
                      helperText='Opcional. Se muestra tachado junto al precio'
                      InputProps={{ startAdornment: <InputAdornment position='start'>S/</InputAdornment> }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
            </>
          )}
          {/* ── Portada (al final) ──────────────────────────────── */}
          <SectionHeader title='Portada' subtitle='Imagen de portada del ebook' />

          <Grid item xs={12}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 280,
                  aspectRatio: '2/3',
                  borderRadius: 2,
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid #e2e8f0',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {miniatura ? (
                  <img
                    src={miniatura}
                    alt='portada'
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <Typography variant='caption' color='text.disabled' textAlign='center' sx={{ px: 1 }}>
                    Sin imagen
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: '100%', flex: 1 }}>
                <Button fullWidth variant='outlined' onClick={() => setOpenMedia(true)}>
                  {miniatura ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </Button>
                <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 1.5 }}>
                  Tamaño recomendado: 800 × 1200 px (proporción 2:3, igual que la portada de un libro)
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* ── Opciones avanzadas ──────────────────────────────── */}
          <Grid item xs={12}>
            <Box
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2.5, bgcolor: 'action.hover' }}>
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Switch
                      checked={opcionesAvanzadas}
                      onChange={e => setOpcionesAvanzadas(e.target.checked)}
                    />
                  }
                  label={
                    <Typography variant='subtitle2' fontWeight={700}>
                      Opciones avanzadas
                    </Typography>
                  }
                />
                <Typography variant='caption' color='text.secondary' display='block' sx={{ ml: '52px', mt: -0.5 }}>
                  Moneda y datos editoriales opcionales (editorial, año de edición, saga, idioma)
                </Typography>
              </Box>

              {opcionesAvanzadas && (
                <Grid container spacing={3} sx={{ p: 2.5 }}>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='editorial'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Editorial' />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='saga'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          value={field.value ?? ''}
                          fullWidth
                          label='Saga / Colección'
                          placeholder='Ej: Diario de Greg'
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='anio_edicion'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          fullWidth
                          type='number'
                          label='Año de edición'
                          value={field.value ?? ''}
                          onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name='idioma'
                      control={control}
                      render={({ field }) => (
                        <CustomTextField {...field} value={field.value ?? ''} fullWidth label='Idioma' />
                      )}
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
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

      <MediaLibrary
        open={openPdfMedia}
        onClose={() => setOpenPdfMedia(false)}
        onSelect={handleSelectPdf}
        acceptType='PDF'
        title='Seleccionar PDF'
      />
    </AppModal>
  )
}
