'use client'

import { useState } from 'react'

import { Box, TextField, Button, Typography, InputAdornment, CircularProgress, Alert } from '@mui/material'
import { Tag } from 'lucide-react'

import axios from 'axios'

const FONT = 'Poppins, sans-serif'


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
    <Box>
      <Typography sx={{ fontFamily: FONT, fontSize: '0.875rem', fontWeight: 700, color: '#0A0A0A', mb: 1.5 }}>
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
                fontFamily: FONT,
                fontSize: '0.875rem',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'var(--web-primary, #25927F)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tag size={16} color="#94a3b8" />
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
              fontFamily: FONT,
              fontWeight: 700,
              textTransform: 'none',
              minWidth: '90px',
              backgroundColor: 'var(--web-primary, #25927F)',
              '&:hover': { backgroundColor: 'var(--web-dark, #025E44)' },
              '&:disabled': { backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.35)', color: 'rgba(255,255,255,0.7)' },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Aplicar'}
          </Button>
        </Box>
      ) : (
        <Alert
          severity="success"
          onClose={handleRemove}
          sx={{
            borderRadius: '12px',
            '& .MuiAlert-message': { fontFamily: FONT, fontWeight: 600, fontSize: '0.8125rem' },
          }}
        >
          {success}
        </Alert>
      )}

      {error && (
        <Typography sx={{ fontFamily: FONT, fontSize: '0.75rem', color: '#dc2626', mt: 1, display: 'block', fontWeight: 600 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default CouponInput
