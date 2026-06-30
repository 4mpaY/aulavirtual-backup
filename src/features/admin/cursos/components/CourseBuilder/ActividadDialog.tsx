'use client'

import { useState, useEffect } from 'react'

import {
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Stack,
  Card,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  alpha
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { toast } from 'react-toastify'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import {
  useCreateActividad,
  useUpdateActividad,
  useActividadById,
  useCreatePreguntaActividad,
  useUpdatePreguntaActividad,
  useDeletePreguntaActividad
} from '../../hooks/useCursos'

// ─── Question editor (shared with EvaluacionDialog style) ────────────────────

function QuestionForm({
  initial,
  onSave,
  onCancel,
  isSaving
}: {
  initial?: any
  onSave: (data: any) => void
  onCancel: () => void
  isSaving: boolean
}) {
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
    <Box sx={{
      border: '1.5px solid',
      borderColor: 'secondary.main',
      borderRadius: 3,
      p: 2.5,
      bgcolor: theme => alpha(theme.palette.secondary.main, 0.04)
    }}>
      <Stack spacing={2}>
        <CustomTextField
          fullWidth
          multiline
          rows={2}
          label='Enunciado de la pregunta *'
          value={texto}
          onChange={e => setTexto(e.target.value)}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CustomTextField
            label='Puntos'
            type='number'
            value={puntos}
            onChange={e => setPuntos(Number(e.target.value))}
            sx={{ width: 110 }}
            inputProps={{ min: 1 }}
          />
          <Box sx={{ flex: 1 }} />
          <Button
            size='small'
            variant='outlined'
            startIcon={<i className='tabler-plus' style={{ fontSize: '0.8rem' }} />}
            onClick={() => setOpciones([...opciones, { texto: '', es_correcta: false }])}
          >
            Añadir opción
          </Button>
        </Box>

        <Divider>
          <Typography variant='caption' color='text.secondary' fontWeight={600}>ALTERNATIVAS</Typography>
        </Divider>

        <Stack spacing={1.25}>
          {opciones.map((opt, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem',
                fontWeight: 700, flexShrink: 0,
                bgcolor: opt.es_correcta ? 'success.main' : 'action.disabledBackground',
                color: opt.es_correcta ? 'white' : 'text.disabled'
              }}>
                {String.fromCharCode(65 + idx)}
              </Box>
              <CustomTextField
                fullWidth
                size='small'
                placeholder={`Opción ${idx + 1}`}
                value={opt.texto}
                onChange={e => handleOptionChange(idx, 'texto', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: opt.es_correcta ? alpha('#16a34a', 0.07) : 'transparent' } }}
              />
              <Tooltip title='Marcar como correcta'>
                <Switch
                  size='small'
                  color='success'
                  checked={opt.es_correcta}
                  onChange={e => handleOptionChange(idx, 'es_correcta', e.target.checked)}
                />
              </Tooltip>
              <IconButton
                size='small'
                color='error'
                disabled={opciones.length <= 2}
                onClick={() => setOpciones(opciones.filter((_, i) => i !== idx))}
              >
                <i className='tabler-trash' style={{ fontSize: '0.9rem' }} />
              </IconButton>
            </Box>
          ))}
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 0.5 }}>
          <Button size='small' variant='outlined' onClick={onCancel} disabled={isSaving}>
            Cancelar
          </Button>
          <Button size='small' variant='contained' onClick={handleSubmit} disabled={isSaving || !texto}>
            {isSaving ? 'Guardando...' : initial?.id ? 'Guardar cambios' : 'Guardar'}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

// ─── Main dialog ──────────────────────────────────────────────────────────────

interface ActividadDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  cursoId: string
  moduloId?: string | null
  moduloTitulo?: string
  actividadId?: string | null
}

type Phase = 'config' | 'preguntas'

const defaultConfig = {
  titulo: '',
  instrucciones: '',
  tipo: 'ARCHIVO' as 'ARCHIVO' | 'FORMULARIO',
  puntaje_maximo: 20,
  esta_publicado: true,
  fecha_inicio: null as string | null,
  fecha_fin: null as string | null
}

export function ActividadDialog({
  open,
  onClose,
  onSuccess,
  cursoId,
  moduloId,
  moduloTitulo,
  actividadId: actividadIdProp
}: ActividadDialogProps) {
  const { enqueueSnackbar } = useSnackbar()
  const [phase, setPhase] = useState<Phase>('config')
  const [activeActId, setActiveActId] = useState<string | null>(actividadIdProp || null)
  const [config, setConfig] = useState({ ...defaultConfig })
  const [editingQuestion, setEditingQuestion] = useState<any>(null)
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const createMutation = useCreateActividad()
  const updateMutation = useUpdateActividad()
  const createPreguntaMutation = useCreatePreguntaActividad()
  const updatePreguntaMutation = useUpdatePreguntaActividad()
  const deletePreguntaMutation = useDeletePreguntaActividad()

  const { data: actividadData, isLoading, refetch } = useActividadById(cursoId, activeActId || '')

  useEffect(() => {
    if (open) {
      setActiveActId(actividadIdProp || null)
      setPhase(actividadIdProp ? 'config' : 'config')
      setEditingQuestion(null)
      setShowQuestionForm(false)
    }
  }, [open, actividadIdProp])

  useEffect(() => {
    if (actividadData?.actividad && phase === 'config') {
      const a = actividadData.actividad
      const toLocal = (val: any) => {
        if (!val) return null
        const d = new Date(val)

        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      }

      setConfig({
        titulo: a.titulo || '',
        instrucciones: a.instrucciones || '',
        tipo: a.tipo || 'ARCHIVO',
        puntaje_maximo: a.puntaje_maximo ?? 20,
        esta_publicado: a.esta_publicado ?? true,
        fecha_inicio: toLocal(a.fecha_inicio),
        fecha_fin: toLocal(a.fecha_fin)
      })
    }
  }, [actividadData, phase])

  const set = (key: keyof typeof defaultConfig, value: any) =>
    setConfig(prev => ({ ...prev, [key]: value }))

  const toISO = (val: string | null) => (val ? new Date(val).toISOString() : null)

  const handleSaveConfig = async () => {
    if (!config.titulo.trim()) return

    const payload = {
      ...config,
      fecha_inicio: toISO(config.fecha_inicio),
      fecha_fin: toISO(config.fecha_fin)
    }

    try {
      if (activeActId) {
        await updateMutation.mutateAsync({ cursoId, actId: activeActId, data: payload })
        enqueueSnackbar('Actividad actualizada', { variant: 'success' })
      } else {
        const res = await createMutation.mutateAsync({
          cursoId,
          data: { ...payload, modulo_id: moduloId || null }
        })

        setActiveActId(res.actividad.id)
        enqueueSnackbar(
          config.tipo === 'FORMULARIO'
            ? 'Actividad creada. Ahora añade las preguntas.'
            : 'Actividad creada correctamente.',
          { variant: 'success' }
        )
      }

      if (config.tipo === 'FORMULARIO') {
        setPhase('preguntas')
      } else {
        onSuccess()
        onClose()
      }
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar', { variant: 'error' })
    }
  }

  const handleSaveQuestion = async (formData: any) => {
    if (!activeActId) return

    try {
      if (editingQuestion?.id) {
        await updatePreguntaMutation.mutateAsync({
          cursoId, actId: activeActId, pregId: editingQuestion.id, data: formData
        })
        enqueueSnackbar('Pregunta actualizada', { variant: 'success' })
      } else {
        await createPreguntaMutation.mutateAsync({ cursoId, actId: activeActId, data: formData })
        enqueueSnackbar('Pregunta añadida', { variant: 'success' })
      }

      setEditingQuestion(null)
      setShowQuestionForm(false)
      refetch()
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar pregunta', { variant: 'error' })
    }
  }

  const handleDeleteQuestion = async (pregId: string) => {
    if (!activeActId || !window.confirm('¿Eliminar esta pregunta?')) return

    try {
      await deletePreguntaMutation.mutateAsync({ cursoId, actId: activeActId, pregId })
      enqueueSnackbar('Pregunta eliminada', { variant: 'success' })
      refetch()
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error', { variant: 'error' })
    }
  }

  const isSavingConfig = createMutation.isPending || updateMutation.isPending
  const isSavingQuestion = createPreguntaMutation.isPending || updatePreguntaMutation.isPending
  const preguntas = actividadData?.actividad?.preguntas || []
  const isFormulario = config.tipo === 'FORMULARIO'
  const canGoToPreguntas = activeActId && isFormulario

  const dateInputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.23)', fontSize: '0.875rem',
    fontFamily: 'inherit', boxSizing: 'border-box' as const, outline: 'none',
    color: 'inherit', background: 'transparent'
  }

  return (
    <AppModal
      open={open}
      handleClose={onClose}
      disableClose={isSavingConfig || isSavingQuestion}
      sx={{ p: 0, maxWidth: 720 }}
    >
      {/* ── Header ── */}
      <Box sx={{
        px: 3.5, pt: 3.5, pb: 0,
        borderBottom: '1px solid', borderColor: 'divider',
        position: 'sticky', top: 0,
        bgcolor: 'background.paper', zIndex: 1,
        borderRadius: '16px 16px 0 0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2, pr: 4 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: 2, flexShrink: 0,
            bgcolor: alpha('#7c3aed', 0.1),
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <i className='tabler-file-check' style={{ fontSize: '1.2rem', color: '#7c3aed' }} />
          </Box>
          <Box>
            <Typography variant='h6' fontWeight={800} sx={{ lineHeight: 1.2 }}>
              {actividadIdProp ? 'Editar tarea / actividad' : 'Nueva tarea / actividad'}
            </Typography>
            {moduloTitulo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.4 }}>
                <i className='tabler-layout-list' style={{ fontSize: '0.75rem', color: '#6b7280' }} />
                <Typography variant='caption' color='text.secondary' fontWeight={500}>{moduloTitulo}</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {isFormulario && (
          <Tabs
            value={phase}
            onChange={(_, v) => { if (v === 'preguntas' && !canGoToPreguntas) return; setPhase(v) }}
            sx={{
              '& .MuiTabs-indicator': { bgcolor: '#7c3aed', height: 3, borderRadius: '3px 3px 0 0' },
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: '0.875rem', color: 'text.secondary' },
              '& .Mui-selected': { color: '#7c3aed !important' }
            }}
          >
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{
                    width: 20, height: 20, borderRadius: '50%', fontSize: '0.7rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: phase === 'config' ? '#7c3aed' : 'action.disabledBackground',
                    color: phase === 'config' ? 'white' : 'text.disabled'
                  }}>1</Box>
                  Configuración
                </Box>
              }
              value='config'
            />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{
                    width: 20, height: 20, borderRadius: '50%', fontSize: '0.7rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    bgcolor: phase === 'preguntas' ? '#7c3aed' : 'action.disabledBackground',
                    color: phase === 'preguntas' ? 'white' : 'text.disabled',
                    opacity: !canGoToPreguntas ? 0.4 : 1
                  }}>2</Box>
                  Preguntas
                  {preguntas.length > 0 && (
                    <Chip label={preguntas.length} size='small' sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700, bgcolor: alpha('#7c3aed', 0.12), color: '#7c3aed' }} />
                  )}
                </Box>
              }
              value='preguntas'
              disabled={!canGoToPreguntas}
            />
          </Tabs>
        )}
      </Box>

      {/* ── Body ── */}
      <Box sx={{ px: 3.5, py: 3, overflowY: 'auto', maxHeight: 'calc(80vh - 200px)' }}>

        {/* ── Config phase ── */}
        {phase === 'config' && (
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Título de la tarea / actividad *'
                placeholder='Ej: Resumen de la Independencia del Perú'
                value={config.titulo}
                onChange={e => set('titulo', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                multiline
                rows={3}
                label='Instrucciones para el estudiante'
                placeholder='Ej: Elabora un resumen en PDF de máximo 2 páginas sobre la Independencia del Perú y súbelo aquí.'
                value={config.instrucciones}
                onChange={e => set('instrucciones', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='caption' fontWeight={600} color='text.secondary' sx={{ display: 'block', mb: 1 }}>
                Tipo de entrega
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={config.tipo}
                onChange={(_, v) => { if (v) set('tipo', v) }}
                size='small'
                fullWidth
              >
                <ToggleButton value='ARCHIVO' sx={{ flex: 1, textTransform: 'none', fontWeight: 700, gap: 1 }}>
                  <i className='tabler-upload' />
                  Subida de archivo
                </ToggleButton>
                <ToggleButton value='FORMULARIO' sx={{ flex: 1, textTransform: 'none', fontWeight: 700, gap: 1 }}>
                  <i className='tabler-list-check' />
                  Formulario con preguntas
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                type='number'
                label='Puntaje máximo'
                inputProps={{ min: 1, max: 20, step: 1 }}
                value={config.puntaje_maximo}
                onChange={e => set('puntaje_maximo', Number(e.target.value))}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }}>
                <Typography variant='caption' color='text.secondary' fontWeight={600}>
                  FECHA LÍMITE (OPCIONAL)
                </Typography>
              </Divider>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='caption' sx={{ fontWeight: 600, display: 'block', mb: 0.75, color: 'text.secondary' }}>
                Fecha de apertura
              </Typography>
              <input
                type='datetime-local'
                value={config.fecha_inicio || ''}
                onChange={e => set('fecha_inicio', e.target.value || null)}
                style={dateInputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant='caption' sx={{ fontWeight: 600, display: 'block', mb: 0.75, color: 'text.secondary' }}>
                Fecha de cierre
              </Typography>
              <input
                type='datetime-local'
                value={config.fecha_fin || ''}
                onChange={e => set('fecha_fin', e.target.value || null)}
                style={dateInputStyle}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{
                display: 'flex', gap: 1.5, p: 2,
                borderRadius: 2.5, bgcolor: 'action.hover',
                border: '1px solid', borderColor: 'divider'
              }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.esta_publicado}
                      onChange={e => set('esta_publicado', e.target.checked)}
                      color='success'
                    />
                  }
                  label={
                    <Box>
                      <Typography variant='body2' fontWeight={600}>Publicar actividad</Typography>
                      <Typography variant='caption' color='text.secondary'>Visible para los estudiantes</Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>
          </Grid>
        )}

        {/* ── Questions phase (FORMULARIO only) ── */}
        {phase === 'preguntas' && (
          <Box>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress sx={{ color: '#7c3aed' }} />
              </Box>
            ) : (
              <>
                <Box sx={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  mb: 2.5, p: 2, borderRadius: 2.5,
                  bgcolor: alpha('#7c3aed', 0.06),
                  border: '1px solid', borderColor: alpha('#7c3aed', 0.15)
                }}>
                  <Box>
                    <Typography variant='subtitle2' fontWeight={800} color='#7c3aed'>
                      {actividadData?.actividad?.titulo}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {preguntas.length} pregunta{preguntas.length !== 1 ? 's' : ''} · Puntaje máximo: {actividadData?.actividad?.puntaje_maximo ?? 20} pts
                    </Typography>
                  </Box>
                  {!showQuestionForm && !editingQuestion && (
                    <Button
                      variant='contained'
                      size='small'
                      startIcon={<i className='tabler-plus' style={{ fontSize: '0.85rem' }} />}
                      onClick={() => { setShowQuestionForm(true); setEditingQuestion(null) }}
                      sx={{ bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' }, textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                    >
                      Añadir pregunta
                    </Button>
                  )}
                </Box>

                {showQuestionForm && !editingQuestion && (
                  <Box sx={{ mb: 3 }}>
                    <QuestionForm
                      onSave={handleSaveQuestion}
                      onCancel={() => setShowQuestionForm(false)}
                      isSaving={isSavingQuestion}
                    />
                  </Box>
                )}

                {preguntas.length === 0 && !showQuestionForm && (
                  <Box sx={{ textAlign: 'center', py: 7, color: 'text.disabled' }}>
                    <i className='tabler-help-circle' style={{ fontSize: '3rem', display: 'block', marginBottom: 12 }} />
                    <Typography variant='body2' color='text.secondary'>
                      Aún no hay preguntas. Añade la primera.
                    </Typography>
                  </Box>
                )}

                {preguntas.length > 0 && (
                  <Stack spacing={2}>
                    {preguntas.map((p: any, idx: number) => (
                      <Card key={p.id} variant='outlined' sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
                        {editingQuestion?.id === p.id ? (
                          <Box sx={{ p: 2 }}>
                            <QuestionForm
                              initial={p}
                              onSave={handleSaveQuestion}
                              onCancel={() => setEditingQuestion(null)}
                              isSaving={isSavingQuestion}
                            />
                          </Box>
                        ) : (
                          <>
                            <Box sx={{ px: 2.5, pt: 2, pb: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                <Box sx={{ display: 'flex', gap: 1.25, flex: 1, minWidth: 0 }}>
                                  <Box sx={{
                                    width: 26, height: 26, borderRadius: '50%', bgcolor: alpha('#7c3aed', 0.1),
                                    color: '#7c3aed', fontSize: '0.72rem', fontWeight: 800, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0.15
                                  }}>{idx + 1}</Box>
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant='body2' fontWeight={700} sx={{ lineHeight: 1.4 }}>{p.texto}</Typography>
                                    <Chip label={`${p.puntos} pto${p.puntos !== 1 ? 's' : ''}`} size='small' sx={{ mt: 0.5, height: 18, fontSize: '0.68rem', fontWeight: 700 }} />
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0 }}>
                                  <Tooltip title='Editar'>
                                    <IconButton size='small' onClick={() => { setEditingQuestion(p); setShowQuestionForm(false) }} sx={{ color: 'primary.main' }}>
                                      <i className='tabler-edit' style={{ fontSize: '0.9rem' }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title='Eliminar'>
                                    <IconButton size='small' color='error' onClick={() => handleDeleteQuestion(p.id)}>
                                      <i className='tabler-trash' style={{ fontSize: '0.9rem' }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </Box>
                            </Box>
                            <Divider />
                            <Grid container spacing={0} sx={{ p: 1.5 }}>
                              {p.opciones?.map((opt: any, optIdx: number) => (
                                <Grid item xs={12} sm={6} key={opt.id} sx={{ p: 0.5 }}>
                                  <Box sx={{
                                    p: 1.25, borderRadius: 1.5, border: '1px solid',
                                    borderColor: opt.es_correcta ? 'success.main' : 'divider',
                                    bgcolor: opt.es_correcta ? alpha('#16a34a', 0.08) : 'transparent',
                                    display: 'flex', alignItems: 'center', gap: 1
                                  }}>
                                    <Box sx={{
                                      width: 22, height: 22, borderRadius: '50%', display: 'flex',
                                      alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem',
                                      fontWeight: 800, flexShrink: 0,
                                      bgcolor: opt.es_correcta ? 'success.main' : 'action.disabledBackground',
                                      color: opt.es_correcta ? 'white' : 'text.disabled'
                                    }}>{String.fromCharCode(65 + optIdx)}</Box>
                                    <Typography variant='body2' color={opt.es_correcta ? 'success.main' : 'text.primary'} fontWeight={opt.es_correcta ? 600 : 400} sx={{ fontSize: '0.8rem' }}>
                                      {opt.texto}
                                    </Typography>
                                    {opt.es_correcta && <i className='tabler-check' style={{ fontSize: '0.85rem', color: '#16a34a', marginLeft: 'auto', flexShrink: 0 }} />}
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
      </Box>

      {/* ── Footer ── */}
      <Box sx={{
        px: 3.5, py: 2.5,
        borderTop: '1px solid', borderColor: 'divider',
        display: 'flex', gap: 1.5, justifyContent: 'flex-end',
        bgcolor: 'background.paper', borderRadius: '0 0 16px 16px'
      }}>
        {phase === 'config' ? (
          <>
            <Button variant='outlined' onClick={onClose} disabled={isSavingConfig} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Cancelar
            </Button>
            <Button
              variant='contained'
              onClick={handleSaveConfig}
              disabled={!config.titulo.trim() || isSavingConfig}
              endIcon={isFormulario && !activeActId ? <i className='tabler-arrow-right' style={{ fontSize: '0.9rem' }} /> : undefined}
              sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
            >
              {isSavingConfig
                ? 'Guardando...'
                : isFormulario && !activeActId
                  ? 'Crear y añadir preguntas'
                  : activeActId
                    ? isFormulario ? 'Guardar y continuar' : 'Guardar cambios'
                    : 'Crear actividad'}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant='outlined'
              onClick={() => setPhase('config')}
              startIcon={<i className='tabler-arrow-left' style={{ fontSize: '0.9rem' }} />}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Configuración
            </Button>
            <Button
              variant='contained'
              color='success'
              onClick={() => { onSuccess(); onClose() }}
              startIcon={<i className='tabler-check' style={{ fontSize: '0.9rem' }} />}
              sx={{ textTransform: 'none', fontWeight: 700 }}
            >
              Finalizar
            </Button>
          </>
        )}
      </Box>
    </AppModal>
  )
}
