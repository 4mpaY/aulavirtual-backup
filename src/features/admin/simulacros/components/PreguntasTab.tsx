'use client'

import { useState } from 'react'
import {
  Box, Button, Card, CardContent, Chip, Collapse, Divider,
  Grid, IconButton, TextField, Typography, Radio,
  Tooltip, CircularProgress, Alert
} from '@mui/material'
import { Icon } from '@iconify/react'
import { useSnackbar } from 'notistack'
import axios from 'axios'
import { getBaseURL } from '@/utils/env'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import AudioRecorder from './AudioRecorder'

interface Opcion { id?: string; texto: string; es_correcta: boolean; orden: number }
interface Pregunta { id: string; enunciado: string; tema: string | null; fundamento: string | null; audio_url?: string | null; orden: number; opciones: Opcion[] }

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F']

function emptyOpciones(): Opcion[] {
  return [0, 1, 2, 3].map(orden => ({ texto: '', es_correcta: orden === 0, orden }))
}

// ── Formulario de pregunta ────────────────────────────────────────────────
function PreguntaForm({ initial, simulacroId, token, onSaved, onCancel }: {
  initial?: Pregunta; simulacroId: string; token: string | null
  onSaved: () => void; onCancel: () => void
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [enunciado, setEnunciado] = useState(initial?.enunciado ?? '')
  const [tema, setTema] = useState(initial?.tema ?? '')
  const [fundamento, setFundamento] = useState(initial?.fundamento ?? '')
  const [audioUrl, setAudioUrl] = useState<string | null>(initial?.audio_url ?? null)
  const [opciones, setOpciones] = useState<Opcion[]>(initial?.opciones ?? emptyOpciones())
  const [saving, setSaving] = useState(false)

  const base = `${getBaseURL()}/api/simulacros/${simulacroId}/preguntas`
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const setOpcionField = (i: number, field: keyof Opcion, value: any) =>
    setOpciones(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: value } : o))

  const setCorrecta = (i: number) =>
    setOpciones(prev => prev.map((o, idx) => ({ ...o, es_correcta: idx === i })))

  const addOpcion = () => {
    if (opciones.length >= 6) return
    setOpciones(prev => [...prev, { texto: '', es_correcta: false, orden: prev.length, audio_url: '' }])
  }

  const removeOpcion = (i: number) => {
    if (opciones.length <= 2) return
    setOpciones(prev => {
      const next = prev.filter((_, idx) => idx !== i).map((o, idx) => ({ ...o, orden: idx }))
      // Si la eliminada era la correcta, marcar la primera
      if (!next.some(o => o.es_correcta)) next[0].es_correcta = true
      return next
    })
  }

  const handleSave = async () => {
    if (!enunciado.trim()) { enqueueSnackbar('El enunciado es requerido', { variant: 'error' }); return }
    if (!opciones.some(o => o.es_correcta)) { enqueueSnackbar('Marca la opción correcta', { variant: 'error' }); return }
    if (opciones.some(o => !o.texto.trim())) { enqueueSnackbar('Completa el texto de todas las opciones', { variant: 'error' }); return }

    setSaving(true)
    try {
      const payload = {
        enunciado,
        tema: tema || null,
        fundamento: fundamento || null,
        audio_url: audioUrl || null,
        opciones: opciones.map((o, i) => ({ texto: o.texto, es_correcta: o.es_correcta, orden: i })),
      }
      if (initial) {
        await axios.patch(`${base}/${initial.id}`, payload, { headers })
      } else {
        await axios.post(base, payload, { headers })
      }
      enqueueSnackbar(initial ? 'Pregunta actualizada' : 'Pregunta creada', { variant: 'success' })
      onSaved()
    } catch {
      enqueueSnackbar('Error al guardar la pregunta', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card variant='outlined' sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={2} label='Enunciado *'
            value={enunciado} onChange={e => setEnunciado(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label='Tema / Sección' value={tema} onChange={e => setTema(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth multiline minRows={2} label='Fundamento (explicación de la respuesta correcta)'
            value={fundamento} onChange={e => setFundamento(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='caption' color='text.secondary' fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
            Audio de sustento (para la respuesta correcta)
          </Typography>
          <AudioRecorder token={token} value={audioUrl} onChange={setAudioUrl} />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant='subtitle2'>Opciones — marca la correcta</Typography>
            {opciones.length < 6 && (
              <Button size='small' startIcon={<Icon icon='mdi:plus' />} onClick={addOpcion}>
                Agregar opción
              </Button>
            )}
          </Box>

          {opciones.map((op, i) => (
            <Box key={i} sx={{ mb: 2, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: op.es_correcta ? 'success.light' : 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Radio size='small' checked={op.es_correcta} onChange={() => setCorrecta(i)} color='success' />
                <Chip label={LETRAS[i]} size='small' color={op.es_correcta ? 'success' : 'default'} variant='tonal' sx={{ minWidth: 28 }} />
                <TextField
                  fullWidth size='small'
                  placeholder={`Texto opción ${LETRAS[i]}`}
                  value={op.texto}
                  onChange={e => setOpcionField(i, 'texto', e.target.value)}
                />
                {opciones.length > 2 && (
                  <Tooltip title='Eliminar opción'>
                    <IconButton size='small' color='error' onClick={() => removeOpcion(i)}>
                      <Icon icon='mdi:close' fontSize={16} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant='outlined' onClick={onCancel} disabled={saving}>Cancelar</Button>
            <Button variant='contained' onClick={handleSave} disabled={saving}
              startIcon={saving ? <CircularProgress size={16} /> : <Icon icon='mdi:content-save' />}>
              {initial ? 'Actualizar' : 'Guardar pregunta'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}

// ── Ítem de pregunta ──────────────────────────────────────────────────────
function PreguntaItem({ pregunta, simulacroId, token, onRefresh }: {
  pregunta: Pregunta; simulacroId: string; token: string | null; onRefresh: () => void
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const base = `${getBaseURL()}/api/simulacros/${simulacroId}/preguntas`
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`${base}/${pregunta.id}`, { headers })
      enqueueSnackbar('Pregunta eliminada', { variant: 'success' })
      onRefresh()
    } catch {
      enqueueSnackbar('Error al eliminar', { variant: 'error' })
      setDeleting(false)
    }
  }

  if (editing) return (
    <PreguntaForm initial={pregunta} simulacroId={simulacroId} token={token}
      onSaved={() => { setEditing(false); onRefresh() }} onCancel={() => setEditing(false)} />
  )

  const correcta = pregunta.opciones.find(o => o.es_correcta)

  return (
    <Card variant='outlined' sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {pregunta.tema && <Typography variant='caption' color='primary' fontWeight={700}>{pregunta.tema}</Typography>}
          <Typography variant='body2' fontWeight={500} noWrap={!expanded}>{pregunta.enunciado}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          <Tooltip title={expanded ? 'Colapsar' : 'Ver detalle'}>
            <IconButton size='small' onClick={() => setExpanded(v => !v)}>
              <i className={`tabler-chevron-${expanded ? 'up' : 'down'} text-[18px]`} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Editar'>
            <IconButton size='small' onClick={() => setEditing(true)}>
              <i className='tabler-edit text-[18px] text-textSecondary' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Eliminar'>
            <IconButton size='small' color='error' onClick={handleDelete} disabled={deleting}>
              <i className='tabler-trash text-[18px]' />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <CardContent sx={{ pt: 1.5 }}>
          {pregunta.opciones.map((op, i) => (
            <Box key={op.id ?? i} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label={LETRAS[i]} size='small'
                  color={op.es_correcta ? 'success' : 'default'}
                  variant={op.es_correcta ? 'filled' : 'tonal'} sx={{ minWidth: 28 }} />
                <Typography variant='body2' color={op.es_correcta ? 'success.main' : 'text.primary'}
                  fontWeight={op.es_correcta ? 700 : 400}>
                  {op.texto}
                  {op.es_correcta && <Icon icon='mdi:check-circle' color='green' fontSize={14} style={{ marginLeft: 4 }} />}
                </Typography>
              </Box>
              {op.audio_url && (
                <Box sx={{ pl: 4.5, mt: 0.75 }}>
                  <audio controls src={op.audio_url} style={{ height: 28, maxWidth: 280 }} />
                </Box>
              )}
            </Box>
          ))}
          {(pregunta.fundamento || pregunta.audio_url) && (
            <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, bgcolor: 'info.lighter', border: '1px solid', borderColor: 'info.light' }}>
              <Typography variant='caption' color='info.main' fontWeight={700}>Fundamento:</Typography>
              {pregunta.fundamento && (
                <Typography variant='body2' color='info.dark' sx={{ mt: 0.5 }}>{pregunta.fundamento}</Typography>
              )}
              {pregunta.audio_url && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant='caption' color='info.main' fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Icon icon='mdi:volume-high' fontSize={14} /> Audio de sustento:
                  </Typography>
                  <audio controls src={pregunta.audio_url} style={{ height: 28, marginTop: 4, maxWidth: 280 }} />
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}

// ── Tab principal ─────────────────────────────────────────────────────────
export default function PreguntasTab({ simulacroId, numeroPreguntasSimulacro }: {
  simulacroId: string; numeroPreguntasSimulacro?: number
}) {
  const { data: session } = useSession()
  const token = session?.user?.accessToken ?? null
  const [adding, setAdding] = useState(false)

  const { data: preguntas = [], isLoading, refetch } = useQuery<Pregunta[]>({
    queryKey: ['simulacro-preguntas', simulacroId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${getBaseURL()}/api/simulacros/${simulacroId}/preguntas`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      )
      return data.result ?? []
    },
    enabled: !!simulacroId,
  })

  const mostradas = numeroPreguntasSimulacro ?? preguntas.length

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant='h6'>Banco de preguntas</Typography>
          <Typography variant='caption' color='text.secondary'>
            {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''} en el banco
            {mostradas > 0 && preguntas.length > mostradas && (
              <> · Se mostrarán <strong>{mostradas}</strong> aleatorias por intento</>
            )}
          </Typography>
        </Box>
        {!adding && (
          <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={() => setAdding(true)}>
            Agregar pregunta
          </Button>
        )}
      </Box>

      {/* Aviso pool > número de preguntas */}
      {preguntas.length > mostradas && mostradas > 0 && (
        <Alert severity='info' sx={{ mb: 2 }}>
          El banco tiene <strong>{preguntas.length}</strong> preguntas pero el simulacro muestra solo <strong>{mostradas}</strong> por intento.
          Cada vez que un alumno rinda el examen se seleccionarán {mostradas} al azar con sus alternativas barajadas.
        </Alert>
      )}

      {adding && (
        <PreguntaForm simulacroId={simulacroId} token={token}
          onSaved={() => { setAdding(false); refetch() }}
          onCancel={() => setAdding(false)} />
      )}

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : preguntas.length === 0 && !adding ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <Icon icon='mdi:clipboard-text-off' fontSize={40} />
          <Typography variant='body2' sx={{ mt: 1 }}>No hay preguntas aún. Agrega la primera.</Typography>
        </Box>
      ) : (
        preguntas.map(p => (
          <PreguntaItem key={p.id} pregunta={p} simulacroId={simulacroId} token={token} onRefresh={refetch} />
        ))
      )}
    </Box>
  )
}
