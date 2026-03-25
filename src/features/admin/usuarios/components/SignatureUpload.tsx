'use client'

import { useRef, useState } from 'react'

import { Box, Button, CircularProgress, IconButton, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

interface SignatureUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export default function SignatureUpload({ value, onChange, disabled }: SignatureUploadProps) {
  const { enqueueSnackbar } = useSnackbar()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Solo se permiten imágenes (PNG, JPG, WEBP)', { variant: 'error' })

      return
    }

    setUploading(true)

    try {
      const formData = new FormData()

      formData.append('file', file)

      const res = await fetch('/api/media?isSignature=true', { method: 'POST', body: formData })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json?.error || 'Error al subir la imagen')
      }

      onChange(json.result?.url || json.url || '')
    } catch (err: any) {
      enqueueSnackbar(err.message || 'Error al subir la firma', { variant: 'error' })
    } finally {
      setUploading(false)

      // Limpiar input para permitir re-subir el mismo archivo
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Box>
      <input
        ref={inputRef}
        type='file'
        accept='image/png,image/jpeg,image/webp'
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {value ? (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Box
            sx={{
              position: 'relative',
              width: 200,
              height: 80,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              bgcolor: 'background.paper'
            }}
          >
            <img src={value} alt='Firma' style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            <IconButton
              size='small'
              sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'background.paper', boxShadow: 1 }}
              onClick={() => onChange('')}
              disabled={disabled || uploading}
            >
              <i className='tabler-trash text-error text-sm' />
            </IconButton>
          </Box>

          <Button
            variant='text'
            size='small'
            startIcon={<i className='tabler-upload' />}
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
          >
            Cambiar
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant='outlined'
            startIcon={uploading ? <CircularProgress size={16} /> : <i className='tabler-upload' />}
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
          >
            {uploading ? 'Subiendo...' : 'Subir Firma'}
          </Button>
          <Typography variant='caption' color='text.secondary'>
            PNG con fondo transparente recomendado
          </Typography>
        </Box>
      )}
    </Box>
  )
}
