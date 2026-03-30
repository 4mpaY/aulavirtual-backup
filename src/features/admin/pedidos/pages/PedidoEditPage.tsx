'use client'

import { useState, useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'

import {
  Card, CardHeader, CardContent, Grid, Typography,
  Button, MenuItem, Box, Divider
} from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import { usePedido, useUpdatePedido } from '../hooks/usePedidos'
import type { Pedido } from '../entity/Pedido'

const ESTADOS = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'PROCESANDO', label: 'Procesando' },
  { value: 'COMPLETADO', label: 'Completado (Pagado)' },
  { value: 'CANCELADO', label: 'Cancelado' },
  { value: 'REEMBOLSADO', label: 'Reembolsado' }
]

const METODOS_PAGO = [
  { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito' },
  { value: 'TARJETA_DEBITO', label: 'Tarjeta de Débito' },
  { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'IZIPAY', label: 'Izipay' },
  { value: 'CULQI', label: 'Culqi' },
  { value: 'OTRO', label: 'Otro' }
]

export function PedidoEditPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const { data, isLoading } = usePedido(id as string)
  const { mutateAsync: updatePedido, isPending } = useUpdatePedido()

  const [formData, setFormData] = useState({
    estado: '',
    metodo_pago: '',
    mensaje: ''
  })

  useEffect(() => {
    if (data?.data) {
      setFormData({
        estado: data.data.estado || 'PENDIENTE',
        metodo_pago: data.data.metodo_pago || 'TRANSFERENCIA',
        mensaje: data.data.mensaje || ''
      })
    }
  }, [data])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.estado || !formData.metodo_pago) {
        return toast.error('El estado y método de pago son requeridos')
      }

      await updatePedido({
        id: id as string,
        data: {
          estado: formData.estado as Pedido['estado'],
          metodo_pago: formData.metodo_pago as Pedido['metodo_pago'],
          mensaje: formData.mensaje || null
        } as any
      })

      toast.success('Pedido actualizado con éxito')
      router.push('/admin/pedidos')
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el pedido')
    }
  }

  if (isLoading) {
    return <Card><CardContent>Cargando información para edición...</CardContent></Card>
  }

  const pedido = data?.data as any

  return (
    <Card>
      <CardHeader
        title={`Editar Pedido #${String(pedido?.numero_pedido || '').padStart(6, '0')}`}
      />
      <CardContent>
        {/* INFO DEL ESTUDIANTE Y CURSOS (Solo Lectura) */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Estudiante</Typography>
              <Typography variant="body1" fontWeight={600}>
                {pedido?.usuario?.nombre} {pedido?.usuario?.apellido}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pedido?.usuario?.correo}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Cursos Adquiridos</Typography>
              {pedido?.detalles?.map((d: any) => (
                <Typography key={d.id} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  • {d.curso?.titulo} 
                  <Typography component="span" variant="caption" color="text.secondary">
                    ({pedido.moneda} {Number(d.subtotal).toFixed(2)})
                  </Typography>
                </Typography>
              ))}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 6 }} />

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

          <Box sx={{ mb: 6, p: 4, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" color="error.main" gutterBottom sx={{ fontWeight: 600 }}>
              <i className="tabler-alert-triangle mr-2" />
              ¡Precaución con los cambios de Estado!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cambiar el estado de un pedido a <b>COMPLETADO</b> automáticamente liberará e inscribirá al estudiante en los cursos de este pedido.
              Por el contrario, cambiar de Completado a Cancelado/Reembolsado revocará los accesos al estudiante irreversiblemente.
            </Typography>
          </Box>

          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label="Estado del Pedido"
                value={formData.estado}
                onChange={e => setFormData({ ...formData, estado: e.target.value })}
                required
              >
                {ESTADOS.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label="Método de Pago"
                value={formData.metodo_pago}
                onChange={e => setFormData({ ...formData, metodo_pago: e.target.value })}
                required
              >
                {METODOS_PAGO.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label="Notas Adicionales / Mensaje"
                placeholder="Ej. Transferencia verificada el DD/MM/AAAA"
                value={formData.mensaje}
                onChange={e => setFormData({ ...formData, mensaje: e.target.value })}
                helperText="El estudiante podría ver estas notas en su panel de detalles de compra."
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <Button variant="outlined" color="secondary" onClick={() => router.push('/admin/pedidos')}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}
