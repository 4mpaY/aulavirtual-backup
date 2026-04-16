'use client'

import { useEffect, useState, type FormEvent } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem,
  Switch,
  FormControlLabel,
  Autocomplete,
  Chip,
  TextField,
  Typography
} from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { sanitizeDatetimeInput, toLocalDateInputValue } from '@/utils/functions/sanitizeDatetime'
import { useCuponMutation } from '../hooks/useCupones'
import type { Cupon, CursoOpcion } from '../entity/Cupon'

interface CuponFormProps {
  open: boolean
  handleClose: () => void
  cuponToEdit?: Cupon | null
  cursosDisponibles?: CursoOpcion[]
}

const CuponForm = ({ open, handleClose, cuponToEdit, cursosDisponibles = [] }: CuponFormProps) => {
  const { createCupon, updateCupon } = useCuponMutation()

  const [formData, setFormData] = useState({
    codigo: '',
    valor: '',
    tipo: 'PORCENTAJE',
    limite_uso: '',
    fecha_expiracion: '',
    esta_activo: true
  })

  const [cursosSeleccionados, setCursosSeleccionados] = useState<CursoOpcion[]>([])

  useEffect(() => {
    if (cuponToEdit) {
      setFormData({
        codigo: cuponToEdit.codigo,
        valor: cuponToEdit.valor.toString(),
        tipo: cuponToEdit.tipo,
        limite_uso: cuponToEdit.limite_uso?.toString() || '',
        fecha_expiracion: cuponToEdit.fecha_expiracion ? toLocalDateInputValue(cuponToEdit.fecha_expiracion) : '',
        esta_activo: cuponToEdit.esta_activo
      })

      // Restaurar cursos asignados al editar
      if (Array.isArray(cuponToEdit.cursos)) {
        setCursosSeleccionados(cuponToEdit.cursos.map(c => c.curso))
      } else {
        setCursosSeleccionados([])
      }
    } else {
      setFormData({
        codigo: '',
        valor: '',
        tipo: 'PORCENTAJE',
        limite_uso: '',
        fecha_expiracion: '',
        esta_activo: true
      })
      setCursosSeleccionados([])
    }
  }, [cuponToEdit, open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      valor: Number(formData.valor),
      limite_uso: formData.limite_uso ? Number(formData.limite_uso) : null,
      fecha_expiracion: sanitizeDatetimeInput(formData.fecha_expiracion),
      cursoIds: cursosSeleccionados.map(c => c.id)
    }

    try {
      if (cuponToEdit) {
        await updateCupon.mutateAsync({ id: cuponToEdit.id, data: payload })
        toast.success('Cupón actualizado correctamente')
      } else {
        await createCupon.mutateAsync(payload)
        toast.success('Cupón creado correctamente')
      }

      handleClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar el cupón')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>{cuponToEdit ? 'Editar Cupón' : 'Añadir Nuevo Cupón'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Código'
                placeholder='EJ: DESCUENTO10'
                value={formData.codigo}
                onChange={e => setFormData({ ...formData, codigo: e.target.value.toUpperCase() })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Valor'
                type='number'
                placeholder='10'
                value={formData.valor}
                onChange={e => setFormData({ ...formData, valor: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Tipo de Descuento'
                value={formData.tipo}
                onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                required
              >
                <MenuItem value='PORCENTAJE'>Porcentaje (%)</MenuItem>
                <MenuItem value='MONTO_FIJO'>Monto Fijo (S/)</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Límite de Uso (Opcional)'
                type='number'
                placeholder='100'
                value={formData.limite_uso}
                onChange={e => setFormData({ ...formData, limite_uso: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label='Fecha de Expiración (Opcional)'
                type='date'
                InputLabelProps={{ shrink: true }}
                value={formData.fecha_expiracion}
                onChange={e => setFormData({ ...formData, fecha_expiracion: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={cursosDisponibles}
                getOptionLabel={option => option.estado ? `${option.titulo} (${option.estado})` : option.titulo}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={cursosSeleccionados}
                onChange={(_, newValue) => setCursosSeleccionados(newValue)}

                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.titulo}
                      size='small'
                      {...getTagProps({ index })}
                      key={option.id}
                    />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label='Cursos Permitidos (Opcional)'
                    placeholder={cursosSeleccionados.length === 0 ? 'Aplica a todos los cursos' : ''}
                  />
                )}
                noOptionsText='No hay cursos publicados'
              />
              {cursosSeleccionados.length === 0 && (
                <Typography variant='caption' color='text.secondary' sx={{ mt: 0.5, display: 'block' }}>
                  Sin restricción: el cupón se aplicará a cualquier curso
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.esta_activo}
                    onChange={e => setFormData({ ...formData, esta_activo: e.target.checked })}
                  />
                }
                label='Cupón Activo'
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: theme => theme.spacing(3, 6, 6) }}>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant='contained' type='submit' disabled={createCupon.isPending || updateCupon.isPending}>
            {cuponToEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CuponForm
