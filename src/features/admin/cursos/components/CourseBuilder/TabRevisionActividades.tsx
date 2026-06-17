'use client'

import { useState } from 'react'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Divider,
  Stack,
  Button,
  alpha
} from '@mui/material'
import { useSnackbar } from 'notistack'

import AppModal from '@/utils/components/AppModal'
import CustomTextField from '@core/components/mui/TextField'
import { useEntregasActividad, useCalificarEntregaActividad } from '../../hooks/useCursos'
import type { Curso, CursoActividadResumen } from '../../entity/Curso'

// ─── Grade Modal ──────────────────────────────────────────────────────────────

function GradeModal({
  open,
  onClose,
  entrega,
  actividad,
  cursoId
}: {
  open: boolean
  onClose: () => void
  entrega: any
  actividad: CursoActividadResumen
  cursoId: string
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [nota, setNota] = useState<string>(entrega?.nota != null ? String(entrega.nota) : '')
  const [comentario, setComentario] = useState(entrega?.comentario_docente || '')
  const calificarMutation = useCalificarEntregaActividad()

  const handleSave = async () => {
    const notaNum = nota !== '' ? Number(nota) : null

    if (notaNum !== null && (notaNum < 0 || notaNum > actividad.puntaje_maximo)) {
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
    <AppModal open={open} handleClose={onClose} sx={{ maxWidth: 560 }}>
      <Typography variant='h6' fontWeight={800} sx={{ mb: 3 }}>
        Calificar entrega
      </Typography>

      {/* Student info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
        <Avatar src={entrega?.usuario?.avatar || undefined} sx={{ width: 40, height: 40 }}>
          {entrega?.usuario?.nombre?.[0]}
        </Avatar>
        <Box>
          <Typography variant='subtitle2' fontWeight={700}>
            {entrega?.usuario?.nombre} {entrega?.usuario?.apellido}
          </Typography>
          <Typography variant='caption' color='text.secondary'>{entrega?.usuario?.correo}</Typography>
        </Box>
      </Box>

      {/* File submission */}
      {actividad.tipo === 'ARCHIVO' && entrega?.archivo_url && (
        <Box sx={{ mb: 2.5, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant='caption' color='text.secondary' fontWeight={600} sx={{ display: 'block', mb: 1 }}>
            ARCHIVO ENTREGADO
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <i className='tabler-file text-2xl' style={{ color: 'var(--mui-palette-primary-main)' }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant='body2' fontWeight={600} noWrap>{entrega.archivo_nombre}</Typography>
            </Box>
            <Button
              size='small'
              variant='outlined'
              component='a'
              href={entrega.archivo_url}
              target='_blank'
              rel='noopener noreferrer'
              startIcon={<i className='tabler-download' style={{ fontSize: '0.85rem' }} />}
              sx={{ textTransform: 'none', fontWeight: 600, flexShrink: 0 }}
            >
              Descargar
            </Button>
          </Box>
        </Box>
      )}

      {/* Formulario responses */}
      {actividad.tipo === 'FORMULARIO' && entrega?.respuestas && (
        <Box sx={{ mb: 2.5 }}>
          <Typography variant='caption' color='text.secondary' fontWeight={600} sx={{ display: 'block', mb: 1.5 }}>
            RESPUESTAS DEL ESTUDIANTE
          </Typography>
          <Stack spacing={1.5}>
            {(entrega.respuestas as any[]).map((r: any, idx: number) => (
              <Box key={idx} sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant='caption' color='text.secondary' fontWeight={600}>Pregunta {idx + 1}</Typography>
                <Typography variant='body2'>{r.texto_respuesta || r.opcion_texto || '(Sin respuesta)'}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* Student comment */}
      {entrega?.comentario_estudiante && (
        <Box sx={{ mb: 2.5, p: 1.5, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.06), border: '1px solid', borderColor: alpha('#3b82f6', 0.2) }}>
          <Typography variant='caption' color='primary.main' fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
            COMENTARIO DEL ESTUDIANTE
          </Typography>
          <Typography variant='body2'>{entrega.comentario_estudiante}</Typography>
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        <CustomTextField
          fullWidth
          type='number'
          label={`Nota (0 – ${actividad.puntaje_maximo})`}
          value={nota}
          onChange={e => setNota(e.target.value)}
          inputProps={{ min: 0, max: actividad.puntaje_maximo, step: 0.5 }}
        />
        <CustomTextField
          fullWidth
          multiline
          rows={3}
          label='Retroalimentación al estudiante (opcional)'
          value={comentario}
          onChange={e => setComentario(e.target.value)}
        />
      </Stack>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 3 }}>
        <Button variant='outlined' onClick={onClose} disabled={calificarMutation.isPending} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={calificarMutation.isPending}
          sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
        >
          {calificarMutation.isPending ? 'Guardando...' : 'Guardar calificación'}
        </Button>
      </Box>
    </AppModal>
  )
}

// ─── Submissions list for one activity ───────────────────────────────────────

function EntregasPanel({ actividad, cursoId }: { actividad: CursoActividadResumen; cursoId: string }) {
  const { data, isLoading } = useEntregasActividad(cursoId, actividad.id)
  const [grading, setGrading] = useState<any>(null)

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  const entregas = data?.entregas || []
  const pendientes = data?.pendientes || []

  const getStatus = (e: any) => {
    if (e.nota != null) return 'calificado'

    return 'entregado'
  }

  return (
    <>
      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Entregadas', value: entregas.length, color: 'success.main' },
          { label: 'Calificadas', value: entregas.filter((e: any) => e.nota != null).length, color: 'primary.main' },
          { label: 'Pendientes', value: pendientes.length, color: 'text.secondary' }
        ].map(s => (
          <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', minWidth: 90, textAlign: 'center' }}>
            <Typography variant='h5' fontWeight={800} color={s.color}>{s.value}</Typography>
            <Typography variant='caption' color='text.secondary'>{s.label}</Typography>
          </Box>
        ))}
      </Box>

      {entregas.length === 0 && pendientes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
          <i className='tabler-inbox text-5xl' style={{ display: 'block', marginBottom: 8 }} />
          <Typography variant='body2'>Sin estudiantes inscritos en este curso.</Typography>
        </Box>
      )}

      {/* Submitted */}
      {entregas.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant='overline' color='text.secondary' fontWeight={700} sx={{ mb: 1.5, display: 'block' }}>
            Entregas recibidas ({entregas.length})
          </Typography>
          <Stack spacing={1}>
            {entregas.map((e: any) => {
              const status = getStatus(e)

              return (
                <Box
                  key={e.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                    borderRadius: 2, border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
                  }}
                >
                  <Avatar src={e.usuario?.avatar || undefined} sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                    {e.usuario?.nombre?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant='body2' fontWeight={600} noWrap>
                      {e.usuario?.nombre} {e.usuario?.apellido}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      {new Date(e.creado_en).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                  <Chip
                    size='small'
                    label={status === 'calificado' ? `${e.nota}/${actividad.puntaje_maximo}` : 'Sin calificar'}
                    color={status === 'calificado' ? 'success' : 'warning'}
                    variant='tonal'
                  />
                  <Tooltip title={status === 'calificado' ? 'Editar calificación' : 'Calificar'}>
                    <IconButton size='small' color='primary' onClick={() => setGrading(e)}>
                      <i className={`tabler-${status === 'calificado' ? 'edit' : 'star'} text-base`} />
                    </IconButton>
                  </Tooltip>
                </Box>
              )
            })}
          </Stack>
        </Box>
      )}

      {/* Pending students */}
      {pendientes.length > 0 && (
        <Box>
          <Typography variant='overline' color='text.secondary' fontWeight={700} sx={{ mb: 1.5, display: 'block' }}>
            Sin entregar ({pendientes.length})
          </Typography>
          <Stack spacing={1}>
            {pendientes.map((u: any) => (
              <Box key={u.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, border: '1px dashed', borderColor: 'divider', opacity: 0.65 }}>
                <Avatar src={u.avatar || undefined} sx={{ width: 36, height: 36, fontSize: '0.85rem' }}>{u.nombre?.[0]}</Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant='body2' fontWeight={600} noWrap>{u.nombre} {u.apellido}</Typography>
                  <Typography variant='caption' color='text.secondary'>{u.correo}</Typography>
                </Box>
                <Chip size='small' label='Pendiente' color='default' variant='outlined' />
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {grading && (
        <GradeModal
          open={!!grading}
          onClose={() => setGrading(null)}
          entrega={grading}
          actividad={actividad}
          cursoId={cursoId}
        />
      )}
    </>
  )
}

// ─── Main tab ──────────────────────────────────────────────────────────────────

interface TabRevisionActividadesProps {
  cursoId: string
  curso: Curso
}

export function TabRevisionActividades({ cursoId, curso }: TabRevisionActividadesProps) {
  const [selectedActividad, setSelectedActividad] = useState<CursoActividadResumen | null>(null)

  const allActividades: CursoActividadResumen[] = curso.modulos?.flatMap(m => m.actividades || []) || []

  if (allActividades.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'text.disabled' }}>
        <i className='tabler-file-check text-5xl' style={{ display: 'block', marginBottom: 12 }} />
        <Typography variant='body1' color='text.secondary'>
          Este curso no tiene actividades/tareas aún.
        </Typography>
        <Typography variant='caption' color='text.disabled'>
          Ve a la pestaña Contenido y añade actividades a los módulos.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      {/* Sidebar: activity list */}
      <Box sx={{ width: 280, flexShrink: 0 }}>
        <Typography variant='overline' color='text.secondary' fontWeight={700} sx={{ mb: 1.5, display: 'block' }}>
          Actividades del curso
        </Typography>
        <Stack spacing={1}>
          {curso.modulos?.map(modulo => {
            const acts = modulo.actividades || []

            if (acts.length === 0) return null

            return (
              <Box key={modulo.id}>
                <Typography variant='caption' color='text.disabled' fontWeight={600} sx={{ px: 1, display: 'block', mb: 0.5 }}>
                  {modulo.titulo}
                </Typography>
                {acts.map(act => (
                  <Box
                    key={act.id}
                    onClick={() => setSelectedActividad(act)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, borderRadius: 1.5,
                      cursor: 'pointer', mb: 0.5,
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
                      <Typography variant='body2' fontWeight={600} noWrap color={selectedActividad?.id === act.id ? '#7c3aed' : 'text.primary'}>
                        {act.titulo}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
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

      {/* Main area */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {!selectedActividad ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.disabled' }}>
            <i className='tabler-hand-click text-5xl' style={{ display: 'block', marginBottom: 12 }} />
            <Typography variant='body2' color='text.secondary'>
              Selecciona una actividad para ver las entregas.
            </Typography>
          </Box>
        ) : (
          <Card variant='outlined' sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              {/* Activity header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 3, pb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box sx={{
                  width: 44, height: 44, borderRadius: 2, flexShrink: 0,
                  bgcolor: alpha('#7c3aed', 0.1),
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <i
                    className={`text-xl ${selectedActividad.tipo === 'FORMULARIO' ? 'tabler-list-check' : 'tabler-upload'}`}
                    style={{ color: '#7c3aed' }}
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant='h6' fontWeight={800}>{selectedActividad.titulo}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip
                      size='small'
                      label={selectedActividad.tipo === 'FORMULARIO' ? 'Formulario' : 'Subida de archivo'}
                      color='secondary'
                      variant='tonal'
                    />
                    <Chip size='small' label={`Puntaje máx: ${selectedActividad.puntaje_maximo}`} variant='outlined' />
                    {!selectedActividad.esta_publicado && (
                      <Chip size='small' label='Borrador' color='warning' variant='tonal' />
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
