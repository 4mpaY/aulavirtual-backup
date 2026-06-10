'use client'

import { useState, useMemo } from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  Alert,
  IconButton
} from '@mui/material'
import axios from 'axios'
import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

interface TrabajoProps {
  id: string
  titulo: string
  descripcion?: string | null
  archivo_url?: string | null
  archivo_nombre?: string | null
  fecha_inicio?: string | null
  fecha_fin?: string | null
  entrega?: {
    id: string
    archivo_url: string
    archivo_nombre: string
    comentario_estudiante?: string | null
    nota?: number | null
    comentario_docente?: string | null
    creado_en: string
    actualizado_en: string
  } | null
}

interface LessonTrabajoProps {
  trabajo: TrabajoProps
  onUploadSuccess: () => void
}

// Helper para detectar formato de archivo y mostrar ícono apropiado
function getFileIcon(nombre: string) {
  const ext = nombre.split('.').pop()?.toLowerCase() ?? ''

  if (ext === 'pdf') return 'tabler-file-type-pdf text-red-600'
  if (['doc', 'docx'].includes(ext)) return 'tabler-file-type-docx text-blue-600'
  if (['xls', 'xlsx'].includes(ext)) return 'tabler-file-type-xlsx text-green-600'
  if (['zip', 'rar'].includes(ext)) return 'tabler-file-zip text-amber-600'
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'tabler-photo text-purple-600'

  return 'tabler-file text-slate-500'
}

export function LessonTrabajo({ trabajo, onUploadSuccess }: LessonTrabajoProps) {
  const { id: trabajoId, titulo, descripcion, archivo_url, archivo_nombre, fecha_inicio, fecha_fin, entrega } = trabajo

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [comentarioEstudiante, setComentarioEstudiante] = useState(entrega?.comentario_estudiante || '')
  const [tempFile, setTempFile] = useState<{ url: string; nombre: string } | null>(null)
  const [isEditing, setIsEditing] = useState(!entrega)

  // Validaciones de disponibilidad de fechas
  const datesInfo = useMemo(() => {
    const ahora = new Date()
    const inicio = fecha_inicio ? new Date(fecha_inicio) : null
    const fin = fecha_fin ? new Date(fecha_fin) : null

    const hasStarted = !inicio || ahora >= inicio
    const hasEnded = fin && ahora > fin

    const formattedInicio = inicio
      ? inicio.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      : null

    const formattedFin = fin
      ? fin.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
      : null

    return {
      canSubmit: hasStarted && !hasEnded,
      isBefore: !hasStarted,
      isAfter: hasEnded,
      inicioStr: formattedInicio,
      finStr: formattedFin
    }
  }, [fecha_inicio, fecha_fin])

  // Subir archivo al backend general de `/api/media`
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Validar peso de archivo (max 50MB)
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
        setTempFile({
          url: res.data.result.url,
          nombre: file.name
        })
        toast.success('Archivo cargado correctamente')
      } else {
        toast.error('Error al procesar el archivo en el servidor')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al subir archivo')
    } finally {
      setUploading(false)
    }
  }

  // Confirmar entrega en base de datos
  const handleSaveEntrega = async () => {
    const finalFile = tempFile || (entrega ? { url: entrega.archivo_url, nombre: entrega.archivo_nombre } : null)

    if (!finalFile) {
      toast.error('Debes cargar un archivo para realizar la entrega')

      return
    }

    setSaving(true)

    try {
      const res = await axios.post(`/api/estudiante/trabajos/${trabajoId}/entregar`, {
        archivo_url: finalFile.url,
        archivo_nombre: finalFile.nombre,
        comentario_estudiante: comentarioEstudiante
      })

      if (res.data.status) {
        toast.success('¡Tu trabajo ha sido entregado exitosamente!')
        setIsEditing(false)
        setTempFile(null)
        onUploadSuccess()
      } else {
        toast.error('No se pudo procesar la entrega')
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error al guardar entrega')
    } finally {
      setSaving(false)
    }
  }

  const activeFile = tempFile || (entrega ? { url: entrega.archivo_url, nombre: entrega.archivo_nombre } : null)
  const isGraded = entrega && entrega.nota !== null

  return (
    <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Cabecera */}
      <Box sx={{ p: 4, bgcolor: 'rgba(2,94,68,0.035)', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction='row' alignItems='center' justifyContent='space-between' flexWrap='wrap' gap={2}>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 800, color: '#025E44' }}>
              Trabajo Práctico: {titulo}
            </Typography>
            {(datesInfo.inicioStr || datesInfo.finStr) && (
              <Typography variant='caption' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <i className='tabler-calendar-time' style={{ fontSize: '0.85rem' }} />
                {datesInfo.inicioStr ? `Disponible desde: ${datesInfo.inicioStr}` : ''}
                {datesInfo.inicioStr && datesInfo.finStr ? '  ·  ' : ''}
                {datesInfo.finStr ? `Plazo de entrega: ${datesInfo.finStr}` : ''}
              </Typography>
            )}
          </Box>
          <Box>
            {isGraded ? (
              <Chip
                label={`Calificado: ${entrega.nota!.toFixed(1)} / 20`}
                color={entrega.nota! >= 11 ? 'success' : 'error'}
                sx={{ fontWeight: 800, px: 1 }}
              />
            ) : entrega ? (
              <Chip label='Entregado (Esperando revisión)' color='warning' sx={{ fontWeight: 800, px: 1 }} />
            ) : datesInfo.isAfter ? (
              <Chip label='Plazo Vencido' color='error' variant='outlined' sx={{ fontWeight: 800, px: 1 }} />
            ) : datesInfo.isBefore ? (
              <Chip label='Próximamente' color='info' variant='outlined' sx={{ fontWeight: 800, px: 1 }} />
            ) : (
              <Chip label='Pendiente de entrega' color='secondary' variant='outlined' sx={{ fontWeight: 800, px: 1 }} />
            )}
          </Box>
        </Stack>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* Instrucciones */}
          {descripcion && (
            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Instrucciones / Requisitos
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {descripcion}
              </Typography>
            </Box>
          )}

          {/* Archivo Guía */}
          {archivo_url && (
            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Material guía o plantilla de trabajo
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  maxWidth: 400
                }}
              >
                <i className={`${getFileIcon(archivo_nombre || '')} text-xl`} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant='body2' fontWeight={600} noWrap>
                    {archivo_nombre}
                  </Typography>
                </Box>
                <Button
                  size='small'
                  variant='tonal'
                  startIcon={<i className='tabler-download' />}
                  href={archivo_url}
                  target='_blank'
                  sx={{ textTransform: 'none', py: 0.5 }}
                >
                  Descargar
                </Button>
              </Box>
            </Box>
          )}

          <Divider />

          {/* Mensajes del periodo de validez */}
          {datesInfo.isBefore && (
            <Alert severity='info' icon={<i className='tabler-info-circle' />}>
              Este trabajo estará habilitado para entregas a partir del <strong>{datesInfo.inicioStr}</strong>.
            </Alert>
          )}

          {datesInfo.isAfter && !entrega && (
            <Alert severity='error' icon={<i className='tabler-circle-x' />}>
              El plazo para entregar este trabajo finalizó el <strong>{datesInfo.finStr}</strong>. No se permiten nuevas entregas.
            </Alert>
          )}

          {(!isEditing && entrega) ? (
            <Box sx={{ p: 3, border: '1px solid', borderColor: isGraded ? 'success.light' : 'warning.light', borderRadius: 2, bgcolor: isGraded ? 'rgba(46,125,50,0.02)' : 'rgba(217,119,6,0.02)' }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 1.5 }}>
                Tu Entrega
              </Typography>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper', maxW: 450 }}>
                  <i className={`${getFileIcon(entrega.archivo_nombre)} text-xl`} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant='body2' fontWeight={600} noWrap>
                      {entrega.archivo_nombre}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      Entregado el: {new Date(entrega.creado_en).toLocaleString('es-PE')}
                    </Typography>
                  </Box>
                  <Button
                    size='small'
                    variant='text'
                    href={entrega.archivo_url}
                    target='_blank'
                    startIcon={<i className='tabler-external-link' />}
                    sx={{ textTransform: 'none' }}
                  >
                    Ver archivo
                  </Button>
                </Box>

                {entrega.comentario_estudiante && (
                  <Box>
                    <Typography variant='caption' color='text.secondary' display='block' sx={{ fontWeight: 600 }}>
                      Tu mensaje:
                    </Typography>
                    <Typography variant='body2' sx={{ fontStyle: 'italic' }}>
                      &ldquo;{entrega.comentario_estudiante}&rdquo;
                    </Typography>
                  </Box>
                )}

                {/* Calificación y retroalimentación */}
                {isGraded && (
                  <Box sx={{ mt: 1, p: 3, borderLeft: '3px solid', borderColor: 'success.main', bgcolor: 'background.paper', borderRadius: '0 8px 8px 0' }}>
                    <Typography variant='subtitle2' fontWeight={800} color='success.main' sx={{ mb: 1 }}>
                      Retroalimentación del Docente
                    </Typography>
                    <Typography variant='body2' color='text.primary' fontWeight={600} sx={{ mb: 1 }}>
                      Nota obtenida: {entrega.nota!.toFixed(1)} / 20
                    </Typography>
                    {entrega.comentario_docente ? (
                      <Typography variant='body2' color='text.secondary' sx={{ whiteSpace: 'pre-line' }}>
                        {entrega.comentario_docente}
                      </Typography>
                    ) : (
                      <Typography variant='body2' color='text.disabled' sx={{ fontStyle: 'italic' }}>
                        Sin comentarios por parte del docente.
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Habilitar re-entrega si no ha vencido y no está calificado */}
                {!isGraded && datesInfo.canSubmit && (
                  <Box sx={{ pt: 1 }}>
                    <Button
                      variant='outlined'
                      size='small'
                      startIcon={<i className='tabler-edit' />}
                      onClick={() => {
                        setComentarioEstudiante(entrega.comentario_estudiante || '')
                        setIsEditing(true)
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      Modificar Entrega
                    </Button>
                  </Box>
                )}
              </Stack>
            </Box>
          ) : (
            datesInfo.canSubmit && (
              <Stack spacing={3}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                  Subir Entrega
                </Typography>

                {/* Uploader */}
                <Box>
                  {activeFile ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, maxW: 450 }}>
                      <i className={`${getFileIcon(activeFile.nombre)} text-xl`} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant='body2' fontWeight={600} noWrap>
                          {activeFile.nombre}
                        </Typography>
                        {tempFile && (
                          <Typography variant='caption' color='success.main'>
                            Cargado correctamente
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        size='small'
                        color='error'
                        onClick={() => setTempFile(null)}
                      >
                        <i className='tabler-trash' />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box
                      component='label'
                      sx={{
                        border: '2px dashed',
                        borderColor: uploading ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: uploading ? 'default' : 'pointer',
                        display: 'block',
                        transition: 'all 0.2s',
                        '&:hover': uploading ? {} : { borderColor: 'primary.main', bgcolor: 'action.hover' }
                      }}
                    >
                      <input
                        type='file'
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        disabled={uploading}
                        accept='.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.png,.jpg,.jpeg'
                      />
                      {uploading ? (
                        <Stack alignItems='center' spacing={2}>
                          <CircularProgress size={24} />
                          <Typography variant='body2' color='text.secondary'>
                            Subiendo archivo seguro...
                          </Typography>
                        </Stack>
                      ) : (
                        <Stack alignItems='center' spacing={1}>
                          <i className='tabler-cloud-upload text-3xl text-textSecondary' />
                          <Typography variant='body2' fontWeight={600} color='primary'>
                            Haz click para seleccionar tu archivo de entrega
                          </Typography>
                          <Typography variant='caption' color='text.disabled'>
                            Formatos permitidos: PDF, Word, Excel, ZIP, Imagen · Máx. 50 MB
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Comentarios del estudiante */}
                <CustomTextField
                  fullWidth
                  multiline
                  rows={3}
                  label='Comentarios o mensaje al docente (Opcional)'
                  placeholder='Escribe algún comentario o aclaración sobre tu entrega...'
                  value={comentarioEstudiante}
                  onChange={e => setComentarioEstudiante(e.target.value)}
                  disabled={uploading || saving}
                />

                {/* Botones de acción */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant='contained'
                    onClick={handleSaveEntrega}
                    disabled={uploading || saving || (!tempFile && !entrega)}
                    startIcon={saving ? <CircularProgress size={16} color='inherit' /> : <i className='tabler-send' />}
                    sx={{ textTransform: 'none', borderRadius: 1.5 }}
                  >
                    {saving ? 'Enviando...' : entrega ? 'Guardar Cambios' : 'Enviar Entrega'}
                  </Button>
                  {entrega && (
                    <Button
                      variant='outlined'
                      onClick={() => {
                        setTempFile(null)
                        setComentarioEstudiante(entrega.comentario_estudiante || '')
                        setIsEditing(false)
                      }}
                      disabled={uploading || saving}
                      sx={{ textTransform: 'none', borderRadius: 1.5 }}
                    >
                      Cancelar
                    </Button>
                  )}
                </Box>
              </Stack>
            )
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}
