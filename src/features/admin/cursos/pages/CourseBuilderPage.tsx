'use client'

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
    CircularProgress
} from '@mui/material'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import { useSnackbar } from 'notistack'
import { useState, type FC } from 'react'
import { Icon } from '@iconify/react'
import CustomTextField from '@core/components/mui/TextField'

import type { Curso, CursoModulo, CursoLeccionResumen } from '../entity/Curso'
import {
    useCurso,
    useEditCurso,
    useCreateModulo,
    useUpdateModulo,
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

    const [form, setForm] = useState({
        titulo: curso.titulo,
        descripcion: curso.descripcion || '',
        categoria_id: curso.categoria_id || '',
        profesor_id: curso.profesor_id,
        tipo_emision: curso.tipo_emision,
        duracion: curso.duracion || '',
        miniatura: curso.miniatura || '',
        video_presentacion: curso.video_presentacion || ''
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
                    descripcion: form.descripcion || null,
                    categoria_id: form.categoria_id || null,
                    profesor_id: form.profesor_id,
                    tipo_emision: form.tipo_emision as 'SINCRONO' | 'ASINCRONO',
                    duracion: form.duracion || null,
                    miniatura: form.miniatura || null,
                    video_presentacion: form.video_presentacion || null
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
                </Box>
            </Grid>
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
                <CustomTextField
                    fullWidth
                    label='URL Miniatura'
                    name='miniatura'
                    value={form.miniatura}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <InputAdornment position='start'><i className='tabler-photo text-xl text-textSecondary' /></InputAdornment>
                    }}
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
                                        {leccion.duracion && (
                                            <Typography variant='caption' color='text.disabled'>
                                                {leccion.duracion} min
                                            </Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Tooltip title={leccion.estado === 'PUBLICADO' ? 'Pasar a borrador' : 'Publicar'}>
                                            <IconButton size='small' onClick={() => handleToggleLessonStatus(modulo.id, leccion)}>
                                                <i className={`tabler-${leccion.estado === 'PUBLICADO' ? 'eye-off' : 'eye'} text-lg`} />
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
