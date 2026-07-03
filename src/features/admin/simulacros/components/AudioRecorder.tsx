'use client'

import { useRef, useState } from 'react'

import { Box, Button, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import axios from 'axios'

import { getBaseURL } from '@/utils/env'

interface Props {
  token: string | null
  value: string | null
  onChange: (url: string | null) => void
}

export default function AudioRecorder({ token, value, onChange }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return

    if (!file.type.startsWith('audio/')) {
      enqueueSnackbar('Selecciona un archivo de audio válido', { variant: 'error' })

      return
    }

    setUploading(true)

    try {
      const fd = new FormData()

      fd.append('file', file)

      const { data } = await axios.post(`${getBaseURL()}/api/media`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      })

      const url: string = data?.result?.url ?? data?.url

      onChange(url)
      enqueueSnackbar('Audio subido', { variant: 'success' })
    } catch {
      enqueueSnackbar('Error al subir el audio', { variant: 'error' })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <input
        ref={inputRef}
        type='file'
        accept='audio/*'
        hidden
        onChange={e => handleFile(e.target.files?.[0])}
      />

      {/* Audio ya guardado */}
      {value && !uploading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
          <audio controls src={value} style={{ height: 30, flex: 1 }} />
          <Tooltip title='Eliminar'><IconButton size='small' color='error' onClick={() => onChange(null)}><Icon icon='mdi:delete-outline' fontSize={18} /></IconButton></Tooltip>
          <Tooltip title='Cambiar audio'><IconButton size='small' onClick={() => inputRef.current?.click()}><Icon icon='mdi:upload' fontSize={18} /></IconButton></Tooltip>
        </Box>
      )}

      {/* Botón subir */}
      {!value && !uploading && (
        <Button
          size='small' variant='outlined' color='inherit'
          startIcon={<Icon icon='mdi:upload' />}
          onClick={() => inputRef.current?.click()}
          sx={{ alignSelf: 'flex-start', borderStyle: 'dashed', color: 'text.secondary' }}
        >
          Subir audio de sustento
        </Button>
      )}

      {/* Subiendo */}
      {uploading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant='caption'>Subiendo audio…</Typography>
        </Box>
      )}
    </Box>
  )
}
