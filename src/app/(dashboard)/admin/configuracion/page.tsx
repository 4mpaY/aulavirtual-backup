'use client'

import { useState, useEffect } from 'react'

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

const ConfiguracionPage = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [config, setConfig] = useState<{ [key: string]: string }>({
    PAYPAL_EXCHANGE_RATE: '3.80'
  })

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/configuracion')
      const data = await res.json()

      if (res.ok && data.result) {
        const mapped = data.result.reduce((acc: any, curr: any) => {
          acc[curr.clave] = curr.valor

          return acc
        }, {})

        if (mapped.PAYPAL_EXCHANGE_RATE) {
          setConfig(prev => ({ ...prev, ...mapped }))
        } else {
          // Inicializar si no existe
          setConfig(prev => ({ ...prev, ...mapped }))
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const payload = Object.entries(config).map(([clave, valor]) => ({
        clave,
        valor,
        descripcion: clave === 'PAYPAL_EXCHANGE_RATE' ? 'Tipo de cambio PEN a USD para PayPal' : ''
      }))

      const res = await fetch('/api/admin/configuracion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configuraciones: payload })
      })

      if (res.ok) {
        toast.success('Configuración guardada correctamente')
      } else {
        toast.error('Error al guardar la configuración')
      }
    } catch (err) {
      toast.error('Error de red al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <CircularProgress />

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Configuración del Sistema</Typography>

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

export default ConfiguracionPage
