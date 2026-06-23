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
  Box,
  IconButton,
  Stack,
  Paper,
  Divider
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
  const [beneficios, setBeneficios] = useState<string[]>([])
  const [nuevoBeneficio, setNuevoBeneficio] = useState('')

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

      const parsed = Array.isArray(planToEdit.beneficios) ? planToEdit.beneficios : []

      setBeneficios(parsed.filter((b): b is string => typeof b === 'string'))
    } else {
      setFormData(initialForm)
      setCursosSeleccionados([])
      setBeneficios([])
    }

    setNuevoBeneficio('')
  }, [planToEdit, open])

  const handleAddBeneficio = () => {
    const texto = nuevoBeneficio.trim()

    if (!texto) return

    if (beneficios.includes(texto)) {
      toast.warning('Este beneficio ya existe')

      return
    }

    setBeneficios(prev => [...prev, texto])
    setNuevoBeneficio('')
  }

  const handleRemoveBeneficio = (index: number) => {
    setBeneficios(prev => prev.filter((_, i) => i !== index))
  }

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
      beneficios,
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

          {/* ── CURSOS INCLUIDOS ──────────────────────────── */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant='body2' color='text.secondary'>
                Cursos incluidos en el plan *
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size='small'
                  variant='tonal'
                  onClick={() => setCursosSeleccionados([...cursosDisponibles])}
                  disabled={cursosDisponibles.length === 0 || cursosSeleccionados.length === cursosDisponibles.length}
                >
                  Seleccionar todos ({cursosDisponibles.length})
                </Button>
                {cursosSeleccionados.length > 0 && (
                  <Button
                    size='small'
                    variant='tonal'
                    color='secondary'
                    onClick={() => setCursosSeleccionados([])}
                  >
                    Limpiar
                  </Button>
                )}
              </Box>
            </Box>
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
                <TextField
                  {...params}
                  placeholder={cursosSeleccionados.length === 0 ? 'Selecciona cursos o usa "Seleccionar todos"' : ''}
                />
              )}
              noOptionsText='No hay cursos disponibles'
            />
          </Grid>

          {/* ── BENEFICIOS DEL PLAN ───────────────────────── */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 1 }} />
            <Typography variant='subtitle2' sx={{ mb: 0.5 }}>
              Beneficios del Plan
            </Typography>
            <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 2 }}>
              Estos beneficios se mostrarán en la página pública de suscripciones. Ej: &quot;Acceso a +50 cursos&quot;, &quot;Certificados incluidos&quot;, etc.
            </Typography>

            {/* Lista de beneficios actuales */}
            {beneficios.length > 0 && (
              <Paper variant='outlined' sx={{ p: 1.5, mb: 2, borderRadius: 2 }}>
                <Stack spacing={0.5}>
                  {beneficios.map((beneficio, index) => (
                    <Stack key={index} direction='row' alignItems='center' spacing={1}>
                      <i className='tabler-check' style={{ fontSize: 14, color: 'var(--mui-palette-success-main)', flexShrink: 0 }} />
                      <Typography variant='body2' sx={{ flex: 1 }}>
                        {beneficio}
                      </Typography>
                      <IconButton size='small' color='error' onClick={() => handleRemoveBeneficio(index)}>
                        <i className='tabler-x' style={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Input para agregar nuevo beneficio */}
            <Stack direction='row' spacing={1} alignItems='flex-start'>
              <CustomTextField
                fullWidth
                size='small'
                placeholder='Ej: Acceso ilimitado a todos los cursos'
                value={nuevoBeneficio}
                onChange={e => setNuevoBeneficio(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddBeneficio()
                  }
                }}
              />
              <Button
                variant='tonal'
                size='small'
                onClick={handleAddBeneficio}
                disabled={!nuevoBeneficio.trim()}
                sx={{ whiteSpace: 'nowrap', minWidth: 'auto', px: 2 }}
              >
                <i className='tabler-plus' style={{ fontSize: 16 }} />
              </Button>
            </Stack>
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

