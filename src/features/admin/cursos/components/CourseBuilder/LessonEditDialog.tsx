'use client'

import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Divider,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton
} from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import MediaLibrary from '../MediaLibrary'
import { sanitizeDatetimeInput, toLocalDatetimeLocalValue } from '@/utils/functions/sanitizeDatetime'

interface LessonEditDialogProps {
  open: boolean
  onClose: () => void
  lessonData: any
  onSave: (data: any) => void
  isSaving: boolean
}

export function LessonEditDialog({ open, onClose, lessonData, onSave, isSaving }: LessonEditDialogProps) {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState<number | string>('')
  const [videoUrl, setVideoUrl] = useState('')
  const [esEnVivo, setEsEnVivo] = useState(false)
  const [fechaProgramada, setFechaProgramada] = useState('')
  const [enlaceReunion, setEnlaceReunion] = useState('')
  const [esVistaPrevia, setEsVistaPrevia] = useState(false)
  const [recursos, setRecursos] = useState<any[]>([])
  const [contenido, setContenido] = useState('')
  const [newRecurso, setNewRecurso] = useState({ nombre: '', url: '' })
  const [openMediaResources, setOpenMediaResources] = useState(false)

  // Usar useEffect para actualizar cuando cambie lessonData
  useEffect(() => {
    if (lessonData) {
      setTitle(lessonData.titulo || '')
      setDuration(lessonData.duracion || '')
      setVideoUrl(lessonData.video_url || '')
      setEsEnVivo(lessonData.es_en_vivo || false)

      // Formatear fecha para el input datetime-local (YYYY-MM-DDTHH:mm)
      if (lessonData.fecha_programada) {
        setFechaProgramada(toLocalDatetimeLocalValue(lessonData.fecha_programada))
      } else {
        setFechaProgramada('')
      }

      setEnlaceReunion(lessonData.enlace_reunion || '')
      setEsVistaPrevia(lessonData.es_vista_previa || false)
      setRecursos(lessonData.recursos || [])
      setContenido(lessonData.contenido || '')
    } else {
      // Reset fields when no lessonData (e.g. modal closed)
      setTitle('')
      setDuration('')
      setVideoUrl('')
      setEsEnVivo(false)
      setFechaProgramada('')
      setEnlaceReunion('')
      setEsVistaPrevia(false)
      setRecursos([])
      setContenido('')
    }
  }, [lessonData])

  const handleAddRecurso = () => {
    if (newRecurso.nombre && newRecurso.url) {
      setRecursos([...recursos, newRecurso])
      setNewRecurso({ nombre: '', url: '' })
    }
  }

  const handleRemoveRecurso = (index: number) => {
    setRecursos(recursos.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    onSave({
      titulo: title,
      duracion: duration ? Number(duration) : null,
      video_url: videoUrl || null,
      es_en_vivo: esEnVivo,
      fecha_programada: sanitizeDatetimeInput(fechaProgramada),
      enlace_reunion: enlaceReunion || null,
      es_vista_previa: esVistaPrevia,
      contenido: contenido || null,
      recursos: recursos
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Editar Lección</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={4} sx={{ mt: 2 }}>
          <CustomTextField
            fullWidth
            label='Título de la lección'
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <CustomTextField
            fullWidth
            multiline
            rows={3}
            label='Contenido / Descripción'
            placeholder='Descripción o instrucciones de la lección...'
            value={contenido}
            onChange={e => setContenido(e.target.value)}
          />

          <Divider />
          <Typography variant='subtitle2' color='primary'>Tipo de Lección</Typography>

          <FormControlLabel
            control={
              <Switch
                checked={esEnVivo}
                onChange={e => setEsEnVivo(e.target.checked)}
                color='primary'
              />
            }
            label={
              <Box>
                <Typography variant='body2' fontWeight={600}>¿Es una clase en vivo?</Typography>
                <Typography variant='caption' color='text.secondary'>Activa esto si la clase se transmitirá en tiempo real.</Typography>
              </Box>
            }
          />

          {esEnVivo ? (
            <>
              <CustomTextField
                fullWidth
                type='datetime-local'
                label='Fecha y Hora Programada'
                value={fechaProgramada}
                onChange={e => setFechaProgramada(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <CustomTextField
                fullWidth
                label='Enlace de la Reunión (Zoom, Meet, WhatsApp, etc.)'
                placeholder='https://zoom.us/j/...'
                value={enlaceReunion}
                onChange={e => setEnlaceReunion(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position='start'><i className='tabler-link text-xl text-textSecondary' /></InputAdornment>
                }}
              />
            </>
          ) : (
            <CustomTextField
              fullWidth
              label='URL del Video (Vimeo / Youtube)'
              placeholder='https://vimeo.com/...'
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position='start'><i className='tabler-brand-vimeo text-xl text-textSecondary' /></InputAdornment>
              }}
            />
          )}

          <CustomTextField
            fullWidth
            type='number'
            label='Duración estimada (minutos)'
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />

          <FormControlLabel
            control={
              <Switch
                checked={esVistaPrevia}
                onChange={e => setEsVistaPrevia(e.target.checked)}
                color='primary'
              />
            }
            label={
              <Box>
                <Typography variant='body2' fontWeight={600}>Vista Previa Gratuita</Typography>
                <Typography variant='caption' color='text.secondary'>Permite que esta lección sea vista sin estar matriculado.</Typography>
              </Box>
            }
          />

          <Divider />
          <Typography variant='subtitle2'>Recursos y Materiales</Typography>

          {recursos.length > 0 && (
            <Stack spacing={2}>
              {recursos.map((r, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <i className='tabler-file-download text-xl text-primary' />
                    <Typography variant='body2' fontWeight={600}>{r.nombre}</Typography>
                  </Box>
                  <IconButton size='small' color='error' onClick={() => handleRemoveRecurso(i)}>
                    <i className='tabler-x text-lg' />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          )}

          <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, border: '1px dashed', borderColor: 'divider' }}>
            <Stack spacing={2}>
              <CustomTextField
                fullWidth
                size='small'
                placeholder='Nombre del recurso (ej: Guía PDF)'
                value={newRecurso.nombre}
                onChange={e => setNewRecurso({ ...newRecurso, nombre: e.target.value })}
              />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <CustomTextField
                  fullWidth
                  size='small'
                  placeholder='Archivo no seleccionado'
                  value={newRecurso.url ? (newRecurso.url.startsWith('/') ? '✓ Archivo cargado' : newRecurso.url) : ''}
                  onChange={e => setNewRecurso({ ...newRecurso, url: e.target.value })}
                  InputProps={{
                    readOnly: newRecurso.url ? newRecurso.url.startsWith('/') : false,
                    endAdornment: (
                      <InputAdornment position='end'>
                        {newRecurso.url && newRecurso.url.startsWith('/') && (
                          <IconButton size='small' color='error' onClick={() => setNewRecurso({ ...newRecurso, url: '' })}>
                            <i className='tabler-x text-lg' />
                          </IconButton>
                        )}
                        <IconButton
                          size='small'
                          onClick={() => setOpenMediaResources(true)}
                          color='primary'
                        >
                          <i className='tabler-upload text-lg' />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  variant='tonal'
                  size='small'
                  onClick={handleAddRecurso}
                  disabled={!newRecurso.nombre || !newRecurso.url}
                  sx={{ height: 38, minWidth: 100 }}
                >
                  Añadir
                </Button>
              </Box>
            </Stack>

            <MediaLibrary
              open={openMediaResources}
              onClose={() => setOpenMediaResources(false)}
              onSelect={(url: string, nombre?: string) => {
                const parts = url.split('/')
                const fileName = parts[parts.length - 1] || 'Recurso'
                const resourceName = nombre || fileName.split('.')[0] || 'Recurso'

                setNewRecurso({ nombre: resourceName, url })
                setOpenMediaResources(false)
              }}
              title="Seleccionar Recurso"
              acceptType="OTRO"
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>Cancelar</Button>
        <Button variant='contained' onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
