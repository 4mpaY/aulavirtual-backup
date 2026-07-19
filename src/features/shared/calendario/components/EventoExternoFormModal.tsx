'use client'

import { useEffect } from 'react'

import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'

import type { EventoExterno } from '../entity/EventoExterno'
import { useCreateEventoExterno, useEditEventoExterno, useDeleteEventoExterno } from '../hooks/useEventoExterno'

const PALETA_COLORES = ['#6A1B9A', '#1565C0', '#2E7D32', '#C62828', '#E65100', '#00838F']

const eventoExternoFormSchema = z
  .object({
    titulo: z.string().trim().min(2, 'El título debe tener al menos 2 caracteres').max(150, 'Máximo 150 caracteres'),
    descripcion: z.string().trim().max(1000, 'Máximo 1000 caracteres').optional(),
    fecha_inicio: z.string().min(1, 'La fecha de inicio es requerida'),
    fecha_fin: z.string().optional(),
    color: z.string()
  })
  .refine(
    data => !data.fecha_fin || !data.fecha_inicio || new Date(data.fecha_fin) >= new Date(data.fecha_inicio),
    { message: 'La fecha de fin no puede ser anterior a la fecha de inicio', path: ['fecha_fin'] }
  )

type EventoExternoFormValues = z.infer<typeof eventoExternoFormSchema>

const DEFAULT_VALUES: EventoExternoFormValues = {
  titulo: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  color: PALETA_COLORES[0]
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

type Props = {
  open: boolean
  handleClose: () => void
  eventoExterno?: EventoExterno | null
}

export function EventoExternoFormModal({ open, handleClose, eventoExterno }: Props) {
  const esEdicion = !!eventoExterno

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EventoExternoFormValues>({
    resolver: zodResolver(eventoExternoFormSchema),
    defaultValues: DEFAULT_VALUES
  })

  const colorActivo = watch('color')

  const createEvento = useCreateEventoExterno()
  const editEvento = useEditEventoExterno()
  const deleteEvento = useDeleteEventoExterno()

  const loading = createEvento.isPending || editEvento.isPending

  useEffect(() => {
    if (!open) return

    if (eventoExterno) {
      reset({
        titulo: eventoExterno.titulo,
        descripcion: eventoExterno.descripcion ?? '',
        fecha_inicio: toDatetimeLocal(eventoExterno.fecha_inicio),
        fecha_fin: eventoExterno.fecha_fin ? toDatetimeLocal(eventoExterno.fecha_fin) : '',
        color: eventoExterno.color ?? PALETA_COLORES[0]
      })
    } else {
      reset(DEFAULT_VALUES)
    }
  }, [open, eventoExterno, reset])

  const onSubmit = async (values: EventoExternoFormValues) => {
    const data = {
      titulo: values.titulo,
      descripcion: values.descripcion || null,
      fecha_inicio: new Date(values.fecha_inicio),
      fecha_fin: values.fecha_fin ? new Date(values.fecha_fin) : null,
      todo_el_dia: false,
      color: values.color
    }

    try {
      if (esEdicion && eventoExterno) {
        await editEvento.mutateAsync({ id: eventoExterno.id, data })
        toast.success('Evento actualizado correctamente')
      } else {
        await createEvento.mutateAsync(data)
        toast.success('Evento creado correctamente')
      }

      handleClose()
    } catch (error: any) {
      toast.error(error?.message || 'Ocurrió un error al guardar el evento')
    }
  }

  const handleDelete = async () => {
    if (!eventoExterno) return

    const result = await Swal.fire({
      title: '¿Eliminar evento?',
      text: 'Esta acción no se puede revertir.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (!result.isConfirmed) return

    try {
      await deleteEvento.mutateAsync(eventoExterno.id)
      Swal.fire({ title: 'Eliminado', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 })
      handleClose()
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo eliminar el evento', icon: 'error' })
    }
  }

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Typography variant='h6' fontWeight={700} sx={{ mb: 3 }}>
        {esEdicion ? 'Editar evento' : 'Nuevo evento'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Controller
            name='titulo'
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                label='Título *'
                error={!!errors.titulo}
                helperText={errors.titulo?.message}
              />
            )}
          />

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
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
              />
            )}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Controller
              name='fecha_inicio'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='datetime-local'
                  label='Inicio *'
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.fecha_inicio}
                  helperText={errors.fecha_inicio?.message}
                  sx={{ flex: 1, minWidth: 200 }}
                />
              )}
            />

            <Controller
              name='fecha_fin'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  type='datetime-local'
                  label='Fin'
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.fecha_fin}
                  helperText={errors.fecha_fin?.message}
                  sx={{ flex: 1, minWidth: 200 }}
                />
              )}
            />
          </Box>

          <Box>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 1 }}>
              Color
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {PALETA_COLORES.map(color => (
                <Box
                  key={color}
                  onClick={() => setValue('color', color)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: colorActivo === color ? 'text.primary' : 'transparent',
                    outline: '1px solid',
                    outlineColor: 'divider',
                    transition: 'transform 0.15s',
                    '&:hover': { transform: 'scale(1.1)' }
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'space-between' }}>
            <Box>
              {esEdicion && (
                <Button
                  variant='outlined'
                  color='error'
                  disabled={loading || deleteEvento.isPending}
                  onClick={handleDelete}
                  startIcon={<i className='tabler-trash' />}
                >
                  Eliminar
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant='outlined' onClick={handleClose} disabled={loading}>
                Cancelar
              </Button>
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress size={22} color='inherit' /> : 'Guardar'}
              </Button>
            </Box>
          </Box>
        </Stack>
      </form>
    </AppModal>
  )
}
