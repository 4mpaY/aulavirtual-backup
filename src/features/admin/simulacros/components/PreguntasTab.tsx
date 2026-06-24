'use client'

import { useEffect, useState, Children, cloneElement } from 'react'
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
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AudioRecorder from './AudioRecorder'
import MediaLibrary from '@/features/admin/cursos/components/MediaLibrary'
import ImportarPreguntasModal from './ImportarPreguntasModal'

interface Opcion { id?: string; texto: string; es_correcta: boolean; orden: number }
interface Pregunta {
  id: string; enunciado: string; tema: string | null; fundamento: string | null
  audio_url?: string | null; imagen_url?: string | null; orden: number; opciones: Opcion[]
}

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F']

function emptyOpciones(): Opcion[] {
  return [0, 1].map(orden => ({ texto: '', es_correcta: orden === 0, orden }))
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
  const [imagenUrl, setImagenUrl] = useState<string | null>(initial?.imagen_url ?? null)
  const [opciones, setOpciones] = useState<Opcion[]>(initial?.opciones ?? emptyOpciones())
  const [saving, setSaving] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)

  const base = `${getBaseURL()}/api/simulacros/${simulacroId}/preguntas`
  const headers = token ? { Authorization: `Bearer ${token}` } : {}

  const setOpcionField = (i: number, field: keyof Opcion, value: any) =>
    setOpciones(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: value } : o))

  const setCorrecta = (i: number) =>
    setOpciones(prev => prev.map((o, idx) => ({ ...o, es_correcta: idx === i })))

  const addOpcion = () => {
    if (opciones.length >= 6) return
    setOpciones(prev => [...prev, { texto: '', es_correcta: false, orden: prev.length }])
  }

  const removeOpcion = (i: number) => {
    if (opciones.length <= 2) return
    setOpciones(prev => {
      const next = prev.filter((_, idx) => idx !== i).map((o, idx) => ({ ...o, orden: idx }))
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
        imagen_url: imagenUrl || null,
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

        {/* Imagen de la pregunta */}
        <Grid item xs={12}>
          <Typography variant='caption' color='text.secondary' fontWeight={600} sx={{ display: 'block', mb: 0.75 }}>
            Imagen de la pregunta (opcional)
          </Typography>
          {imagenUrl ? (
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                <img src={imagenUrl} alt='Imagen pregunta' style={{ width: 120, height: 80, objectFit: 'cover', display: 'block' }} />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button size='small' variant='outlined' onClick={() => setMediaOpen(true)} startIcon={<Icon icon='mdi:image-edit' />}>
                  Cambiar imagen
                </Button>
                <Button size='small' color='error' variant='outlined' onClick={() => setImagenUrl(null)} startIcon={<Icon icon='mdi:image-off' />}>
                  Quitar imagen
                </Button>
              </Box>
            </Box>
          ) : (
            <Button variant='outlined' size='small' onClick={() => setMediaOpen(true)} startIcon={<Icon icon='mdi:image-plus' />}>
              Agregar imagen
            </Button>
          )}
        </Grid>

        {/* Audio de sustento */}
        <Grid item xs={12}>
          <Typography variant='caption' color='text.secondary' fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
            Audio de sustento (para la respuesta correcta)
          </Typography>
          <AudioRecorder token={token} value={audioUrl} onChange={setAudioUrl} />
        </Grid>

        {/* Alternativas */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Box>
              <Typography variant='subtitle2'>Alternativas</Typography>
              <Typography variant='caption' color='text.secondary'>
                Marca el radio de la respuesta correcta · {opciones.length}/6 alternativas
              </Typography>
            </Box>
            <Button size='small' variant='outlined' startIcon={<Icon icon='mdi:plus' />}
              onClick={addOpcion} disabled={opciones.length >= 6}>
              Agregar alternativa
            </Button>
          </Box>

          {opciones.map((op, i) => (
            <Box key={i} sx={{ mb: 1.5, p: 1.5, borderRadius: 1, border: '1px solid', borderColor: op.es_correcta ? 'success.light' : 'divider', bgcolor: op.es_correcta ? 'success.lighter' : 'transparent' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip title='Marcar como correcta'>
                  <Radio size='small' checked={op.es_correcta} onChange={() => setCorrecta(i)} color='success' />
                </Tooltip>
                <Chip label={LETRAS[i]} size='small' color={op.es_correcta ? 'success' : 'default'} variant='tonal' sx={{ minWidth: 28, flexShrink: 0 }} />
                <TextField
                  fullWidth size='small'
                  placeholder={`Texto alternativa ${LETRAS[i]}${op.es_correcta ? ' (correcta)' : ''}`}
                  value={op.texto}
                  onChange={e => setOpcionField(i, 'texto', e.target.value)}
                />
                <Tooltip title={opciones.length <= 2 ? 'Mínimo 2 alternativas' : 'Eliminar alternativa'}>
                  <span>
                    <IconButton size='small' color='error' onClick={() => removeOpcion(i)} disabled={opciones.length <= 2}>
                      <Icon icon='mdi:close' fontSize={16} />
                    </IconButton>
                  </span>
                </Tooltip>
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

      <MediaLibrary
        open={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelect={(url) => { setImagenUrl(url); setMediaOpen(false) }}
        title='Seleccionar imagen para la pregunta'
        acceptType='IMAGEN'
      />
    </Card>
  )
}

// ── Wrapper arrastrable ────────────────────────────────────────────────────
function SortablePreguntaItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      {Children.map(children, (child: any) => cloneElement(child, { dragHandleProps: { ...attributes, ...listeners } }))}
    </div>
  )
}

// ── Ítem de pregunta ──────────────────────────────────────────────────────
function PreguntaItem({ pregunta, simulacroId, token, onRefresh, dragHandleProps }: {
  pregunta: Pregunta; simulacroId: string; token: string | null; onRefresh: () => void
  dragHandleProps?: Record<string, any>
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

  return (
    <Card variant='outlined' sx={{ mb: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 1 }}>
        {dragHandleProps && (
          <Box {...dragHandleProps} sx={{ display: 'flex', alignItems: 'center', cursor: 'grab', flexShrink: 0, color: 'text.disabled', '&:active': { cursor: 'grabbing' } }}>
            <i className='tabler-grip-vertical text-[18px]' />
          </Box>
        )}
        {pregunta.imagen_url && (
          <Box sx={{ flexShrink: 0, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
            <img src={pregunta.imagen_url} alt='' style={{ width: 48, height: 32, objectFit: 'cover', display: 'block' }} />
          </Box>
        )}
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
          {pregunta.imagen_url && (
            <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden', maxWidth: 400, border: '1px solid', borderColor: 'divider' }}>
              <img src={pregunta.imagen_url} alt='Imagen de la pregunta' style={{ width: '100%', maxHeight: 200, objectFit: 'contain', display: 'block' }} />
            </Box>
          )}
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
  const { enqueueSnackbar } = useSnackbar()
  const { data: session } = useSession()
  const token = session?.user?.accessToken ?? null
  const [adding, setAdding] = useState(false)
  const [importing, setImporting] = useState(false)
  const [ordenadas, setOrdenadas] = useState<Pregunta[]>([])

  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const base = `${getBaseURL()}/api/simulacros/${simulacroId}/preguntas`

  const { data: preguntas = [], isLoading, refetch } = useQuery<Pregunta[]>({
    queryKey: ['simulacro-preguntas', simulacroId],
    queryFn: async () => {
      const { data } = await axios.get(base, { headers })
      return data.result ?? []
    },
    enabled: !!simulacroId,
  })

  useEffect(() => { setOrdenadas(preguntas) }, [preguntas])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = ordenadas.findIndex(p => p.id === active.id)
    const newIndex = ordenadas.findIndex(p => p.id === over.id)
    const reordered = arrayMove(ordenadas, oldIndex, newIndex)
    setOrdenadas(reordered)

    try {
      await axios.patch(`${base}/reordenar`, { items: reordered.map((p, i) => ({ id: p.id, orden: i })) }, { headers })
    } catch {
      enqueueSnackbar('Error al reordenar las preguntas', { variant: 'error' })
      setOrdenadas(preguntas)
    }
  }

  const pool = numeroPreguntasSimulacro ?? 0
  const faltantes = pool > 0 ? Math.max(0, pool - ordenadas.length) : 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant='h6'>Banco de preguntas</Typography>
          <Typography variant='caption' color='text.secondary'>
            {ordenadas.length} pregunta{ordenadas.length !== 1 ? 's' : ''} en el banco
            {pool > 0 && ordenadas.length > pool && (
              <> · Se mostrarán <strong>{pool}</strong> aleatorias por intento</>
            )}
          </Typography>
        </Box>
        {!adding && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant='outlined' startIcon={<Icon icon='mdi:file-upload-outline' />} onClick={() => setImporting(true)}>
              Importar preguntas
            </Button>
            <Button variant='contained' startIcon={<Icon icon='mdi:plus' />} onClick={() => setAdding(true)}>
              Agregar pregunta
            </Button>
          </Box>
        )}
      </Box>

      {/* Aviso: banco insuficiente */}
      {faltantes > 0 && (
        <Alert severity='warning' sx={{ mb: 2 }}>
          El simulacro requiere <strong>{pool}</strong> preguntas por intento, pero el banco solo tiene <strong>{ordenadas.length}</strong>.
          Faltan <strong>{faltantes}</strong> pregunta{faltantes !== 1 ? 's' : ''} para poder publicar.
        </Alert>
      )}

      {/* Aviso: pool mayor que banco (pool aleatorio) */}
      {pool > 0 && ordenadas.length > pool && (
        <Alert severity='info' sx={{ mb: 2 }}>
          El banco tiene <strong>{ordenadas.length}</strong> preguntas · Se seleccionarán <strong>{pool}</strong> aleatoriamente por intento con alternativas barajadas.
        </Alert>
      )}

      {adding && (
        <PreguntaForm simulacroId={simulacroId} token={token}
          onSaved={() => { setAdding(false); refetch() }}
          onCancel={() => setAdding(false)} />
      )}

      {isLoading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>
      ) : ordenadas.length === 0 && !adding ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <Icon icon='mdi:clipboard-text-off' fontSize={40} />
          <Typography variant='body2' sx={{ mt: 1 }}>No hay preguntas aún. Agrega la primera o impórtalas desde un examen existente.</Typography>
        </Box>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={ordenadas.map(p => p.id)} strategy={verticalListSortingStrategy}>
            {ordenadas.map(p => (
              <SortablePreguntaItem key={p.id} id={p.id}>
                <PreguntaItem pregunta={p} simulacroId={simulacroId} token={token} onRefresh={refetch} />
              </SortablePreguntaItem>
            ))}
          </SortableContext>
        </DndContext>
      )}

      <ImportarPreguntasModal
        open={importing}
        onClose={() => setImporting(false)}
        simulacroId={simulacroId}
        token={token}
        onImported={() => { setImporting(false); refetch() }}
      />
    </Box>
  )
}
