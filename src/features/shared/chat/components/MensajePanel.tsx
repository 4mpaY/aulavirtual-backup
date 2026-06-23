'use client'

import { useEffect, useRef, useState } from 'react'

import {
  Avatar, Box, Chip, CircularProgress, Divider,
  IconButton, InputAdornment, TextField, Tooltip, Typography
} from '@mui/material'

import { Icon } from '@iconify/react'
import { useSession } from 'next-auth/react'

import MensajeBurbuja from './MensajeBurbuja'
import { useMensajes, useEnviarMensaje, useMarcarLeidos } from '../hooks/useChat'
import type { ConversacionResumen } from '../entity/Chat'

interface Props {
  conversacion: ConversacionResumen
  onCerrar: () => void
}

const ROL_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  PROFESOR: 'Profesor',
  ESTUDIANTE: 'Estudiante'
}

export default function MensajePanel({ conversacion, onCerrar }: Props) {
  const { data: session } = useSession()
  const [texto, setTexto] = useState('')
  const [adjuntoFile, setAdjuntoFile] = useState<File | null>(null)
  const [adjuntoPreview, setAdjuntoPreview] = useState<{ nombre: string; url: string | null } | null>(null)
  const [subiendoAdjunto, setSubiendoAdjunto] = useState(false)
  const inputFileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { data: mensajes = [], isLoading } = useMensajes(conversacion.id)
  const enviar = useEnviarMensaje()
  const marcarLeidos = useMarcarLeidos()

  const otro = conversacion.otroParticipante

  useEffect(() => {
    marcarLeidos.mutate(conversacion.id)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversacion.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  async function handleAdjunto(file: File) {
    setAdjuntoFile(file)

    if (file.type.startsWith('image/')) {
      setAdjuntoPreview({ nombre: file.name, url: URL.createObjectURL(file) })
    } else {
      setAdjuntoPreview({ nombre: file.name, url: null })
    }
  }

  async function handleEnviar() {
    if (!texto.trim() && !adjuntoFile) return

    let adjunto_id: string | undefined

    if (adjuntoFile) {
      setSubiendoAdjunto(true)

      try {
        const formData = new FormData()

        formData.append('file', adjuntoFile)

        const token = session?.user?.accessToken

        const res = await fetch('/api/media', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData
        })

        const json = await res.json()

        adjunto_id = json?.result?.id
      } catch {
        // continuar sin adjunto si falla la subida
      } finally {
        setSubiendoAdjunto(false)
      }
    }

    enviar.mutate(
      { conversacionId: conversacion.id, contenido: texto.trim(), adjunto_id },
      {
        onSuccess: () => {
          setTexto('')
          setAdjuntoFile(null)
          setAdjuntoPreview(null)
        }
      }
    )
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  return (
    <Box display='flex' flexDirection='column' height='100%' minWidth={0}>
      {/* Header */}
      <Box display='flex' alignItems='center' gap={1.5} px={2} py={1.5} borderBottom='1px solid' borderColor='divider'>
        <Avatar src={otro?.avatar ?? undefined} sx={{ width: 36, height: 36 }}>
          {otro?.nombre?.[0]}
        </Avatar>
        <Box flex={1} minWidth={0}>
          <Typography variant='subtitle2' fontWeight={600} noWrap>
            {otro ? `${otro.nombre} ${otro.apellido}` : 'Usuario'}
          </Typography>
          {otro?.rol && (
            <Chip label={ROL_LABELS[otro.rol] ?? otro.rol} size='small' sx={{ height: 18, fontSize: 10 }} />
          )}
        </Box>
        <IconButton size='small' onClick={onCerrar}>
          <Icon icon='tabler:chevron-left' />
        </IconButton>
      </Box>

      {/* Mensajes */}
      <Box flex={1} overflow='auto' px={2} py={1.5}>
        {isLoading ? (
          <Box display='flex' justifyContent='center' pt={4}>
            <CircularProgress size={24} />
          </Box>
        ) : mensajes.length === 0 ? (
          <Box display='flex' flexDirection='column' alignItems='center' pt={6} gap={1}>
            <Icon icon='tabler:message-off' width={40} color='text.disabled' />
            <Typography variant='body2' color='text.disabled'>
              Inicia la conversación
            </Typography>
          </Box>
        ) : (
          mensajes.map(m => (
            <MensajeBurbuja
              key={m.id}
              mensaje={m}
              esMio={m.remitente_id === session?.user?.id}
            />
          ))
        )}
        <div ref={bottomRef} />
      </Box>

      <Divider />

      {/* Preview adjunto */}
      {adjuntoPreview && (
        <Box px={2} py={1} display='flex' alignItems='center' gap={1} bgcolor='action.hover'>
          {adjuntoPreview.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={adjuntoPreview.url} alt={adjuntoPreview.nombre} style={{ height: 48, borderRadius: 4 }} />
          ) : (
            <Icon icon='tabler:file' width={24} />
          )}
          <Typography variant='caption' flex={1} noWrap>{adjuntoPreview.nombre}</Typography>
          <IconButton size='small' onClick={() => { setAdjuntoFile(null); setAdjuntoPreview(null) }}>
            <Icon icon='tabler:x' width={16} />
          </IconButton>
        </Box>
      )}

      {/* Input */}
      <Box px={2} py={1.5} display='flex' alignItems='flex-end' gap={1}>
        <input
          ref={inputFileRef}
          type='file'
          hidden
          accept='image/*,application/pdf'
          onChange={e => {
            const f = e.target.files?.[0]

            if (f) handleAdjunto(f)
            e.target.value = ''
          }}
        />
        <Tooltip title='Adjuntar archivo'>
          <IconButton size='small' onClick={() => inputFileRef.current?.click()} disabled={subiendoAdjunto}>
            <Icon icon='tabler:paperclip' />
          </IconButton>
        </Tooltip>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size='small'
          placeholder='Escribe un mensaje...'
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: subiendoAdjunto ? (
              <InputAdornment position='end'>
                <CircularProgress size={18} />
              </InputAdornment>
            ) : null
          }}
        />
        <Tooltip title='Enviar (Enter)'>
          <span>
            <IconButton
              color='primary'
              onClick={handleEnviar}
              disabled={(!texto.trim() && !adjuntoFile) || enviar.isPending || subiendoAdjunto}
            >
              <Icon icon='tabler:send' />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
}
