'use client'

import { useEffect, useRef, useState } from 'react'

import { Alert, Box, Button, CircularProgress, IconButton, Tooltip, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import axios from 'axios'

import { getBaseURL } from '@/utils/env'

interface Props {
  token: string | null
  value: string | null
  onChange: (url: string | null) => void
}

type Fase = 'idle' | 'rec' | 'preview' | 'uploading'

export default function AudioRecorder({ token, value, onChange }: Props) {
  const { enqueueSnackbar } = useSnackbar()
  const [fase, setFase] = useState<Fase>('idle')
  const [seg, setSeg] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [permiso, setPermiso] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')

  const mrRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // Consultar estado actual del permiso al montar
  useEffect(() => {
    navigator.permissions?.query({ name: 'microphone' as PermissionName })
      .then(r => {
        setPermiso(r.state as any)
        r.onchange = () => setPermiso(r.state as any)
      })
      .catch(() => setPermiso('unknown'))
  }, [])

  const grabar = async () => {
    setError(null)
    chunksRef.current = []

    let stream: MediaStream

    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (e: any) {
      setError(
        e.name === 'NotAllowedError'
          ? 'Permiso denegado. Habilita el micrófono en el ícono 🔒 junto a la URL y recarga la página.'
          : e.name === 'NotFoundError'
          ? 'No se detectó ningún micrófono.'
          : `Error: ${e.name}`
      )

      return
    }

    const mr = new MediaRecorder(stream)

    mrRef.current = mr
    mr.ondataavailable = e => { if (e.data?.size) chunksRef.current.push(e.data) }

    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop())
      const b = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })

      setPreviewBlob(b)
      setPreviewUrl(URL.createObjectURL(b))
      timerRef.current && clearInterval(timerRef.current)
      setFase('preview')
    }

    mr.start(100)
    setFase('rec')
    setSeg(0)
    timerRef.current = setInterval(() => setSeg(s => s + 1), 1000)
  }

  const detener = () => mrRef.current?.stop()

  const usar = async () => {
    if (!previewBlob) return

    setFase('uploading')

    try {
      const ext = previewBlob.type.includes('ogg') ? 'ogg' : previewBlob.type.includes('mp4') ? 'mp4' : 'webm'
      const fd = new FormData()

      fd.append('file', previewBlob, `audio-${Date.now()}.${ext}`)

      const { data } = await axios.post(`${getBaseURL()}/api/media`, fd, {
        headers: { 'Content-Type': 'multipart/form-data', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      })

      const url: string = data?.result?.url ?? data?.url

      onChange(url)
      setPreviewUrl(null); setPreviewBlob(null)
      setFase('idle')
      enqueueSnackbar('Audio guardado', { variant: 'success' })
    } catch {
      enqueueSnackbar('Error al subir el audio', { variant: 'error' })
      setFase('preview')
    }
  }

  const descartar = () => {
    previewUrl && URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null); setPreviewBlob(null); setFase('idle')
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>

      {/* Estado del permiso */}
      {permiso === 'denied' && (
        <Alert severity='warning' sx={{ fontSize: '0.78rem', py: 0.5 }}>
          🎙️ Micrófono bloqueado en este sitio.{' '}
          Haz clic en el ícono <strong>🔒</strong> junto a la URL → <strong>Micrófono → Permitir</strong> →{' '}
          <Button size='small' sx={{ p: 0, minWidth: 0, fontWeight: 700, textDecoration: 'underline', fontSize: '0.78rem' }}
            onClick={() => window.location.reload()}>
            Recargar página
          </Button>
        </Alert>
      )}

      {/* Error puntual */}
      {error && (
        <Alert severity='error' onClose={() => setError(null)} sx={{ fontSize: '0.78rem', py: 0.5 }}>
          {error}
        </Alert>
      )}

      {/* Audio ya guardado */}
      {value && fase === 'idle' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
          <audio controls src={value} style={{ height: 30, flex: 1 }} />
          <Tooltip title='Eliminar'><IconButton size='small' color='error' onClick={() => onChange(null)}><Icon icon='mdi:delete-outline' fontSize={18} /></IconButton></Tooltip>
          <Tooltip title='Volver a grabar'><IconButton size='small' onClick={grabar}><Icon icon='mdi:microphone' fontSize={18} /></IconButton></Tooltip>
        </Box>
      )}

      {/* Botón grabar */}
      {!value && fase === 'idle' && (
        <Button
          size='small' variant='outlined' color='inherit'
          startIcon={<Icon icon='mdi:microphone' />}
          onClick={grabar}
          disabled={permiso === 'denied'}
          sx={{ alignSelf: 'flex-start', borderStyle: 'dashed', color: 'text.secondary' }}
        >
          Grabar audio de sustento
        </Button>
      )}

      {/* Grabando */}
      {fase === 'rec' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, borderRadius: 1, bgcolor: '#ffeaea', border: '1px solid #f44336' }}>
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main', animation: 'pulse 1s infinite', flexShrink: 0 }} />
          <Typography variant='caption' color='error' fontWeight={700} sx={{ minWidth: 36 }}>{fmt(seg)}</Typography>
          <Typography variant='caption' color='error' sx={{ flex: 1 }}>Grabando…</Typography>
          <Button size='small' variant='contained' color='error' onClick={detener} startIcon={<Icon icon='mdi:stop' />}>Detener</Button>
        </Box>
      )}

      {/* Preview */}
      {fase === 'preview' && previewUrl && (
        <Box sx={{ p: 1.25, borderRadius: 1, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
          <Typography variant='caption' color='text.secondary' sx={{ mb: 0.5, display: 'block' }}>Vista previa — {fmt(seg)}</Typography>
          <audio controls src={previewUrl} style={{ width: '100%', height: 30 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <Button size='small' variant='contained' onClick={usar} startIcon={<Icon icon='mdi:check' />}>Usar este audio</Button>
            <Button size='small' variant='outlined' color='inherit' onClick={grabar} startIcon={<Icon icon='mdi:refresh' />}>Volver a grabar</Button>
            <Button size='small' color='inherit' onClick={descartar}>Descartar</Button>
          </Box>
        </Box>
      )}

      {/* Subiendo */}
      {fase === 'uploading' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={16} />
          <Typography variant='caption'>Guardando audio…</Typography>
        </Box>
      )}
    </Box>
  )
}
