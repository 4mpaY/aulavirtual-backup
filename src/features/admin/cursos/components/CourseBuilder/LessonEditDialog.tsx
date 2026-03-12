'use client'

import React, { useState, useEffect } from 'react'

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
    const [esVistaPrevia, setEsVistaPrevia] = useState(false)
    const [recursos, setRecursos] = useState<any[]>([])
    const [contenido, setContenido] = useState('')
    const [newRecurso, setNewRecurso] = useState({ nombre: '', url: '' })

    // Usar useEffect para actualizar cuando cambie lessonData
    useEffect(() => {
        if (lessonData) {
            setTitle(lessonData.titulo || '')
            setDuration(lessonData.duracion || '')
            setVideoUrl(lessonData.video_url || '')
            setEsVistaPrevia(lessonData.es_vista_previa || false)
            setRecursos(lessonData.recursos || [])
            setContenido(lessonData.contenido || '')
        } else {
            // Reset fields when no lessonData (e.g. modal closed)
            setTitle('')
            setDuration('')
            setVideoUrl('')
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
                    <CustomTextField
                        fullWidth
                        type='number'
                        label='Duración (minutos)'
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                    />
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
                                    <Box>
                                        <Typography variant='body2' fontWeight={600}>{r.nombre}</Typography>
                                        <Typography variant='caption' color='text.disabled'>{r.url}</Typography>
                                    </Box>
                                    <IconButton size='small' color='error' onClick={() => handleRemoveRecurso(i)}>
                                        <i className='tabler-x text-lg' />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                    )}

                    <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant='caption' sx={{ mb: 1, display: 'block' }}>Añadir nuevo recurso:</Typography>
                        <Stack spacing={2}>
                            <CustomTextField
                                fullWidth
                                size='small'
                                label='Nombre del recurso (ej: Guía PDF)'
                                value={newRecurso.nombre}
                                onChange={e => setNewRecurso({ ...newRecurso, nombre: e.target.value })}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <CustomTextField
                                    fullWidth
                                    size='small'
                                    label='URL del documento'
                                    value={newRecurso.url}
                                    onChange={e => setNewRecurso({ ...newRecurso, url: e.target.value })}
                                />
                                <Button variant='tonal' size='small' onClick={handleAddRecurso} disabled={!newRecurso.nombre || !newRecurso.url}>
                                    Añadir
                                </Button>
                            </Box>
                        </Stack>
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
