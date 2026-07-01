'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  alpha,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { useSnackbar } from 'notistack'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import {
  evaluarRespuestasActividad,
  getFileIconClass,
  isPdfFile,
  type PreguntaActividadEvaluable
} from '@/utils/functions/calcularNotaActividad'
import { normalizeMediaUrl } from '@/utils/functions/normalizeMediaUrl'
import PdfViewer from '@/features/estudiante/player/components/PdfViewer'
import { useEntregasActividad, useCalificarEntregaActividad } from '../../hooks/useCursos'
import type { Curso, CursoActividadResumen } from '../../entity/Curso'

type ActividadReviewContext = {
  id: string
  titulo: string
  tipo: 'ARCHIVO' | 'FORMULARIO'
  instrucciones?: string | null
  puntaje_maximo: number
  preguntas?: PreguntaActividadEvaluable[]
}

type FiltroEntrega = 'todas' | 'sin_calificar' | 'calificadas'

function ArchivoReviewBlock({ entrega }: { entrega: any }) {
  if (!entrega?.archivo_url) {
    return (
      <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 2 }}>
        El estudiante no adjuntó ningún archivo.
      </Alert>
    )
  }

  const nombre = entrega.archivo_nombre || 'Archivo entregado'
  const pdf = isPdfFile(nombre)
  const archivoUrl = normalizeMediaUrl(entrega.archivo_url)

  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
        ARCHIVO ENTREGADO
      </Typography>
      <Box sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: pdf ? 2 : 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <i className={`${getFileIconClass(nombre)} text-2xl`} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Entregado el{' '}
              {new Date(entrega.creado_en).toLocaleString('es-PE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            component="a"
            href={archivoUrl}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<i className="tabler-download" style={{ fontSize: '0.85rem' }} />}
            sx={{ textTransform: 'none', fontWeight: 600, flexShrink: 0 }}
          >
            Descargar
          </Button>
        </Box>
      </Box>
      {pdf && (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden',
            height: 480,
            bgcolor: 'grey.50'
          }}
        >
          <PdfViewer url={archivoUrl} embedded />
        </Box>
      )}
    </Box>
  )
}

function FormularioReviewBlock({
  preguntas,
  respuestas,
  puntajeMaximo
}: {
  preguntas: PreguntaActividadEvaluable[]
  respuestas: any[] | null | undefined
  puntajeMaximo: number
}) {
  const resultado = useMemo(
    () => evaluarRespuestasActividad(preguntas, respuestas, puntajeMaximo),
    [preguntas, respuestas, puntajeMaximo]
  )

  const respMap = useMemo(
    () => new Map((respuestas || []).map(r => [r.pregunta_id, r.opcion_id])),
    [respuestas]
  )

  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          RESPUESTAS DEL ESTUDIANTE
        </Typography>
        <Chip
          size="small"
          label={`${resultado.correctas}/${resultado.totalPreguntas} correctas · ${resultado.puntosObtenidos}/${resultado.puntosPosibles} pts`}
          color={resultado.correctas === resultado.totalPreguntas ? 'success' : 'warning'}
          variant="tonal"
        />
      </Box>
      <Stack spacing={1.5}>
        {preguntas.map((pregunta, index) => {
          const detalle = resultado.detalle.find(d => d.preguntaId === pregunta.id)
          const seleccionadaId = respMap.get(pregunta.id)

          return (
            <Box
              key={pregunta.id}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: detalle?.esCorrecta ? alpha('#16a34a', 0.4) : alpha('#dc2626', 0.35),
                bgcolor: detalle?.esCorrecta ? alpha('#16a34a', 0.04) : alpha('#dc2626', 0.03)
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                <Typography variant="body2" fontWeight={700}>
                  {index + 1}. {pregunta.texto}
                </Typography>
                <Chip
                  size="small"
                  label={detalle?.esCorrecta ? 'Correcta' : 'Incorrecta'}
                  color={detalle?.esCorrecta ? 'success' : 'error'}
                  variant="tonal"
                  sx={{ flexShrink: 0 }}
                />
              </Box>
              <Stack spacing={0.75}>
                {pregunta.opciones.map(opcion => {
                  const esSeleccionada = seleccionadaId === opcion.id
                  const esCorrecta = opcion.es_correcta

                  return (
                    <Box
                      key={opcion.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.25,
                        py: 0.75,
                        borderRadius: 1.5,
                        border: '1px solid',
                        borderColor: esSeleccionada
                          ? esCorrecta
                            ? 'success.main'
                            : 'error.main'
                          : esCorrecta
                            ? alpha('#16a34a', 0.35)
                            : 'divider',
                        bgcolor: esSeleccionada
                          ? esCorrecta
                            ? alpha('#16a34a', 0.08)
                            : alpha('#dc2626', 0.06)
                          : esCorrecta
                            ? alpha('#16a34a', 0.03)
                            : 'transparent'
                      }}
                    >
                      <i
                        className={
                          esSeleccionada
                            ? esCorrecta
                              ? 'tabler-circle-check-filled text-green-600'
                              : 'tabler-circle-x-filled text-red-600'
                            : esCorrecta
                              ? 'tabler-check text-green-600'
                              : 'tabler-circle text-gray-400'
                        }
                        style={{ fontSize: '1rem', flexShrink: 0 }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {opcion.texto}
                      </Typography>
                      {esSeleccionada && (
                        <Chip size="small" label="Respuesta del alumno" variant="outlined" sx={{ height: 22, fontSize: '0.65rem' }} />
                      )}
                    </Box>
                  )
                })}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Puntos: {detalle?.puntosObtenidos ?? 0} / {pregunta.puntos}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

function GradeModal({
  open,
  onClose,
  entrega,
  actividad,
  actividadDetalle,
  cursoId
}: {
  open: boolean
  onClose: () => void
  entrega: any
  actividad: CursoActividadResumen
  actividadDetalle?: ActividadReviewContext | null
  cursoId: string
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [nota, setNota] = useState('')
  const [comentario, setComentario] = useState('')
  const calificarMutation = useCalificarEntregaActividad()

  const reviewContext = actividadDetalle ?? {
    id: actividad.id,
    titulo: actividad.titulo,
    tipo: actividad.tipo,
    puntaje_maximo: actividad.puntaje_maximo,
    preguntas: []
  }

  const preguntas = useMemo(() => reviewContext.preguntas || [], [reviewContext.preguntas])

  const notaSugerida = useMemo(() => {
    if (reviewContext.tipo !== 'FORMULARIO' || preguntas.length === 0) return null

    return evaluarRespuestasActividad(preguntas, entrega?.respuestas, reviewContext.puntaje_maximo)
  }, [reviewContext.tipo, reviewContext.puntaje_maximo, preguntas, entrega?.respuestas])

  useEffect(() => {
    if (!open || !entrega) return

    setNota(entrega.nota != null ? String(entrega.nota) : '')
    setComentario(entrega.comentario_docente || '')
  }, [open, entrega])

  const handleSave = async () => {
    if (nota.trim() === '') {
      enqueueSnackbar('Ingresa una nota para calificar la entrega', { variant: 'warning' })

      return
    }

    const notaNum = Number(nota)

    if (!Number.isFinite(notaNum) || notaNum < 0 || notaNum > actividad.puntaje_maximo) {
      enqueueSnackbar(`La nota debe estar entre 0 y ${actividad.puntaje_maximo}`, { variant: 'warning' })

      return
    }

    try {
      await calificarMutation.mutateAsync({
        cursoId,
        actId: actividad.id,
        entId: entrega.id,
        data: { nota: notaNum, comentario_docente: comentario }
      })
      enqueueSnackbar('Calificación guardada', { variant: 'success' })
      onClose()
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Error al guardar', { variant: 'error' })
    }
  }

  return (
    <AppModal open={open} handleClose={onClose} disableClose={calificarMutation.isPending} sx={{ maxWidth: 720 }}>
      <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
        Revisar entrega
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {reviewContext.titulo} · Puntaje máximo: {reviewContext.puntaje_maximo}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
        <Avatar src={entrega?.usuario?.avatar || undefined} sx={{ width: 44, height: 44 }}>
          {entrega?.usuario?.nombre?.[0]}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>
            {entrega?.usuario?.nombre} {entrega?.usuario?.apellido}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {entrega?.usuario?.correo}
          </Typography>
        </Box>
      </Box>

      {reviewContext.tipo === 'ARCHIVO' && <ArchivoReviewBlock entrega={entrega} />}

      {reviewContext.tipo === 'FORMULARIO' && preguntas.length > 0 && (
        <FormularioReviewBlock
          preguntas={preguntas}
          respuestas={entrega?.respuestas}
          puntajeMaximo={reviewContext.puntaje_maximo}
        />
      )}

      {reviewContext.tipo === 'FORMULARIO' && preguntas.length === 0 && (
        <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
          Esta actividad no tiene preguntas configuradas.
        </Alert>
      )}

      {entrega?.comentario_estudiante && (
        <Box sx={{ mb: 2.5, p: 1.5, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.06), border: '1px solid', borderColor: alpha('#3b82f6', 0.2) }}>
          <Typography variant="caption" color="primary.main" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
            COMENTARIO DEL ESTUDIANTE
          </Typography>
          <Typography variant="body2">{entrega.comentario_estudiante}</Typography>
        </Box>
      )}

      {notaSugerida && (
        <Alert
          severity="info"
          sx={{ mb: 2.5, borderRadius: 2 }}
          action={
            <Button
              size="small"
              color="inherit"
              onClick={() => setNota(String(notaSugerida.nota))}
              sx={{ textTransform: 'none', fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              Usar {notaSugerida.nota}
            </Button>
          }
        >
          Nota sugerida: <strong>{notaSugerida.nota}</strong> ({notaSugerida.correctas} de {notaSugerida.totalPreguntas} correctas)
        </Alert>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <CustomTextField
          fullWidth
          type="number"
          label={`Nota (0 – ${actividad.puntaje_maximo}) *`}
          value={nota}
          onChange={e => setNota(e.target.value)}
          inputProps={{ min: 0, max: actividad.puntaje_maximo, step: 0.5 }}
        />
        <CustomTextField
          fullWidth
          multiline
          rows={3}
          label="Retroalimentación al estudiante (opcional)"
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          placeholder={
            reviewContext.tipo === 'ARCHIVO'
              ? 'Indica observaciones sobre el documento entregado...'
              : 'Comenta el desempeño del estudiante en el formulario...'
          }
        />
      </Stack>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={calificarMutation.isPending} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={calificarMutation.isPending}
          sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
        >
          {calificarMutation.isPending ? 'Guardando...' : entrega?.nota != null ? 'Actualizar calificación' : 'Guardar calificación'}
        </Button>
      </Box>
    </AppModal>
  )
}

function EntregasPanel({ actividad, cursoId }: { actividad: CursoActividadResumen; cursoId: string }) {
  const { data, isLoading, refetch } = useEntregasActividad(cursoId, actividad.id)
  const [grading, setGrading] = useState<any>(null)
  const [filtro, setFiltro] = useState<FiltroEntrega>('todas')

  const entregas = useMemo(() => data?.entregas || [], [data?.entregas])
  const pendientes = useMemo(() => data?.pendientes || [], [data?.pendientes])
  const actividadDetalle = data?.actividad ?? null

  const entregasFiltradas = useMemo(() => {
    if (filtro === 'sin_calificar') return entregas.filter((e: any) => e.nota == null)
    if (filtro === 'calificadas') return entregas.filter((e: any) => e.nota != null)

    return entregas
  }, [entregas, filtro])

  const getStatus = (e: any) => (e.nota != null ? 'calificado' : 'entregado')

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Entregadas', value: entregas.length, color: 'success.main' },
          { label: 'Calificadas', value: entregas.filter((e: any) => e.nota != null).length, color: 'primary.main' },
          { label: 'Pendientes', value: pendientes.length, color: 'text.secondary' }
        ].map(s => (
          <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', minWidth: 90, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight={800} color={s.color}>
              {s.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {s.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {entregas.length > 0 && (
        <ToggleButtonGroup
          size="small"
          value={filtro}
          exclusive
          onChange={(_, v) => v && setFiltro(v)}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="todas" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Todas ({entregas.length})
          </ToggleButton>
          <ToggleButton value="sin_calificar" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Sin calificar ({entregas.filter((e: any) => e.nota == null).length})
          </ToggleButton>
          <ToggleButton value="calificadas" sx={{ textTransform: 'none', fontWeight: 600 }}>
            Calificadas ({entregas.filter((e: any) => e.nota != null).length})
          </ToggleButton>
        </ToggleButtonGroup>
      )}

      {entregas.length === 0 && pendientes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
          <i className="tabler-inbox text-5xl" style={{ display: 'block', marginBottom: 8 }} />
          <Typography variant="body2">Sin estudiantes inscritos en este curso.</Typography>
        </Box>
      )}

      {entregas.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 1.5, display: 'block' }}>
            Entregas recibidas ({entregasFiltradas.length})
          </Typography>
          {entregasFiltradas.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No hay entregas en este filtro.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {entregasFiltradas.map((e: any) => {
                const status = getStatus(e)

                return (
                  <Box
                    key={e.id}
                    onClick={() => setGrading(e)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      cursor: 'pointer',
                      '&:hover': { borderColor: '#7c3aed', bgcolor: alpha('#7c3aed', 0.04) }
                    }}
                  >
                    <Avatar src={e.usuario?.avatar || undefined} sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                      {e.usuario?.nombre?.[0]}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {e.usuario?.nombre} {e.usuario?.apellido}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {new Date(e.creado_en).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {actividad.tipo === 'ARCHIVO' && e.archivo_nombre ? ` · ${e.archivo_nombre}` : ''}
                        {actividad.tipo === 'FORMULARIO' && Array.isArray(e.respuestas)
                          ? ` · ${e.respuestas.length} respuesta(s)`
                          : ''}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={status === 'calificado' ? `${e.nota}/${actividad.puntaje_maximo}` : 'Sin calificar'}
                      color={status === 'calificado' ? 'success' : 'warning'}
                      variant="tonal"
                    />
                    <Tooltip title={status === 'calificado' ? 'Editar calificación' : 'Revisar y calificar'}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={ev => {
                          ev.stopPropagation()
                          setGrading(e)
                        }}
                      >
                        <i className={`tabler-${status === 'calificado' ? 'edit' : 'eye'} text-base`} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )
              })}
            </Stack>
          )}
        </Box>
      )}

      {pendientes.length > 0 && (
        <Box>
          <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 1.5, display: 'block' }}>
            Sin entregar ({pendientes.length})
          </Typography>
          <Stack spacing={1}>
            {pendientes.map((u: any) => (
              <Box
                key={u.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  opacity: 0.65
                }}
              >
                <Avatar src={u.avatar || undefined} sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                  {u.nombre?.[0]}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {u.nombre} {u.apellido}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {u.correo}
                  </Typography>
                </Box>
                <Chip size="small" label="Pendiente" color="default" variant="outlined" />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {grading && (
        <GradeModal
          open={!!grading}
          onClose={() => {
            setGrading(null)
            refetch()
          }}
          entrega={grading}
          actividad={actividad}
          actividadDetalle={actividadDetalle}
          cursoId={cursoId}
        />
      )}
    </>
  )
}

interface TabRevisionActividadesProps {
  cursoId: string
  curso: Curso
}

export function TabRevisionActividades({ cursoId, curso }: TabRevisionActividadesProps) {
  const allActividades: CursoActividadResumen[] = curso.modulos?.flatMap(m => m.actividades || []) || []

  const [selectedActividad, setSelectedActividad] = useState<CursoActividadResumen | null>(
    allActividades[0] ?? null
  )

  if (allActividades.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.disabled' }}>
        <i className="tabler-file-check text-5xl" style={{ display: 'block', marginBottom: 12 }} />
        <Typography variant="body1" color="text.secondary">
          Este curso no tiene actividades/tareas aún.
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Ve a la pestaña Contenido y añade actividades a los módulos.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      <Box sx={{ width: 280, flexShrink: 0 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ mb: 1.5, display: 'block' }}>
          Actividades del curso
        </Typography>
        <Stack spacing={1}>
          {curso.modulos?.map(modulo => {
            const acts = modulo.actividades || []

            if (acts.length === 0) return null

            return (
              <Box key={modulo.id}>
                <Typography variant="caption" color="text.disabled" fontWeight={600} sx={{ px: 1, display: 'block', mb: 0.5 }}>
                  {modulo.titulo}
                </Typography>
                {acts.map(act => (
                  <Box
                    key={act.id}
                    onClick={() => setSelectedActividad(act)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      p: 1.25,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      mb: 0.5,
                      bgcolor: selectedActividad?.id === act.id ? alpha('#7c3aed', 0.1) : 'transparent',
                      border: '1px solid',
                      borderColor: selectedActividad?.id === act.id ? '#7c3aed' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <i
                      className={`text-lg ${act.tipo === 'FORMULARIO' ? 'tabler-list-check' : 'tabler-upload'}`}
                      style={{ color: '#7c3aed', flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        noWrap
                        color={selectedActividad?.id === act.id ? '#7c3aed' : 'text.primary'}
                      >
                        {act.titulo}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {act._count?.entregas ?? 0} entregas · {act.puntaje_maximo} pts
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )
          })}
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {!selectedActividad ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.disabled' }}>
            <i className="tabler-hand-click text-5xl" style={{ display: 'block', marginBottom: 12 }} />
            <Typography variant="body2" color="text.secondary">
              Selecciona una actividad para ver las entregas.
            </Typography>
          </Box>
        ) : (
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 3, pb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    flexShrink: 0,
                    bgcolor: alpha('#7c3aed', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i
                    className={`text-xl ${selectedActividad.tipo === 'FORMULARIO' ? 'tabler-list-check' : 'tabler-upload'}`}
                    style={{ color: '#7c3aed' }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="h6" fontWeight={800}>
                    {selectedActividad.titulo}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      size="small"
                      label={selectedActividad.tipo === 'FORMULARIO' ? 'Formulario' : 'Subida de archivo'}
                      color="secondary"
                      variant="tonal"
                    />
                    <Chip size="small" label={`Puntaje máx: ${selectedActividad.puntaje_maximo}`} variant="outlined" />
                    {!selectedActividad.esta_publicado && (
                      <Chip size="small" label="Borrador" color="warning" variant="tonal" />
                    )}
                  </Box>
                </Box>
              </Box>

              <EntregasPanel actividad={selectedActividad} cursoId={cursoId} />
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}
