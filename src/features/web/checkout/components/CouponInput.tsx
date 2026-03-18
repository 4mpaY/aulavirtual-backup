'use client'

import { useState } from 'react'

import { Box, TextField, Button, Typography, InputAdornment, CircularProgress, Alert } from '@mui/material'

import axios from 'axios'


interface CouponInputProps {
  cursoIds: string[]
  onApplied: (data: { codigo: string; descuento: number; total: number } | null) => void
}

const CouponInput = ({ cursoIds, onApplied }: CouponInputProps) => {
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleApply = async () => {
    if (!codigo) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await axios.post('/api/cupones/validar', {
        codigo: codigo.trim(),
        cursoIds
      })

      if (response.data.status) {
        const { descuento, total, codigo: appliedCode } = response.data.result

        setSuccess(`¡Cupón "${appliedCode}" aplicado correctamente!`)

        onApplied({ codigo: appliedCode, descuento, total })
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al validar el cupón'

      setError(message)

      onApplied(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    setCodigo('')
    setSuccess(null)
    setError(null)
    onApplied(null)
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
        ¿Tienes un código de descuento?
      </Typography>

      {!success ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Introduce tu código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="tabler-ticket" style={{ fontSize: '1.2rem', color: 'var(--mui-palette-text-secondary)' }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={loading || !codigo}
            sx={{
              borderRadius: '12px',
              px: 3,
              fontWeight: 700,
              textTransform: 'none',
              minWidth: '100px'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Aplicar'}
          </Button>
        </Box>
      ) : (
        <Alert
          severity="success"
          onClose={handleRemove}
          sx={{
            borderRadius: '12px',
            '& .MuiAlert-message': { fontWeight: 600 }
          }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block', fontWeight: 600 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default CouponInput
