'use client'

import { useEffect, useState, type FormEvent } from 'react'

import {
  Button,
  Grid,
  MenuItem,
  Switch,
  FormControlLabel,
  Autocomplete,
  Chip,
  TextField,
  Typography,
  Box
} from '@mui/material'

import { toast } from 'react-toastify'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@/@core/components/mui/TextField'
import { usePlanSuscripcionMutation } from '../hooks/usePlanesSuscripcion'
import type { PlanSuscripcion, IntervaloSuscripcion } from '../entity/PlanSuscripcion'

interface CursoOpcion {
  id: string
  titulo: string
  estado?: string
}

interface PlanSuscripcionFormProps {
  open: boolean
  handleClose: () => void
  planToEdit?: PlanSuscripcion | null
  cursosDisponibles?: CursoOpcion[]
}

const INTERVALOS: { value: IntervaloSuscripcion; label: string }[] = [
  { value: 'MENSUAL', label: 'Mensual' },
  { value: 'TRIMESTRAL', label: 'Trimestral' },
  { value: 'SEMESTRAL', label: 'Semestral' },
  { value: 'ANUAL', label: 'Anual' }
]

const initialForm = {
  nombre: '',
  descripcion: '',
  precio: '',
  moneda: 'PEN',
  intervalo: 'MENSUAL' as IntervaloSuscripcion,
  dias_prueba: '0',
  esta_activo: true
}

const PlanSuscripcionForm = ({ open, handleClose, planToEdit, cursosDisponibles = [] }: PlanSuscripcionFormProps) => {
  const { createPlan, updatePlan } = usePlanSuscripcionMutation()
  const [formData, setFormData] = useState(initialForm)
  const [cursosSeleccionados, setCursosSeleccionados] = useState<CursoOpcion[]>([])

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        nombre: planToEdit.nombre,
        descripcion: planToEdit.descripcion ?? '',
        precio: String(planToEdit.precio),
        moneda: planToEdit.moneda,
        intervalo: planToEdit.intervalo,
        dias_prueba: String(planToEdit.dias_prueba),
        esta_activo: planToEdit.esta_activo
      })
      setCursosSeleccionados(planToEdit.cursos?.map(c => c.curso) ?? [])
    } else {
      setFormData(initialForm)
      setCursosSeleccionados([])
    }
  }, [planToEdit, open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (cursosSeleccionados.length === 0) {
      toast.error('Debes seleccionar al menos un curso')

      return
    }

    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion || null,
      precio: Number(formData.precio),
      moneda: formData.moneda,
      intervalo: formData.intervalo,
      dias_prueba: Number(formData.dias_prueba),
      esta_activo: formData.esta_activo,
      cursoIds: cursosSeleccionados.map(c => c.id)
    }

    try {
      if (planToEdit) {
        await updatePlan.mutateAsync({ id: planToEdit.id, data: payload })
        toast.success('Plan actualizado correctamente')
      } else {
        await createPlan.mutateAsync(payload)
        toast.success('Plan creado correctamente')
      }

      handleClose()
    } catch (error: any) {
      toast.error(error?.message || 'Error al guardar el plan')
    }
  }

  const isPending = createPlan.isPending || updatePlan.isPending
  const isEditing = !!planToEdit

  return (
    <AppModal open={open} handleClose={handleClose}>
      <Typography variant='h5' mb={4}>
        {planToEdit ? 'Editar Plan de Suscripción' : 'Nuevo Plan de Suscripción'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              label='Nombre del Plan'
              placeholder='Ej: Plan Mensual Premium'
              value={formData.nombre}
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextField
              fullWidth
              multiline
              rows={2}
              label='Descripción (Opcional)'
              placeholder='Describe qué incluye este plan'
              value={formData.descripcion}
              onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              label='Precio'
              type='number'
              placeholder='49.99'
              inputProps={{ min: 0, step: '0.01' }}
              value={formData.precio}
              onChange={e => setFormData({ ...formData, precio: e.target.value })}
              required
              disabled={isEditing}
              helperText={isEditing ? 'El precio no se puede modificar en Culqi' : undefined}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              select
              fullWidth
              label='Moneda'
              value={formData.moneda}
              onChange={e => setFormData({ ...formData, moneda: e.target.value })}
              disabled={isEditing}
            >
              <MenuItem value='PEN'>PEN (Soles)</MenuItem>
              <MenuItem value='USD'>USD (Dólares)</MenuItem>
            </CustomTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              select
              fullWidth
              label='Intervalo de Cobro'
              value={formData.intervalo}
              onChange={e => setFormData({ ...formData, intervalo: e.target.value as IntervaloSuscripcion })}
              required
              disabled={isEditing}
              helperText={isEditing ? 'El intervalo no se puede modificar en Culqi' : undefined}
            >
              {INTERVALOS.map(i => (
                <MenuItem key={i.value} value={i.value}>{i.label}</MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              label='Días de Prueba'
              type='number'
              placeholder='0'
              inputProps={{ min: 0 }}
              value={formData.dias_prueba}
              onChange={e => setFormData({ ...formData, dias_prueba: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={cursosDisponibles}
              getOptionLabel={option => option.titulo}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={cursosSeleccionados}
              onChange={(_, newValue) => setCursosSeleccionados(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option.titulo} size='small' {...getTagProps({ index })} key={option.id} />
                ))
              }
              renderInput={params => (
                <TextField {...params} label='Cursos incluidos en el plan *' placeholder='Selecciona cursos' />
              )}
              noOptionsText='No hay cursos disponibles'
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.esta_activo}
                  onChange={e => setFormData({ ...formData, esta_activo: e.target.checked })}
                />
              }
              label='Plan Activo'
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button variant='tonal' color='secondary' onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant='contained' type='submit' disabled={isPending}>
            {planToEdit ? 'Actualizar' : 'Crear Plan'}
          </Button>
        </Box>
      </form>
    </AppModal>
  )
}

export default PlanSuscripcionForm
