'use client'

import { useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import Swal from 'sweetalert2'

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

  const { control, handleSubmit, reset, setValue } = useForm<CreateEscuelaDto>({
    defaultValues: {
      nombre: '',
      slug: '',
      descripcion: '',
      estado: 'DISPONIBLE',
      orden: 0
    }
  })

  useEffect(() => {
    if (escuela) {
      reset({
        nombre: escuela.nombre,
        slug: escuela.slug,
        descripcion: escuela.descripcion || '',
        estado: escuela.estado,
        orden: escuela.orden
      })
    } else {
      reset({
        nombre: '',
        slug: '',
        descripcion: '',
        estado: 'DISPONIBLE',
        orden: 0
      })
    }
  }, [escuela, reset])

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
        <DialogActions>
          <Button onClick={onClose} color='secondary' variant='outlined'>
            Cancelar
          </Button>
          <Button type='submit' variant='contained' color='primary'>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
