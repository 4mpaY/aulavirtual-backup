'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from '@mui/material'
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

interface ActividadSectionProps {
  actividadId: string
  onEntregaSuccess?: () => void
}

function getFileIcon(nombre: string) {
  const ext = nombre.split('.').pop()?.toLowerCase() ?? ''

  if (ext === 'pdf') return 'tabler-file-type-pdf text-red-600'
  if (['doc', 'docx'].includes(ext)) return 'tabler-file-type-docx text-blue-600'
  if (['xls', 'xlsx'].includes(ext)) return 'tabler-file-type-xlsx text-green-600'
  if (['zip', 'rar'].includes(ext)) return 'tabler-file-zip text-amber-600'
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'tabler-photo text-purple-600'

  return 'tabler-file text-slate-500'
}

export default function ActividadSection({ actividadId, onEntregaSuccess }: ActividadSectionProps) {
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [comentarioEstudiante, setComentarioEstudiante] = useState('')
  const [tempFile, setTempFile] = useState<{ url: string; nombre: string } | null>(null)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(true)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['estudiante', 'actividad', actividadId],
    queryFn: async () => {
      const res = await axios.get(`/api/estudiante/actividades/${actividadId}`)

      if (!res.data.status) throw new Error(res.data.message || 'Error al cargar actividad')

      return res.data.result.actividad
    },
    enabled: !!actividadId
  })

  const entrega = data?.entrega ?? null
  const isGraded = entrega && entrega.nota !== null

  useEffect(() => {
    setComentarioEstudiante(entrega?.comentario_estudiante || '')
    setTempFile(null)

    if (Array.isArray(entrega?.respuestas)) {
      const map: Record<string, string> = {}

      entrega.respuestas.forEach((r: any) => {
        if (r.pregunta_id && r.opcion_id) map[r.pregunta_id] = r.opcion_id
      })
      setRespuestas(map)
    } else {
      setRespuestas({})
    }

    setIsEditing(!entrega)
  }, [entrega, actividadId])

  const datesInfo = useMemo(() => {
    const ahora = new Date()
    const inicio = data?.fecha_inicio ? new Date(data.fecha_inicio) : null
    const fin = data?.fecha_fin ? new Date(data.fecha_fin) : null

    return {
      canSubmit: (!inicio || ahora >= inicio) && (!fin || ahora <= fin),
      isBefore: inicio && ahora < inicio,
      isAfter: fin && ahora > fin,
      inicioStr: inicio
        ? inicio.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : null,
      finStr: fin
        ? fin.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        : null
    }
  }, [data?.fecha_inicio, data?.fecha_fin])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 50 * 1024 * 1024) {
      toast.error('El archivo no debe superar los 50 MB')

      return
    }

    setUploading(true)
    const formData = new FormData()

    formData.append('file', file)

    try {
      const res = await axios.post('/api/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data.status && res.data.result) {
        setTempFile({ url: res.data.result.url, nombre: file.name })
        toast.success('Archivo cargado correctamente')
      } else {
        toast.error('Error al procesar el archivo')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al subir archivo')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!data) return

    setSaving(true)

    try {
      const payload: any = { comentario_estudiante: comentarioEstudiante || null }

      if (data.tipo === 'ARCHIVO') {
        const finalFile = tempFile || (entrega ? { url: entrega.archivo_url, nombre: entrega.archivo_nombre } : null)

        if (!finalFile?.url || !finalFile?.nombre) {
          toast.error('Debes cargar un archivo para realizar la entrega')
          setSaving(false)

          return
        }

        payload.archivo_url = finalFile.url
        payload.archivo_nombre = finalFile.nombre
      } else {
        const respuestasArray = (data.preguntas || []).map((p: any) => ({
          pregunta_id: p.id,
          opcion_id: respuestas[p.id]
        }))

        if (respuestasArray.some((r: any) => !r.opcion_id)) {
          toast.error('Debes responder todas las preguntas')
          setSaving(false)

          return
        }

        payload.respuestas = respuestasArray
      }

      const res = await axios.post(`/api/estudiante/actividades/${actividadId}/entregar`, payload)

      if (res.data.status) {
        toast.success('¡Tu actividad ha sido entregada exitosamente!')
        setTempFile(null)
        setIsEditing(false)
        queryClient.invalidateQueries({ queryKey: ['estudiante', 'actividad', actividadId] })
        onEntregaSuccess?.()
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error al guardar entrega')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError || !data) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {(error as Error)?.message || 'No se pudo cargar la actividad'}
      </Alert>
    )
  }

  const activeFile = tempFile || (entrega?.archivo_url
    ? { url: entrega.archivo_url, nombre: entrega.archivo_nombre || 'Archivo entregado' }
    : null)

  const canEdit = !isGraded && datesInfo.canSubmit && (isEditing || !entrega)

  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '16px', overflow: 'hidden' }}>
      <Box sx={{ p: 4, bgcolor: 'rgba(124,58,237,0.06)', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#7c3aed' }}>
              {data.titulo}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
              <i className={`tabler-${data.tipo === 'FORMULARIO' ? 'list-check' : 'upload'}`} style={{ fontSize: '0.85rem' }} />
              {data.tipo === 'FORMULARIO' ? 'Actividad con formulario' : 'Actividad con entrega de archivo'}
              {(datesInfo.inicioStr || datesInfo.finStr) && (
                <>
                  {' · '}
                  {datesInfo.inicioStr ? `Desde: ${datesInfo.inicioStr}` : ''}
                  {datesInfo.inicioStr && datesInfo.finStr ? ' · ' : ''}
                  {datesInfo.finStr ? `Hasta: ${datesInfo.finStr}` : ''}
                </>
              )}
            </Typography>
          </Box>
          <Box>
            {isGraded ? (
              <Chip
                label={`Calificado: ${entrega!.nota!.toFixed(1)} / ${data.puntaje_maximo}`}
                color={entrega!.nota! >= data.puntaje_maximo * 0.55 ? 'success' : 'error'}
                sx={{ fontWeight: 800 }}
              />
            ) : entrega ? (
              <Chip label="Entregado (Esperando revisión)" color="warning" sx={{ fontWeight: 800 }} />
            ) : datesInfo.isAfter ? (
              <Chip label="Plazo vencido" color="error" variant="outlined" sx={{ fontWeight: 800 }} />
            ) : datesInfo.isBefore ? (
              <Chip label="Próximamente" color="info" variant="outlined" sx={{ fontWeight: 800 }} />
            ) : (
              <Chip label="Pendiente de entrega" color="secondary" variant="outlined" sx={{ fontWeight: 800 }} />
            )}
          </Box>
        </Stack>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {data.instrucciones && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Instrucciones
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {data.instrucciones}
              </Typography>
            </Box>
          )}

          {entrega?.comentario_docente && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                Retroalimentación del docente
              </Typography>
              <Typography variant="body2">{entrega.comentario_docente}</Typography>
            </Alert>
          )}

          {data.tipo === 'ARCHIVO' && (
            <>
              {canEdit ? (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Subir archivo de entrega
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={uploading}
                    startIcon={uploading ? <CircularProgress size={16} /> : <i className="tabler-upload" />}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                  >
                    {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  {activeFile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 420 }}>
                      <i className={`${getFileIcon(activeFile.nombre)} text-xl`} />
                      <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1 }}>
                        {activeFile.nombre}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : activeFile ? (
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxWidth: 420 }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
                    ARCHIVO ENTREGADO
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <i className={`${getFileIcon(activeFile.nombre)} text-xl`} />
                    <Typography variant="body2" fontWeight={600} noWrap sx={{ flex: 1 }}>
                      {activeFile.nombre}
                    </Typography>
                    <Button size="small" variant="tonal" href={activeFile.url} target="_blank" startIcon={<i className="tabler-download" />}>
                      Descargar
                    </Button>
                  </Box>
                </Box>
              ) : null}
            </>
          )}

          {data.tipo === 'FORMULARIO' && (data.preguntas || []).length > 0 && (
            <Stack spacing={3}>
              <Divider />
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Preguntas
              </Typography>
              {data.preguntas.map((pregunta: any, index: number) => (
                <Box key={pregunta.id} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={700} sx={{ mb: 1.5 }}>
                    {index + 1}. {pregunta.texto}
                  </Typography>
                  {canEdit ? (
                    <RadioGroup
                      value={respuestas[pregunta.id] || ''}
                      onChange={e => setRespuestas(prev => ({ ...prev, [pregunta.id]: e.target.value }))}
                    >
                      {pregunta.opciones.map((opcion: any) => (
                        <FormControlLabel
                          key={opcion.id}
                          value={opcion.id}
                          control={<Radio size="small" />}
                          label={<Typography variant="body2">{opcion.texto}</Typography>}
                        />
                      ))}
                    </RadioGroup>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {(entrega?.respuestas as any[])?.find((r: any) => r.pregunta_id === pregunta.id)?.opcion_texto || 'Sin respuesta'}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          )}

          {(canEdit || entrega?.comentario_estudiante) && (
            <CustomTextField
              fullWidth
              multiline
              rows={3}
              label="Comentario para el docente (opcional)"
              value={comentarioEstudiante}
              onChange={e => setComentarioEstudiante(e.target.value)}
              disabled={!canEdit}
            />
          )}

          {canEdit && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              {entrega && !isGraded && (
                <Button variant="outlined" onClick={() => setIsEditing(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                  Cancelar
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={saving || uploading}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <i className="tabler-send" />}
                sx={{ textTransform: 'none', fontWeight: 700, bgcolor: '#7c3aed', '&:hover': { bgcolor: '#6d28d9' } }}
              >
                {saving ? 'Enviando...' : entrega ? 'Actualizar entrega' : 'Enviar actividad'}
              </Button>
            </Box>
          )}

          {entrega && !isGraded && !canEdit && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setIsEditing(true)}
                disabled={!!datesInfo.isAfter}
                startIcon={<i className="tabler-edit" />}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Editar entrega
              </Button>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
