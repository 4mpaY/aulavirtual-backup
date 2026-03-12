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
  Switch,
  FormControlLabel
} from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@/@core/components/mui/TextField'
import { useCuponMutation } from '../hooks/useCupones'

interface CuponFormProps {
  open: boolean
  handleClose: () => void
  cuponToEdit?: any
}

const CuponForm: React.FC<CuponFormProps> = ({ open, handleClose, cuponToEdit }) => {
  const { createCupon, updateCupon } = useCuponMutation()

  const [formData, setFormData] = useState({
    codigo: '',
    valor: '',
    tipo: 'PORCENTAJE',
    limite_uso: '',
    fecha_expiracion: '',
    esta_activo: true
  })

  useEffect(() => {
    if (cuponToEdit) {
      setFormData({
        codigo: cuponToEdit.codigo,
        valor: cuponToEdit.valor.toString(),
        tipo: cuponToEdit.tipo,
        limite_uso: cuponToEdit.limite_uso?.toString() || '',
        fecha_expiracion: cuponToEdit.fecha_expiracion ? new Date(cuponToEdit.fecha_expiracion).toISOString().split('T')[0] : '',
        esta_activo: cuponToEdit.esta_activo
      })
    } else {
      setFormData({
        codigo: '',
        valor: '',
        tipo: 'PORCENTAJE',
        limite_uso: '',
        fecha_expiracion: '',
        esta_activo: true
      })
    }
  }, [cuponToEdit, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      valor: Number(formData.valor),
      limite_uso: formData.limite_uso ? Number(formData.limite_uso) : null,
      fecha_expiracion: formData.fecha_expiracion || null
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
