'use client'

import { useState, useEffect } from 'react'

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Switch,
    FormControlLabel,
    Tab,
    Typography,
    Tooltip,
    Divider,
    Collapse,
    CircularProgress,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { useSnackbar } from 'notistack'

import CustomTextField from '@core/components/mui/TextField'
import MediaLibrary from '../components/MediaLibrary'

import type { Curso, CursoLeccionResumen } from '../entity/Curso'
import {
    useCurso,
    useEditCurso,
    useCreateModulo,
    useDeleteModulo,
    useReorderModulos,
    useCreateLeccion,
    useUpdateLeccion,
    useDeleteLeccion,
    useReorderLecciones,
    useCambiarEstadoCurso
} from '../hooks/useCursos'
import { useCategorias } from '@/features/admin/categorias/hooks/useCategorias'

interface CourseBuilderPageProps {
    cursoId: string
    profesores: { id: string; nombre: string; apellido: string }[]
}

export function CourseBuilderPage({ cursoId, profesores }: CourseBuilderPageProps) {
    const { data: curso, isLoading, refetch } = useCurso(cursoId)
    const [activeTab, setActiveTab] = useState('1')

    if (isLoading || !curso) {
        return (
            <Box display='flex' justifyContent='center' p={8}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant='h4' fontWeight={600}>
                        {curso.titulo}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                            size='small'
                            variant='tonal'
                            label={curso.estado === 'BORRADOR' ? 'Borrador' : curso.estado === 'PUBLICADO' ? 'Publicado' : 'Archivado'}
                            color={curso.estado === 'BORRADOR' ? 'warning' : curso.estado === 'PUBLICADO' ? 'success' : 'secondary'}
                        />
                        <Typography variant='body2' color='text.secondary'>
                            · {curso.modulos?.length ?? 0} módulos
                        </Typography>
                    </Box>
                </Box>
                <Button
                    variant='outlined'
                    href='/admin/cursos'
                    component='a'
                    startIcon={<i className='tabler-arrow-left' />}
                >
                    Volver a Cursos
                </Button>
            </Box>

            {/* Tabs */}
            <TabContext value={activeTab}>
                <Card>
                    <TabList onChange={(_, val) => setActiveTab(val)} variant='scrollable'>
                        <Tab icon={<i className='tabler-info-circle' />} iconPosition='start' label='Información' value='1' />
                        <Tab icon={<i className='tabler-list-tree' />} iconPosition='start' label='Contenido' value='2' />
                        <Tab icon={<i className='tabler-star' />} iconPosition='start' label='Detalles Premium' value='4' />
                        <Tab icon={<i className='tabler-settings' />} iconPosition='start' label='Configuración' value='3' />
                    </TabList>

                    <TabPanel value='1' sx={{ p: 5 }}>
                        <TabInformacion curso={curso} profesores={profesores} onSuccess={refetch} />
                    </TabPanel>

                    <TabPanel value='2' sx={{ p: 5 }}>
                        <TabContenido curso={curso} onSuccess={refetch} />
                    </TabPanel>

                    <TabPanel value='3' sx={{ p: 5 }}>
                        <TabConfiguracion curso={curso} onSuccess={refetch} />
                    </TabPanel>

                    <TabPanel value='4' sx={{ p: 5 }}>
                        <TabDetallesPremium curso={curso} onSuccess={refetch} />
                    </TabPanel>
                </Card>
            </TabContext>
        </Box>
    )
}

// =====================================================================
// TAB 1: INFORMACIÓN
// =====================================================================

function TabInformacion({ curso, profesores, onSuccess }: { curso: Curso; profesores: { id: string; nombre: string; apellido: string }[]; onSuccess: () => void }) {
    const { enqueueSnackbar } = useSnackbar()
    const editMutation = useEditCurso()
    const { data: categorias = [] } = useCategorias()

    const [openMedia, setOpenMedia] = useState(false)

    const [form, setForm] = useState({
        titulo: curso.titulo,
        descripcion: curso.descripcion || '',
        categoria_id: curso.categoria_id || '',
        profesor_id: curso.profesor_id,
        tipo_emision: curso.tipo_emision,
        duracion: curso.duracion || '',
        miniatura: curso.miniatura || '',
        video_presentacion: curso.video_presentacion || '',
        fecha_inicio: curso.fecha_inicio ? new Date(curso.fecha_inicio).toISOString().split('T')[0] : ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSave = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: {
                    titulo: form.titulo,
                    descripcion: form.descripcion?.trim() || null,
                    categoria_id: form.categoria_id || null,
                    profesor_id: form.profesor_id,
                    tipo_emision: form.tipo_emision as 'SINCRONO' | 'ASINCRONO' | 'MIXTO',
                    duracion: form.duracion || null,
                    miniatura: form.miniatura || null,
                    video_presentacion: form.video_presentacion || null,
                    fecha_inicio: form.fecha_inicio ? new Date(form.fecha_inicio).toISOString() : null
                }
            })
            enqueueSnackbar('Curso actualizado exitosamente', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al actualizar', { variant: 'error' })
        }
    }

    return (
        <Grid container spacing={5}>
            <Grid item xs={12}>
                <CustomTextField
                    fullWidth
                    label='Título del Curso'
                    name='titulo'
                    value={form.titulo}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position='start'><i className='tabler-book text-xl text-textSecondary' /></InputAdornment>
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <CustomTextField
                    fullWidth
                    multiline
                    rows={4}
                    label='Descripción'
                    name='descripcion'
                    value={form.descripcion}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomTextField
                    select
                    fullWidth
                    label='Categoría'
                    name='categoria_id'
                    value={form.categoria_id}
                    onChange={handleChange}
                >
                    <MenuItem value=''>Sin categoría</MenuItem>
                    {categorias.map(cat => (
                        <MenuItem key={cat.id} value={cat.id}>{cat.nombre}</MenuItem>
                    ))}
                </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
                <CustomTextField
                    select
                    fullWidth
                    label='Profesor'
                    name='profesor_id'
                    value={form.profesor_id}
                    onChange={handleChange}
                >
                    {profesores.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.nombre} {p.apellido}</MenuItem>
                    ))}
                </CustomTextField>
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant='body2' color='text.secondary'>Tipo de emisión:</Typography>
                    <Button
                        variant={form.tipo_emision === 'ASINCRONO' ? 'contained' : 'outlined'}
                        size='small'
                        onClick={() => setForm(prev => ({ ...prev, tipo_emision: 'ASINCRONO' }))}
                        startIcon={<i className='tabler-player-play' />}
                    >
                        Asíncrono
                    </Button>
                    <Button
                        variant={form.tipo_emision === 'SINCRONO' ? 'contained' : 'outlined'}
                        size='small'
                        onClick={() => setForm(prev => ({ ...prev, tipo_emision: 'SINCRONO' }))}
                        startIcon={<i className='tabler-live-photo' />}
                    >
                        Síncrono
                    </Button>
                    <Button
                        variant={form.tipo_emision === 'MIXTO' ? 'contained' : 'outlined'}
                        size='small'
                        onClick={() => setForm(prev => ({ ...prev, tipo_emision: 'MIXTO' }))}
                        startIcon={<i className='tabler-arrows-split' />}
                    >
                        Mixto
                    </Button>
                </Box>
            </Grid>
            {(form.tipo_emision === 'SINCRONO' || form.tipo_emision === 'MIXTO') && (
                <Grid item xs={12} sm={6}>
                    <CustomTextField
                        fullWidth
                        type='date'
                        label='Fecha de Inicio'
                        name='fecha_inicio'
                        value={form.fecha_inicio}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: <InputAdornment position='start'><i className='tabler-calendar text-xl text-textSecondary' /></InputAdornment>
                        }}
                    />
                </Grid>
            )}
            <Grid item xs={12} sm={6}>
                <CustomTextField
                    fullWidth
                    label='Duración'
                    name='duracion'
                    placeholder='Ej: 12 horas'
                    value={form.duracion}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position='start'><i className='tabler-clock text-xl text-textSecondary' /></InputAdornment>
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <Typography variant='subtitle2' sx={{ mb: 1 }}>Imagen de Portada</Typography>
                {form.miniatura ? (
                    <Box sx={{ position: 'relative', width: '100%', borderRadius: 2, overflow: 'hidden', mb: 2, bgcolor: '#f4f4f4', border: '1px solid', borderColor: 'divider' }}>
                        <img
                            src={form.miniatura}
                            alt='Vista previa'
                            style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', maxHeight: 240 }}
                        />
                        <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
                            <IconButton
                                size='small'
                                sx={{ bgcolor: 'background.paper', '&:hover': { bgcolor: 'background.paper' } }}
                                onClick={() => setForm(prev => ({ ...prev, miniatura: '' }))}
                            >
                                <i className='tabler-trash text-error text-sm' />
                            </IconButton>
                        </Box>
                    </Box>
                ) : (
                    <Box
                        onClick={() => setOpenMedia(true)}
                        sx={{
                            width: '100%',
                            height: 120,
                            borderRadius: 2,
                            border: '1px dashed',
                            borderColor: 'divider',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            bgcolor: 'action.hover',
                            mb: 2,
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lightOpacity' }
                        }}
                    >
                        <i className='tabler-photo-plus text-2xl text-textDisabled' />
                        <Typography variant='caption' color='text.secondary' sx={{ mt: 1 }}>Click para seleccionar</Typography>
                    </Box>
                )}

                <Button
                    variant='outlined'
                    size='small'
                    fullWidth
                    startIcon={<i className='tabler-photo' />}
                    onClick={() => setOpenMedia(true)}
                >
                    {form.miniatura ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                </Button>

                <MediaLibrary
                    open={openMedia}
                    onClose={() => setOpenMedia(false)}
                    onSelect={(url) => setForm(prev => ({ ...prev, miniatura: url }))}
                />
            </Grid>
            <Grid item xs={12}>
                <CustomTextField
                    fullWidth
                    label='URL Video Presentación (Vimeo)'
                    name='video_presentacion'
                    value={form.video_presentacion}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position='start'><i className='tabler-brand-vimeo text-xl text-textSecondary' /></InputAdornment>
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant='contained'
                        onClick={handleSave}
                        disabled={editMutation.isPending}
                        startIcon={<i className='tabler-device-floppy' />}
                    >
                        {editMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}

// =====================================================================
// DIALOG DE EDICIÓN DE LECCIONES
// =====================================================================

function LessonEditDialog({ open, onClose, lessonData, onSave, isSaving }: any) {
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

// =====================================================================
// TAB 2: CONTENIDO (Módulos y Lecciones)
// =====================================================================

function TabContenido({ curso, onSuccess }: { curso: Curso; onSuccess: () => void }) {
    const { enqueueSnackbar } = useSnackbar()
    const createModuloMutation = useCreateModulo()
    const deleteModuloMutation = useDeleteModulo()
    const reorderModulosMutation = useReorderModulos()
    const createLeccionMutation = useCreateLeccion()
    const deleteLeccionMutation = useDeleteLeccion()
    const updateLeccionMutation = useUpdateLeccion()
    const reorderLeccionesMutation = useReorderLecciones()

    const [newModuleTitle, setNewModuleTitle] = useState('')
    const [expandedModule, setExpandedModule] = useState<string | null>(null)
    const [newLessonTitles, setNewLessonTitles] = useState<Record<string, string>>({})
    const [editingLesson, setEditingLesson] = useState<{ moduloId: string; leccion: CursoLeccionResumen } | null>(null)

    const modulos = curso.modulos || []

    // Agregar Módulo
    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return

        try {
            await createModuloMutation.mutateAsync({ cursoId: curso.id, data: { titulo: newModuleTitle.trim() } })
            setNewModuleTitle('')
            enqueueSnackbar('Módulo creado', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al crear módulo', { variant: 'error' })
        }
    }

    // Eliminar Módulo
    const handleDeleteModule = async (moduloId: string) => {
        try {
            await deleteModuloMutation.mutateAsync({ cursoId: curso.id, moduloId })
            enqueueSnackbar('Módulo eliminado', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al eliminar módulo', { variant: 'error' })
        }
    }

    // Reordenar Módulos
    const handleMoveModule = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1

        if (newIndex < 0 || newIndex >= modulos.length) return

        const reordered = [...modulos]
        const [moved] = reordered.splice(index, 1)

        reordered.splice(newIndex, 0, moved)

        const items = reordered.map((m, i) => ({ id: m.id, orden: i }))

        try {
            await reorderModulosMutation.mutateAsync({ cursoId: curso.id, items })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al reordenar', { variant: 'error' })
        }
    }

    // Agregar Lección
    const handleAddLesson = async (moduloId: string) => {
        const titulo = newLessonTitles[moduloId]?.trim()

        if (!titulo) return

        try {
            await createLeccionMutation.mutateAsync({ cursoId: curso.id, moduloId, data: { titulo } })
            setNewLessonTitles(prev => ({ ...prev, [moduloId]: '' }))
            enqueueSnackbar('Lección creada', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al crear lección', { variant: 'error' })
        }
    }

    // Eliminar Lección
    const handleDeleteLesson = async (moduloId: string, leccionId: string) => {
        try {
            await deleteLeccionMutation.mutateAsync({ cursoId: curso.id, moduloId, leccionId })
            enqueueSnackbar('Lección eliminada', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al eliminar', { variant: 'error' })
        }
    }

    // Toggle estado lección
    const handleToggleLessonStatus = async (moduloId: string, leccion: CursoLeccionResumen) => {
        const nuevoEstado = leccion.estado === 'PUBLICADO' ? 'BORRADOR' : 'PUBLICADO'

        try {
            await updateLeccionMutation.mutateAsync({
                cursoId: curso.id,
                moduloId,
                leccionId: leccion.id,
                data: { estado: nuevoEstado }
            })
            enqueueSnackbar(`Lección ${nuevoEstado === 'PUBLICADO' ? 'publicada' : 'como borrador'}`, { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error', { variant: 'error' })
        }
    }

    // Toggle vista previa
    const handleToggleLessonPreview = async (moduloId: string, leccion: CursoLeccionResumen) => {
        const nuevoValor = !leccion.es_vista_previa

        try {
            await updateLeccionMutation.mutateAsync({
                cursoId: curso.id,
                moduloId,
                leccionId: leccion.id,
                data: { es_vista_previa: nuevoValor }
            })
            enqueueSnackbar(`Vista previa ${nuevoValor ? 'activada' : 'desactivada'}`, { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error', { variant: 'error' })
        }
    }

    // Reordenar lecciones
    const handleMoveLesson = async (moduloId: string, lecciones: CursoLeccionResumen[], index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1

        if (newIndex < 0 || newIndex >= lecciones.length) return

        const reordered = [...lecciones]
        const [moved] = reordered.splice(index, 1)

        reordered.splice(newIndex, 0, moved)

        const items = reordered.map((l, i) => ({ id: l.id, orden: i }))

        try {
            await reorderLeccionesMutation.mutateAsync({ cursoId: curso.id, moduloId, items })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al reordenar', { variant: 'error' })
        }
    }

    // Guardar cambios en la lección desde el modal
    const handleSaveLessonEdit = async (data: any) => {
        if (!editingLesson) return

        try {
            await updateLeccionMutation.mutateAsync({
                cursoId: curso.id,
                moduloId: editingLesson.moduloId,
                leccionId: editingLesson.leccion.id,
                data
            })
            enqueueSnackbar('Lección actualizada', { variant: 'success' })
            setEditingLesson(null)
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al actualizar lección', { variant: 'error' })
        }
    }

    return (
        <Box>
            {/* Añadir módulo */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <CustomTextField
                    fullWidth
                    placeholder='Nombre del nuevo módulo...'
                    value={newModuleTitle}
                    onChange={e => setNewModuleTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddModule()}
                    InputProps={{
                        startAdornment: <InputAdornment position='start'><i className='tabler-folder-plus text-xl text-textSecondary' /></InputAdornment>
                    }}
                />
                <Button
                    variant='contained'
                    onClick={handleAddModule}
                    disabled={!newModuleTitle.trim() || createModuloMutation.isPending}
                    startIcon={<i className='tabler-plus' />}
                    sx={{ whiteSpace: 'nowrap' }}
                >
                    Añadir Módulo
                </Button>
            </Box>

            {modulos.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 6, color: 'text.disabled' }}>
                    <i className='tabler-folder-off text-5xl' />
                    <Typography variant='body1' sx={{ mt: 2 }}>
                        Este curso no tiene módulos aún. Añade el primero arriba.
                    </Typography>
                </Box>
            )}

            {/* Lista de módulos */}
            {modulos.map((modulo, mIndex) => (
                <Card key={modulo.id} sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
                    {/* Header del módulo */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 3,
                            py: 2,
                            bgcolor: 'action.hover',
                            cursor: 'pointer'
                        }}
                        onClick={() => setExpandedModule(expandedModule === modulo.id ? null : modulo.id)}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <i className={`tabler-chevron-${expandedModule === modulo.id ? 'down' : 'right'} text-xl`} />
                            <Typography variant='subtitle1' fontWeight={600}>
                                Módulo {mIndex + 1}: {modulo.titulo}
                            </Typography>
                            <Chip
                                size='small'
                                variant='outlined'
                                label={`${modulo.lecciones?.length ?? 0} lecciones`}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={e => e.stopPropagation()}>
                            <Tooltip title='Subir'>
                                <IconButton size='small' disabled={mIndex === 0} onClick={() => handleMoveModule(mIndex, 'up')}>
                                    <i className='tabler-arrow-up text-lg' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Bajar'>
                                <IconButton size='small' disabled={mIndex === modulos.length - 1} onClick={() => handleMoveModule(mIndex, 'down')}>
                                    <i className='tabler-arrow-down text-lg' />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title='Eliminar módulo'>
                                <IconButton size='small' color='error' onClick={() => handleDeleteModule(modulo.id)}>
                                    <i className='tabler-trash text-lg' />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Contenido expandido: lecciones */}
                    <Collapse in={expandedModule === modulo.id}>
                        <CardContent>
                            {(modulo.lecciones?.length ?? 0) === 0 && (
                                <Typography variant='body2' color='text.disabled' sx={{ py: 2, textAlign: 'center' }}>
                                    Sin lecciones aún
                                </Typography>
                            )}

                            {modulo.lecciones?.map((leccion, lIndex) => (
                                <Box
                                    key={leccion.id}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        py: 1.5,
                                        px: 2,
                                        borderRadius: 1,
                                        '&:hover': { bgcolor: 'action.hover' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <i className='tabler-file-text text-lg text-textSecondary' />
                                        <Typography variant='body2'>{leccion.titulo}</Typography>
                                        <Chip
                                            size='small'
                                            variant='tonal'
                                            label={leccion.estado === 'PUBLICADO' ? 'Publicado' : 'Borrador'}
                                            color={leccion.estado === 'PUBLICADO' ? 'success' : 'warning'}
                                        />
                                        {leccion.es_vista_previa && (
                                            <Chip
                                                size='small'
                                                variant='outlined'
                                                label='Vista Previa'
                                                color='primary'
                                                icon={<i className='tabler-eye text-xs' />}
                                            />
                                        )}
                                        {leccion.duracion && (
                                            <Typography variant='caption' color='text.disabled'>
                                                {leccion.duracion} min
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Tooltip title='Editar contenido'>
                                            <IconButton size='small' color='primary' onClick={() => setEditingLesson({ moduloId: modulo.id, leccion })}>
                                                <i className='tabler-edit text-lg' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={leccion.estado === 'PUBLICADO' ? 'Pasar a borrador' : 'Publicar'}>
                                            <IconButton size='small' onClick={() => handleToggleLessonStatus(modulo.id, leccion)}>
                                                <i className={`tabler-${leccion.estado === 'PUBLICADO' ? 'eye-off' : 'eye'} text-lg`} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={leccion.es_vista_previa ? 'Quitar vista previa' : 'Activar vista previa'}>
                                            <IconButton
                                                size='small'
                                                color={leccion.es_vista_previa ? 'primary' : 'default'}
                                                onClick={() => handleToggleLessonPreview(modulo.id, leccion)}
                                            >
                                                <i className={`tabler-lock${leccion.es_vista_previa ? '-open' : ''} text-lg`} />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Subir'>
                                            <IconButton size='small' disabled={lIndex === 0} onClick={() => handleMoveLesson(modulo.id, modulo.lecciones, lIndex, 'up')}>
                                                <i className='tabler-arrow-up text-lg' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Bajar'>
                                            <IconButton size='small' disabled={lIndex === (modulo.lecciones?.length ?? 0) - 1} onClick={() => handleMoveLesson(modulo.id, modulo.lecciones, lIndex, 'down')}>
                                                <i className='tabler-arrow-down text-lg' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Eliminar'>
                                            <IconButton size='small' color='error' onClick={() => handleDeleteLesson(modulo.id, leccion.id)}>
                                                <i className='tabler-trash text-lg' />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            {/* Añadir lección inline */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <CustomTextField
                                    fullWidth
                                    size='small'
                                    placeholder='Nueva lección...'
                                    value={newLessonTitles[modulo.id] || ''}
                                    onChange={e => setNewLessonTitles(prev => ({ ...prev, [modulo.id]: e.target.value }))}
                                    onKeyDown={e => e.key === 'Enter' && handleAddLesson(modulo.id)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position='start'><i className='tabler-file-plus text-lg text-textSecondary' /></InputAdornment>
                                    }}
                                />
                                <Button
                                    variant='tonal'
                                    size='small'
                                    onClick={() => handleAddLesson(modulo.id)}
                                    disabled={!newLessonTitles[modulo.id]?.trim()}
                                    startIcon={<i className='tabler-plus' />}
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    Añadir
                                </Button>
                            </Box>
                        </CardContent>
                    </Collapse>
                </Card>
            ))}

            <LessonEditDialog
                key={editingLesson?.leccion?.id || 'new'}
                open={!!editingLesson}
                onClose={() => setEditingLesson(null)}
                lessonData={editingLesson?.leccion}
                onSave={handleSaveLessonEdit}
                isSaving={updateLeccionMutation.isPending}
            />
        </Box>
    )
}

// =====================================================================
// TAB 3: CONFIGURACIÓN
// =====================================================================

function TabConfiguracion({ curso, onSuccess }: { curso: Curso; onSuccess: () => void }) {
    const { enqueueSnackbar } = useSnackbar()
    const editMutation = useEditCurso()
    const estadoMutation = useCambiarEstadoCurso()

    const [esGratis, setEsGratis] = useState(curso.es_gratis)
    const [precio, setPrecio] = useState(curso.precio)
    const [moneda, setMoneda] = useState(curso.moneda)

    const handleSavePrice = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: { es_gratis: esGratis, precio: esGratis ? 0 : precio, moneda }
            })
            enqueueSnackbar('Configuración actualizada', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error', { variant: 'error' })
        }
    }

    const handleChangeEstado = async (nuevoEstado: 'BORRADOR' | 'PUBLICADO' | 'ARCHIVADO') => {
        try {
            await estadoMutation.mutateAsync({ id: curso.id, data: { estado: nuevoEstado } })
            enqueueSnackbar(`Curso ${nuevoEstado === 'PUBLICADO' ? 'publicado' : nuevoEstado === 'ARCHIVADO' ? 'archivado' : 'volvió a borrador'}`, { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || error?.error || 'Error al cambiar estado', { variant: 'error' })
        }
    }

    return (
        <Grid container spacing={4}>
            {/* Precio */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2 }}>Precio</Typography>
                <FormControlLabel
                    control={
                        <Switch
                            checked={esGratis}
                            onChange={e => {
                                setEsGratis(e.target.checked)

                                if (e.target.checked) setPrecio(0)
                            }}
                        />
                    }
                    label='Este curso es gratis'
                />
                {!esGratis && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <CustomTextField
                            type='number'
                            label='Precio'
                            value={precio}
                            onChange={e => setPrecio(Number(e.target.value))}
                            sx={{ width: 200 }}
                        />
                        <CustomTextField
                            select
                            label='Moneda'
                            value={moneda}
                            onChange={e => setMoneda(e.target.value)}
                            sx={{ width: 120 }}
                        >
                            <MenuItem value='PEN'>PEN (S/)</MenuItem>
                            <MenuItem value='USD'>USD ($)</MenuItem>
                        </CustomTextField>
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant='contained'
                        onClick={handleSavePrice}
                        disabled={editMutation.isPending}
                        startIcon={<i className='tabler-device-floppy' />}
                    >
                        Guardar Precio
                    </Button>
                </Box>
            </Grid>

            <Grid item xs={12}><Divider /></Grid>

            {/* Estado */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2 }}>Estado del Curso</Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Estado actual: <Chip
                        size='small'
                        variant='tonal'
                        label={curso.estado === 'BORRADOR' ? 'Borrador' : curso.estado === 'PUBLICADO' ? 'Publicado' : 'Archivado'}
                        color={curso.estado === 'BORRADOR' ? 'warning' : curso.estado === 'PUBLICADO' ? 'success' : 'secondary'}
                    />
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {curso.estado !== 'PUBLICADO' && (
                        <Button
                            variant='contained'
                            color='success'
                            onClick={() => handleChangeEstado('PUBLICADO')}
                            disabled={estadoMutation.isPending}
                            startIcon={<i className='tabler-world' />}
                        >
                            Publicar Curso
                        </Button>
                    )}
                    {curso.estado === 'PUBLICADO' && (
                        <Button
                            variant='contained'
                            color='secondary'
                            onClick={() => handleChangeEstado('ARCHIVADO')}
                            disabled={estadoMutation.isPending}
                            startIcon={<i className='tabler-archive' />}
                        >
                            Archivar
                        </Button>
                    )}
                    {curso.estado !== 'BORRADOR' && (
                        <Button
                            variant='outlined'
                            onClick={() => handleChangeEstado('BORRADOR')}
                            disabled={estadoMutation.isPending}
                            startIcon={<i className='tabler-pencil' />}
                        >
                            Volver a Borrador
                        </Button>
                    )}
                </Box>
                {curso.estado !== 'PUBLICADO' && (
                    <Typography variant='caption' color='text.disabled' sx={{ mt: 2, display: 'block' }}>
                        Para publicar se requiere al menos 1 módulo con 1 lección publicada.
                    </Typography>
                )}
            </Grid>
        </Grid>
    )
}

// =====================================================================
// TAB 4: DETALLES PREMIUM
// =====================================================================

function TabDetallesPremium({ curso, onSuccess }: { curso: Curso; onSuccess: () => void }) {
    const { enqueueSnackbar } = useSnackbar()
    const editMutation = useEditCurso()

    const [objetivos, setObjetivos] = useState<string[]>(curso.objetivos || [])
    const [metodologia, setMetodologia] = useState<any[]>(curso.metodologia || [])
    const [beneficios, setBeneficios] = useState<any[]>(curso.beneficios || [])
    const [incluye, setIncluye] = useState<any[]>(curso.incluye || [])

    const [newObjetivo, setNewObjetivo] = useState('')

    const handleSave = async () => {
        try {
            await editMutation.mutateAsync({
                id: curso.id,
                data: { objetivos, metodologia, beneficios, incluye }
            })
            enqueueSnackbar('Detalles premium actualizados', { variant: 'success' })
            onSuccess()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al guardar', { variant: 'error' })
        }
    }

    // Gestionar Objetivos
    const addObjetivo = () => {
        if (!newObjetivo.trim()) return
        setObjetivos(prev => [...prev, newObjetivo.trim()])
        setNewObjetivo('')
    }

    const removeObjetivo = (index: number) => {
        setObjetivos(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <Grid container spacing={6}>
            {/* Objetivos */}
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-target' /> ¿Qué logrará el alumno? (Objetivos)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <CustomTextField
                        fullWidth
                        placeholder='Añadir un objetivo...'
                        value={newObjetivo}
                        onChange={e => setNewObjetivo(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addObjetivo()}
                    />
                    <Button variant='tonal' onClick={addObjetivo} startIcon={<i className='tabler-plus' />}>
                        Añadir
                    </Button>
                </Box>
                <Stack spacing={2}>
                    {objetivos.map((obj, i) => (
                        <Card key={i} variant='outlined' sx={{ px: 3, py: 2, bgcolor: 'action.hover' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant='body2'>{obj}</Typography>
                                <IconButton size='small' color='error' onClick={() => removeObjetivo(i)}>
                                    <i className='tabler-trash' />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            </Grid>

            {/* Metodología */}
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-certificate' /> Metodología de Aprendizaje
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Define los pilares de tu enseñanza. Aparecerán como tarjetas en la página de detalle.
                </Typography>

                <Button
                    variant='outlined'
                    startIcon={<i className='tabler-plus' />}
                    onClick={() => setMetodologia([...metodologia, { title: '', desc: '', icon: 'tabler-star' }])}
                    sx={{ mb: 3 }}
                >
                    Añadir Pilar Metodológico
                </Button>

                <Grid container spacing={3}>
                    {metodologia.map((m, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Card variant='outlined' sx={{ p: 4, position: 'relative' }}>
                                <IconButton
                                    size='small'
                                    color='error'
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={() => setMetodologia(metodologia.filter((_, idx) => idx !== i))}
                                >
                                    <i className='tabler-x' />
                                </IconButton>
                                <Stack spacing={3}>
                                    <CustomTextField
                                        label='Icono (Tabler)'
                                        fullWidth
                                        size='small'
                                        value={m.icon}
                                        onChange={e => {
                                            const newM = [...metodologia]

                                            newM[i].icon = e.target.value
                                            setMetodologia(newM)
                                        }}
                                    />
                                    <CustomTextField
                                        label='Título'
                                        fullWidth
                                        size='small'
                                        value={m.title}
                                        onChange={e => {
                                            const newM = [...metodologia]

                                            newM[i].title = e.target.value
                                            setMetodologia(newM)
                                        }}
                                    />
                                    <CustomTextField
                                        label='Descripción'
                                        fullWidth
                                        multiline
                                        rows={2}
                                        size='small'
                                        value={m.desc}
                                        onChange={e => {
                                            const newM = [...metodologia]

                                            newM[i].desc = e.target.value
                                            setMetodologia(newM)
                                        }}
                                    />
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* Beneficios / Highlights */}
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-gift' /> Beneficios Destacados (Highlights)
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Tarjetas superiores que resaltan características como &quot;Acceso 24/7&quot;, &quot;Clases en vivo&quot;, etc.
                </Typography>

                <Button
                    variant='outlined'
                    startIcon={<i className='tabler-plus' />}
                    onClick={() => setBeneficios([...beneficios, { title: '', desc: '', icon: 'tabler-bolt' }])}
                    sx={{ mb: 3 }}
                >
                    Añadir Highlight
                </Button>

                <Grid container spacing={3}>
                    {beneficios.map((b, i) => (
                        <Grid item xs={12} sm={6} md={3} key={i}>
                            <Card variant='outlined' sx={{ p: 4, position: 'relative' }}>
                                <IconButton
                                    size='small'
                                    color='error'
                                    sx={{ position: 'absolute', top: 8, right: 8 }}
                                    onClick={() => setBeneficios(beneficios.filter((_, idx) => idx !== i))}
                                >
                                    <i className='tabler-x' />
                                </IconButton>
                                <Stack spacing={3}>
                                    <CustomTextField
                                        label='Icono'
                                        size='small'
                                        value={b.icon}
                                        onChange={e => {
                                            const newB = [...beneficios]

                                            newB[i].icon = e.target.value
                                            setBeneficios(newB)
                                        }}
                                    />
                                    <CustomTextField
                                        label='Título'
                                        size='small'
                                        value={b.title}
                                        onChange={e => {
                                            const newB = [...beneficios]

                                            newB[i].title = e.target.value
                                            setBeneficios(newB)
                                        }}
                                    />
                                    <CustomTextField
                                        label='Descripción'
                                        multiline
                                        rows={2}
                                        size='small'
                                        value={b.desc}
                                        onChange={e => {
                                            const newB = [...beneficios]

                                            newB[i].desc = e.target.value
                                            setBeneficios(newB)
                                        }}
                                    />
                                </Stack>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

            {/* El programa incluye (Sidebar) */}
            <Grid item xs={12}><Divider /></Grid>
            <Grid item xs={12}>
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-checklist' /> El programa incluye (Sidebar)
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                    Lista de verificación que aparece en el lateral del curso. Marca lo que está disponible.
                </Typography>

                <Button
                    variant='outlined'
                    startIcon={<i className='tabler-plus' />}
                    onClick={() => setIncluye([...incluye, { text: '', active: true }])}
                    sx={{ mb: 3 }}
                >
                    Añadir Ítem de Lista
                </Button>

                <Stack spacing={2}>
                    {incluye.map((item, i) => (
                        <Card key={i} variant='outlined' sx={{ px: 3, py: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={item.active}
                                            onChange={e => {
                                                const newI = [...incluye]

                                                newI[i].active = e.target.checked
                                                setIncluye(newI)
                                            }}
                                        />
                                    }
                                    label=''
                                />
                                <CustomTextField
                                    fullWidth
                                    size='small'
                                    placeholder='Ej: Certificado oficial'
                                    value={item.text}
                                    onChange={e => {
                                        const newI = [...incluye]

                                        newI[i].text = e.target.value
                                        setIncluye(newI)
                                    }}
                                />
                                <IconButton color='error' onClick={() => setIncluye(incluye.filter((_, idx) => idx !== i))}>
                                    <i className='tabler-trash' />
                                </IconButton>
                            </Box>
                        </Card>
                    ))}
                </Stack>
            </Grid>

            {/* Guardar */}
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                    <Button
                        variant='contained'
                        size='large'
                        onClick={handleSave}
                        disabled={editMutation.isPending}
                        startIcon={<i className='tabler-device-floppy' />}
                    >
                        {editMutation.isPending ? 'Guardando...' : 'Guardar Todos los Detalles Premium'}
                    </Button>
                </Box>
            </Grid>
        </Grid>
    )
}
