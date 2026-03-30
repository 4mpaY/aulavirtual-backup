import { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Divider,
  Chip,
  Box,
  Stack
} from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import type { Reclamacion } from '../entity/Reclamacion'
import { EstadoReclamacion } from '../entity/Reclamacion'
import HydratedDate from '@/utils/components/HydratedDate'

interface ReclamacionDetailModalProps {
  open: boolean
  onClose: () => void
  reclamacion: Reclamacion | null
  onReply: (id: string, respuesta: string, estado: string) => Promise<any>
}

export default function ReclamacionDetailModal({
  open,
  onClose,
  reclamacion,
  onReply
}: ReclamacionDetailModalProps) {
  const [respuesta, setRespuesta] = useState(reclamacion?.respuesta_proveedor || '')
  const [estado, setEstado] = useState(reclamacion?.estado || EstadoReclamacion.PENDIENTE)
  const [loading, setLoading] = useState(false)

  if (!reclamacion) return null

  const handleSave = async () => {
    try {
      setLoading(true)
      await onReply(reclamacion.id, respuesta, estado)
      toast.success('Respuesta guardada correctamente')
      onClose()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h5'>Detalle de Reclamación Hoja N° {reclamacion.numero_correlativo}</Typography>
        <Chip
          label={reclamacion.estado}
          color={reclamacion.estado === EstadoReclamacion.ATENDIDO ? 'success' : 'warning'}
          size='small'
        />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' color='primary' gutterBottom>1. IDENTIFICACIÓN DEL CONSUMIDOR</Typography>
            <Stack spacing={1}>
              <Typography variant='body2'><strong>Nombre:</strong> {reclamacion.nombre}</Typography>
              <Typography variant='body2'><strong>DNI/CE:</strong> {reclamacion.tipo_documento} {reclamacion.numero_documento}</Typography>
              <Typography variant='body2'><strong>Email:</strong> {reclamacion.email}</Typography>
              <Typography variant='body2'><strong>Teléfono:</strong> {reclamacion.telefono}</Typography>
              <Typography variant='body2'><strong>Domicilio:</strong> {reclamacion.domicilio}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle2' color='primary' gutterBottom>2. IDENTIFICACIÓN DEL BIEN CONTRATADO</Typography>
            <Stack spacing={1}>
              <Typography variant='body2'><strong>Tipo:</strong> {reclamacion.bien_contratado_tipo}</Typography>
              <Typography variant='body2'><strong>Monto:</strong> {reclamacion.moneda} {reclamacion.monto_reclamado}</Typography>
              <Typography variant='body2'><strong>Descripción:</strong> {reclamacion.descripcion_bien}</Typography>
              <Typography variant='body2'><strong>Pedido/Referencia:</strong> {reclamacion.pedido}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant='subtitle2' color='primary' gutterBottom>3. DETALLE DE LA RECLAMACIÓN / QUEJA</Typography>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>{reclamacion.detalle}</Typography>
            </Box>

            <Typography variant='subtitle2' color='primary' sx={{ mt: 3 }} gutterBottom>PEDIDO (SOLUCIÓN ESPERADA)</Typography>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap' }}>{reclamacion.pedido}</Typography>
            </Box>

            <Typography variant='caption' color='text.secondary' sx={{ mt: 1, display: 'block' }}>
              Fecha de registro: <HydratedDate date={reclamacion.creado_en} format="dateTime" />
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant='subtitle2' color='secondary' gutterBottom>4. RESPUESTA DEL PROVEEDOR (ADMINISTRADOR)</Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <CustomTextField
                fullWidth
                multiline
                rows={4}
                label='Respuesta o Acción Tomada'
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder='Escriba aquí la respuesta oficial...'
              />
              <CustomTextField
                select
                label='Estado de la Reclamación'
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoReclamacion)}
                SelectProps={{
                  native: true
                }}
              >
                <option value={EstadoReclamacion.PENDIENTE}>PENDIENTE</option>
                <option value={EstadoReclamacion.ATENDIDO}>ATENDIDO</option>
              </CustomTextField>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='secondary'>Cerrar</Button>
        <Button onClick={handleSave} variant='contained' disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Respuesta'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
