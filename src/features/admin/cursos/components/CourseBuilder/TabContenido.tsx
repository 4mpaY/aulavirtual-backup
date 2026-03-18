'use client'

import { useState } from 'react'

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    InputAdornment,
    Typography,
    Tooltip,
    Divider,
    Collapse
} from '@mui/material'
import { useSnackbar } from 'notistack'

import CustomTextField from '@core/components/mui/TextField'
import { LessonEditDialog } from './LessonEditDialog'

import type { Curso, CursoLeccionResumen } from '../../entity/Curso'
import {
    useCreateModulo,
    useDeleteModulo,
    useReorderModulos,
    useCreateLeccion,
    useUpdateLeccion,
    useDeleteLeccion,
    useReorderLecciones
} from '../../hooks/useCursos'

interface TabContenidoProps {
    curso: Curso
    onSuccess: () => void
}

export function TabContenido({ curso, onSuccess }: TabContenidoProps) {
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
