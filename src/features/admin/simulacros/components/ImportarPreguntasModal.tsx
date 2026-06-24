'use client'

import { useMemo, useState } from 'react'
import { Box, Button, Chip, CircularProgress, Divider, TextField, Typography } from '@mui/material'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { getBaseURL } from '@/utils/env'
import AppModal from '@/utils/components/AppModal'

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F']

const PLANTILLA = `P: ¿Enunciado de la pregunta?
T: Tema (opcional)
F: Fundamento (opcional)
A) Opción 1
B) Opción 2 *
C) Opción 3
D) Opción 4
---
P: Siguiente pregunta...
A) Opción 1 *
B) Opción 2`

interface OpcionParseada { texto: string; es_correcta: boolean }
interface PreguntaParseada {
  enunciado: string; tema: string | null; fundamento: string | null
  opciones: OpcionParseada[]
  errores: string[]
}

function parsearTexto(texto: string): PreguntaParseada[] {
  const bloques = texto.split(/^-{3,}$/m).map(b => b.trim()).filter(Boolean)

  return bloques.map(bloque => {
    let enunciado = ''
    let tema: string | null = null
    let fundamento: string | null = null
    const opciones: OpcionParseada[] = []

    for (const rawLine of bloque.split('\n')) {
      const line = rawLine.trim()
      if (!line) continue

      if (/^P:/i.test(line)) enunciado = line.replace(/^P:/i, '').trim()
      else if (/^T:/i.test(line)) tema = line.replace(/^T:/i, '').trim() || null
      else if (/^F:/i.test(line)) fundamento = line.replace(/^F:/i, '').trim() || null
      else {
        const match = line.match(/^[A-Fa-f]\)\s*(.*)$/)
        if (match) {
          let opTexto = match[1].trim()
          const esCorrecta = /\*\s*$/.test(opTexto)
          if (esCorrecta) opTexto = opTexto.replace(/\*\s*$/, '').trim()
          opciones.push({ texto: opTexto, es_correcta: esCorrecta })
        }
      }
    }

    const errores: string[] = []
    if (!enunciado) errores.push('Falta el enunciado (línea "P:")')
    if (opciones.length < 2) errores.push('Debe tener al menos 2 alternativas')
    if (opciones.length > 6) errores.push('Máximo 6 alternativas')
    const correctas = opciones.filter(o => o.es_correcta).length
    if (correctas === 0) errores.push('Ninguna alternativa marcada como correcta (agrega "*" al final)')
    if (correctas > 1) errores.push('Hay más de una alternativa marcada como correcta')

    return { enunciado, tema, fundamento, opciones, errores }
  })
}

export default function ImportarPreguntasModal({ open, onClose, simulacroId, token, onImported }: {
  open: boolean; onClose: () => void; simulacroId: string; token: string | null
  onImported: () => void
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [texto, setTexto] = useState('')
  const [importando, setImportando] = useState(false)

  const preguntas = useMemo(() => (texto.trim() ? parsearTexto(texto) : []), [texto])
  const validas = preguntas.filter(p => p.errores.length === 0)
  const conError = preguntas.length - validas.length

  const handleClose = () => {
    if (importando) return
    setTexto('')
    onClose()
  }

  const handleImportar = async () => {
    if (validas.length === 0) return
    setImportando(true)
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    let exitosas = 0
    let fallidas = 0

    for (const [i, p] of validas.entries()) {
      try {
        await axios.post(`${getBaseURL()}/api/simulacros/${simulacroId}/preguntas`, {
          enunciado: p.enunciado,
          tema: p.tema,
          fundamento: p.fundamento,
          orden: i,
          opciones: p.opciones.map((o, oi) => ({ texto: o.texto, es_correcta: o.es_correcta, orden: oi })),
        }, { headers })
        exitosas++
      } catch {
        fallidas++
      }
    }

    setImportando(false)
    enqueueSnackbar(
      fallidas === 0 ? `${exitosas} pregunta${exitosas !== 1 ? 's' : ''} importada${exitosas !== 1 ? 's' : ''}` : `${exitosas} importadas, ${fallidas} con error`,
      { variant: fallidas === 0 ? 'success' : 'warning' }
    )
    setTexto('')
    onImported()
  }

  return (
    <AppModal open={open} handleClose={handleClose} sx={{ maxWidth: 760 }}>
      <Typography variant='h6' sx={{ mb: 0.5 }}>Importar preguntas</Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Pega varias preguntas a la vez usando el formato de texto. Marca la alternativa correcta con un{' '}
        <strong>*</strong> al final de la línea.
      </Typography>

      <TextField
        fullWidth multiline minRows={8} maxRows={14}
        placeholder={PLANTILLA}
        value={texto}
        onChange={e => setTexto(e.target.value)}
        sx={{ mb: 1, fontFamily: 'monospace' }}
      />
      <Button size='small' onClick={() => setTexto(PLANTILLA)} startIcon={<Icon icon='mdi:file-document-outline' />}>
        Usar plantilla de ejemplo
      </Button>

      {preguntas.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Typography variant='subtitle2'>Vista previa</Typography>
            <Chip size='small' color='success' variant='tonal' label={`${validas.length} lista${validas.length !== 1 ? 's' : ''}`} />
            {conError > 0 && <Chip size='small' color='error' variant='tonal' label={`${conError} con error`} />}
          </Box>

          <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
            {preguntas.map((p, i) => (
              <Box key={i} sx={{
                p: 1.5, mb: 1, borderRadius: 1, border: '1px solid',
                borderColor: p.errores.length > 0 ? 'error.light' : 'divider',
                bgcolor: p.errores.length > 0 ? 'error.lighter' : 'transparent',
              }}>
                <Typography variant='body2' fontWeight={600}>
                  {i + 1}. {p.enunciado || <em>(sin enunciado)</em>}
                </Typography>
                {p.opciones.length > 0 && (
                  <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {p.opciones.map((o, oi) => (
                      <Chip key={oi} size='small' variant={o.es_correcta ? 'filled' : 'tonal'}
                        color={o.es_correcta ? 'success' : 'default'}
                        label={`${LETRAS[oi]}) ${o.texto || '—'}`} />
                    ))}
                  </Box>
                )}
                {p.errores.length > 0 && (
                  <Typography variant='caption' color='error.main' sx={{ display: 'block', mt: 0.5 }}>
                    {p.errores.join(' · ')}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button variant='outlined' onClick={handleClose} disabled={importando}>Cancelar</Button>
        <Button variant='contained' onClick={handleImportar} disabled={importando || validas.length === 0}
          startIcon={importando ? <CircularProgress size={16} /> : <Icon icon='mdi:file-upload-outline' />}>
          Importar {validas.length > 0 ? `${validas.length} pregunta${validas.length !== 1 ? 's' : ''}` : ''}
        </Button>
      </Box>
    </AppModal>
  )
}
