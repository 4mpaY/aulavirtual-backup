'use client'

import { useState } from 'react'

import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment
} from '@mui/material'
import { toast } from 'react-toastify'
import { getSession } from 'next-auth/react'

import { AxiosConfiguracion } from '../http/axiosConfiguracion'
import type { Configuracion } from '../entity/Configuracion'

interface ConfiguracionViewProps {
  initialData?: Configuracion[]
}

export function ConfiguracionView({ initialData }: ConfiguracionViewProps) {
  const [saving, setSaving] = useState(false)

  const initialMapped = (initialData || []).reduce((acc: { [key: string]: string }, curr: Configuracion) => {
    acc[curr.clave] = curr.valor

    return acc
  }, {})

  const [config, setConfig] = useState<{ [key: string]: string }>({
    PAYPAL_EXCHANGE_RATE: '3.80',
    ...initialMapped
  })

  const handleSave = async () => {
    setSaving(true)

    try {
      const payload = Object.entries(config).map(([clave, valor]) => ({
        clave,
        valor,
        descripcion: clave === 'PAYPAL_EXCHANGE_RATE' ? 'Tipo de cambio PEN a USD para PayPal' : ''
      }))

      const getAuthToken = async () => {
        const s = await getSession()

        return s?.user?.accessToken ?? null
      }

      const axiosConfig = new AxiosConfiguracion({ getAuthToken })

      await axiosConfig.save(payload)
      toast.success('Configuración guardada correctamente')
    } catch (err) {
      console.error(err)
      toast.error('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Pagos y Moneda</Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Tipo de Cambio PayPal (PEN → USD)
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="3.80"
                  value={config.PAYPAL_EXCHANGE_RATE}
                  onChange={(e) => setConfig({ ...config, PAYPAL_EXCHANGE_RATE: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">S/</InputAdornment>,
                    endAdornment: <InputAdornment position="end">por $1.00</InputAdornment>
                  }}
                  helperText="Define cuántos Soles equivale 1 Dólar para el cobro en PayPal."
                />
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                Este valor se utiliza para convertir el total de la compra en soles a dólares antes de enviarlo a PayPal.
              </Alert>

              <Box sx={{ pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : null}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
