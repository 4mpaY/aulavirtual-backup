'use client'

import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Slider,
  ButtonGroup,
  Divider,
  Stack,
  Card,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'
import {
  useCreateExamen,
  useUpdateExamen,
  useExamenById,
  useCreatePreguntaExamen,
  useUpdatePreguntaExamen,
  useDeletePreguntaExamen
} from '../../hooks/useCursos'

// ─── Question inline editor ──────────────────────────────────────────────────

interface QuestionFormProps {
  initial?: any
  onSave: (data: any) => void
  onCancel: () => void
  isSaving: boolean
}

function QuestionForm({ initial, onSave, onCancel, isSaving }: QuestionFormProps) {
  const [texto, setTexto] = useState(initial?.texto || '')
  const [puntos, setPuntos] = useState(initial?.puntos || 1)

  const [opciones, setOpciones] = useState<any[]>(
    initial?.opciones?.map((o: any) => ({ ...o })) || [
      { texto: '', es_correcta: false },
      { texto: '', es_correcta: false }
    ]
  )

  const handleOptionChange = (idx: number, field: string, value: any) => {
    const next = [...opciones]

    if (field === 'es_correcta' && value === true) {
      next.forEach((o, i) => (o.es_correcta = i === idx))
    } else {
      next[idx][field] = value
    }

    setOpciones(next)
  }

  const handleSubmit = () => {
    if (!texto.trim()) return toast.error('El enunciado es requerido')
    if (!opciones.some(o => o.es_correcta)) return toast.error('Marca al menos una respuesta correcta')
    if (opciones.some(o => !o.texto.trim())) return toast.error('Todas las opciones deben tener texto')
    onSave({ texto, tipo: 'OPCION_MULTIPLE', puntos, opciones })
  }

  return (
    <Box sx={{ border: '1px solid', borderColor: 'primary.light', borderRadius: 2, p: 3, bgcolor: 'action.hover' }}>
      <Stack spacing={2}>
        <CustomTextField
          fullWidth
          multiline
          rows={2}
          label='Enunciado de la pregunta *'
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />
        <CustomTextField
          label='Puntos'
          type='number'
          value={puntos}
          onChange={e => setPuntos(Number(e.target.value))}
          sx={{ width: 120 }}
        />
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='subtitle2' fontWeight={700}>Alternativas</Typography>
          <Button
            size='small'
            startIcon={<i className='tabler-plus' />}
            onClick={() => setOpciones([...opciones, { texto: '', es_correcta: false }])}
          >
            Añadir opción
          </Button>
        </Box>
        <Stack spacing={1.5}>
          {opciones.map((opt, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title='Correcta'>
                <Switch
                  size='small'
                  color='success'
                  checked={opt.es_correcta}
                  onChange={e => handleOptionChange(idx, 'es_correcta', e.target.checked)}
                />
              </Tooltip>
              <CustomTextField
                fullWidth
                size='small'
                placeholder={`Opción ${idx + 1}`}
                value={opt.texto}
                onChange={e => handleOptionChange(idx, 'texto', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: opt.es_correcta ? 'success.lightOpacity' : 'transparent'
                  }
                }}
              />
              <IconButton
                size='small'
                color='error'
                disabled={opciones.length <= 2}
                onClick={() => setOpciones(opciones.filter((_, i) => i !== idx))}
              >
                <i className='tabler-trash text-sm' />
              </IconButton>
            </Box>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button size='small' variant='outlined' onClick={onCancel} disabled={isSaving}>Cancelar</Button>
          <Button size='small' variant='contained' onClick={handleSubmit} disabled={isSaving || !texto}>
            {isSaving ? 'Guardando...' : initial?.id ? 'Guardar cambios' : 'Añadir pregunta'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

interface EvaluacionDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  cursoId: string
  moduloId?: string | null
  moduloTitulo?: string
  examenId?: string | null  // if editing existing
}

type Phase = 'config' | 'questions'

const defaultConfig = {
  titulo: '',
  descripcion: '',
  peso: 1 as 1 | 2 | 3,
  progreso_minimo: 0,
  puntaje_aprobacion: 12, // Default 12/20
  intentos_maximos: 1,
  limite_tiempo: null as number | null,
  mezclar_preguntas: false,
  esta_publicado: false,
  fecha_inicio: null as string | null,
  fecha_fin: null as string | null
}

export function EvaluacionDialog({
  open,
  onClose,
  onSuccess,
  cursoId,
  moduloId,
  moduloTitulo,
  examenId: examenIdProp
}: EvaluacionDialogProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [phase, setPhase] = useState<Phase>('config')
  const [activeExamenId, setActiveExamenId] = useState<string | null>(examenIdProp || null)
  const [config, setConfig] = useState({ ...defaultConfig })
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const createExamenMutation = useCreateExamen()
  const updateExamenMutation = useUpdateExamen()
  const createPreguntaMutation = useCreatePreguntaExamen()
  const updatePreguntaMutation = useUpdatePreguntaExamen()
  const deletePreguntaMutation = useDeletePreguntaExamen()

  const { data: examenData, isLoading: isLoadingExamen, refetch } = useExamenById(
    cursoId,
    activeExamenId || ''
  )

  // Reset on open
  useEffect(() => {
    if (open) {
      setActiveExamenId(examenIdProp || null)
      setPhase(examenIdProp ? 'questions' : 'config')
      setEditingQuestion(null)
      setShowQuestionForm(false)
    }
  }, [open, examenIdProp])

  // Populate config when editing
  useEffect(() => {
    if (examenData?.examen && phase === 'config') {
      const e = examenData.examen

      const toDatetimeLocal = (val: any) => {
        if (!val) return null
        const d = new Date(val)

        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      }

      setConfig({
        titulo: e.titulo || '',
        descripcion: e.descripcion || '',
        peso: e.peso || 1,
        progreso_minimo: e.progreso_minimo ?? 0,
        puntaje_aprobacion: e.puntaje_aprobacion ? Math.round(e.puntaje_aprobacion / 5) : 12,
        intentos_maximos: e.intentos_maximos || 1,
        limite_tiempo: e.limite_tiempo || null,
        mezclar_preguntas: e.mezclar_preguntas || false,
        esta_publicado: e.esta_publicado || false,
        fecha_inicio: toDatetimeLocal(e.fecha_inicio),
        fecha_fin: toDatetimeLocal(e.fecha_fin)
      })
    }
  }, [examenData, phase])

  const set = (key: keyof typeof defaultConfig, value: any) =>
    setConfig(prev => ({ ...prev, [key]: value }))

  const handleSaveConfig = async () => {
    if (!config.titulo.trim()) return

    const configToSave = {
      ...config,
      puntaje_aprobacion: config.puntaje_aprobacion * 5, // Convert back to percentage 0-100 for DB
      fecha_inicio: config.fecha_inicio || null,
      fecha_fin: config.fecha_fin || null
    }

    try {
      if (activeExamenId) {
        await updateExamenMutation.mutateAsync({ cursoId, examenId: activeExamenId, data: configToSave })
        enqueueSnackbar('Evaluación actualizada', { variant: 'success' })
      } else {
        const res = await createExamenMutation.mutateAsync({
          cursoId,
          data: { ...configToSave, tipo: 'INTERMEDIO', modulo_id: moduloId || null }
        })

        setActiveExamenId(res.examen.id)
        enqueueSnackbar('Evaluación creada. Ahora añade las preguntas.', { variant: 'success' })
      }

      setPhase('questions')
      onSuccess()
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar', { variant: 'error' })
    }
  }

  const handleSaveQuestion = async (formData: any) => {
    if (!activeExamenId) return

    try {
      if (editingQuestion?.id) {
        await updatePreguntaMutation.mutateAsync({
          cursoId,
          examenId: activeExamenId,
          preguntaId: editingQuestion.id,
          data: formData
        })
        enqueueSnackbar('Pregunta actualizada', { variant: 'success' })
      } else {
        await createPreguntaMutation.mutateAsync({ cursoId, examenId: activeExamenId, data: formData })
        enqueueSnackbar('Pregunta añadida', { variant: 'success' })
      }

      setEditingQuestion(null)
      setShowQuestionForm(false)
      refetch()
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar pregunta', { variant: 'error' })
    }
  }

  const handleDeleteQuestion = async (preguntaId: string) => {
    if (!activeExamenId || !window.confirm('¿Eliminar esta pregunta?')) return

    try {
      await deletePreguntaMutation.mutateAsync({ cursoId, examenId: activeExamenId, preguntaId })
      enqueueSnackbar('Pregunta eliminada', { variant: 'success' })
      refetch()
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error', { variant: 'error' })
    }
  }

  const isSavingConfig = createExamenMutation.isPending || updateExamenMutation.isPending
  const isSavingQuestion = createPreguntaMutation.isPending || updatePreguntaMutation.isPending
  const preguntas = examenData?.examen?.preguntas || []

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth scroll='paper'>
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {phase === 'questions' && (
            <IconButton size='small' onClick={() => setPhase('config')}>
              <i className='tabler-arrow-left' />
            </IconButton>
          )}
          <Box>
            {examenIdProp ? 'Editar Evaluación Intermedia' : 'Nueva Evaluación Intermedia'}
            {moduloTitulo && (
              <Typography variant='caption' display='block' color='text.secondary'>
                Módulo: {moduloTitulo}
              </Typography>
            )}
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Chip
              size='small'
              label='1. Configuración'
              variant={phase === 'config' ? 'filled' : 'outlined'}
              color={phase === 'config' ? 'primary' : 'default'}
            />
            <Chip
              size='small'
              label='2. Preguntas'
              variant={phase === 'questions' ? 'filled' : 'outlined'}
              color={phase === 'questions' ? 'primary' : 'default'}
              disabled={!activeExamenId}
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: 400 }}>
        {/* ── PHASE 1: Config ── */}
        {phase === 'config' && (
          <Grid container spacing={3} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Título de la evaluación *'
                placeholder='Ej: Evaluación del Módulo 1'
                value={config.titulo}
                onChange={e => set('titulo', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={2}
                label='Descripción / Instrucciones'
                placeholder='Instrucciones para el estudiante...'
                value={config.descripcion}
                onChange={e => set('descripcion', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='body2' color='text.secondary' gutterBottom sx={{ mb: 1 }}>
                Peso en nota final
              </Typography>
              <ButtonGroup variant='outlined' fullWidth size='small'>
                {([1, 2, 3] as const).map(v => (
                  <Button
                    key={v}
                    onClick={() => set('peso', v)}
                    variant={config.peso === v ? 'contained' : 'outlined'}
                    sx={{ flex: 1 }}
                  >
                    {v} <Typography variant='caption' sx={{ ml: 0.5 }}>
                      {v === 1 ? '(Bajo)' : v === 2 ? '(Medio)' : '(Alto)'}
                    </Typography>
                  </Button>
                ))}
              </ButtonGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type='number'
                label='Puntaje de aprobación (0 - 20)'
                inputProps={{ min: 0, max: 20 }}
                value={config.puntaje_aprobacion}
                onChange={e => {
                  let val = Number(e.target.value)

                  if (val > 20) val = 20

                  if (val < 0) val = 0

                  set('puntaje_aprobacion', val)
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type='number'
                label='Intentos máximos'
                inputProps={{ min: 1 }}
                value={config.intentos_maximos}
                onChange={e => set('intentos_maximos', Number(e.target.value))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='caption' sx={{ fontWeight: 600, display: 'block', mb: 0.75, color: 'text.secondary' }}>
                Fecha de inicio (opcional)
              </Typography>
              <input
                type='datetime-local'
                value={config.fecha_inicio || ''}
                onChange={e => set('fecha_inicio', e.target.value || null)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.23)', fontSize: '0.875rem',
                  fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
                  color: 'inherit', background: 'transparent'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='caption' sx={{ fontWeight: 600, display: 'block', mb: 0.75, color: 'text.secondary' }}>
                Fecha de cierre (opcional)
              </Typography>
              <input
                type='datetime-local'
                value={config.fecha_fin || ''}
                onChange={e => set('fecha_fin', e.target.value || null)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.23)', fontSize: '0.875rem',
                  fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
                  color: 'inherit', background: 'transparent'
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                Progreso mínimo del módulo para desbloquear: <strong>{config.progreso_minimo}%</strong>
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={config.progreso_minimo}
                  onChange={(_, val) => set('progreso_minimo', val as number)}
                  min={0}
                  max={100}
                  step={10}
                  marks
                  valueLabelDisplay='auto'
                  valueLabelFormat={v => `${v}%`}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.mezclar_preguntas}
                      onChange={e => set('mezclar_preguntas', e.target.checked)}
                    />
                  }
                  label='Mezclar preguntas'
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.esta_publicado}
                      onChange={e => set('esta_publicado', e.target.checked)}
                      color='success'
                    />
                  }
                  label='Publicar evaluación'
                />
              </Box>
            </Grid>
          </Grid>
        )}

        {/* ── PHASE 2: Questions ── */}
        {phase === 'questions' && (
          <Box>
            {isLoadingExamen ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant='h6' fontWeight={700}>{examenData?.examen?.titulo}</Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''} · Aprobación: {Math.round((examenData?.examen?.puntaje_aprobacion || 0) / 5)} / 20
                    </Typography>
                  </Box>
                  {!showQuestionForm && !editingQuestion && (
                    <Button
                      variant='contained'
                      size='small'
                      startIcon={<i className='tabler-plus' />}
                      onClick={() => { setShowQuestionForm(true); setEditingQuestion(null) }}
                    >
                      Añadir pregunta
                    </Button>
                  )}
                </Box>

                {/* New question form */}
                {showQuestionForm && !editingQuestion && (
                  <Box sx={{ mb: 3 }}>
                    <QuestionForm
                      onSave={handleSaveQuestion}
                      onCancel={() => setShowQuestionForm(false)}
                      isSaving={isSavingQuestion}
                    />
                  </Box>
                )}

                {/* Question list */}
                {preguntas.length === 0 && !showQuestionForm ? (
                  <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
                    <i className='tabler-help-circle text-5xl' />
                    <Typography sx={{ mt: 2 }}>Aún no hay preguntas. Añade la primera.</Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {preguntas.map((p: any, idx: number) => (
                      <Card key={p.id} variant='outlined' sx={{ p: 3 }}>
                        {editingQuestion?.id === p.id ? (
                          <QuestionForm
                            initial={p}
                            onSave={handleSaveQuestion}
                            onCancel={() => setEditingQuestion(null)}
                            isSaving={isSavingQuestion}
                          />
                        ) : (
                          <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant='subtitle2' fontWeight={700} sx={{ pr: 2 }}>
                                {idx + 1}. {p.texto}
                                <Chip label={`${p.puntos} pto${p.puntos !== 1 ? 's' : ''}`} size='small' sx={{ ml: 1, height: 18 }} />
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                <IconButton
                                  size='small'
                                  color='primary'
                                  onClick={() => { setEditingQuestion(p); setShowQuestionForm(false) }}
                                >
                                  <i className='tabler-edit text-sm' />
                                </IconButton>
                                <IconButton
                                  size='small'
                                  color='error'
                                  onClick={() => handleDeleteQuestion(p.id)}
                                >
                                  <i className='tabler-trash text-sm' />
                                </IconButton>
                              </Box>
                            </Box>
                            <Grid container spacing={1}>
                              {p.opciones?.map((opt: any, optIdx: number) => (
                                <Grid item xs={12} sm={6} key={opt.id}>
                                  <Box sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: opt.es_correcta ? 'success.main' : 'divider',
                                    bgcolor: opt.es_correcta ? 'success.lightOpacity' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                  }}>
                                    <Box sx={{
                                      width: 22,
                                      height: 22,
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      flexShrink: 0,
                                      bgcolor: opt.es_correcta ? 'success.main' : 'action.disabledBackground',
                                      color: opt.es_correcta ? 'white' : 'text.disabled'
                                    }}>
                                      {String.fromCharCode(65 + optIdx)}
                                    </Box>
                                    <Typography variant='body2' color={opt.es_correcta ? 'success.main' : 'text.primary'} fontWeight={opt.es_correcta ? 600 : 400}>
                                      {opt.texto}
                                    </Typography>
                                    {opt.es_correcta && <i className='tabler-check text-success ms-auto' />}
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </>
                        )}
                      </Card>
                    ))}
                  </Stack>
                )}
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        {phase === 'config' ? (
          <>
            <Button variant='outlined' onClick={onClose} disabled={isSavingConfig}>
              Cancelar
            </Button>
            <Button
              variant='contained'
              onClick={handleSaveConfig}
              disabled={!config.titulo.trim() || isSavingConfig}
            >
              {isSavingConfig ? 'Guardando...' : activeExamenId ? 'Guardar y continuar →' : 'Crear y añadir preguntas →'}
            </Button>
          </>
        ) : (
          <>
            <Button variant='outlined' onClick={() => setPhase('config')}>
              ← Editar configuración
            </Button>
            <Button variant='contained' color='success' onClick={onClose}>
              Finalizar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}
