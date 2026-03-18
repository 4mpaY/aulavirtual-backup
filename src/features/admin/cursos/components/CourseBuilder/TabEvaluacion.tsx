'use client'

import { useState, useEffect } from 'react'

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Switch,
    Typography,
    FormControlLabel
} from '@mui/material'
import { useSnackbar } from 'notistack'

import CustomTextField from '@core/components/mui/TextField'
import { QuestionEditDialog } from './QuestionEditDialog'

import {
    useExamenCurso,
    useSaveExamen,
    useDeletePregunta,
    useCreatePregunta,
    useUpdatePregunta
} from '../../hooks/useCursos'

interface TabEvaluacionProps {
    cursoId: string
}

export function TabEvaluacion({ cursoId }: TabEvaluacionProps) {
    const { enqueueSnackbar } = useSnackbar()
    const { data, isLoading, refetch } = useExamenCurso(cursoId)
    const saveExamenMutation = useSaveExamen()
    const deletePreguntaMutation = useDeletePregunta()
    const createPreguntaMutation = useCreatePregunta()
    const updatePreguntaMutation = useUpdatePregunta()

    const [editingQuestion, setEditingQuestion] = useState<any>(null)
    const [isConfiguring, setIsConfiguring] = useState(false)

    // Formulario de configuración del examen
    const [configForm, setConfigForm] = useState({
        titulo: '',
        descripcion: '',
        puntaje_aprobacion: 60,
        intentos_maximos: 1,
        esta_publicado: false
    })

    useEffect(() => {
        if (data?.examen) {
            setConfigForm({
                titulo: data.examen.titulo || '',
                descripcion: data.examen.descripcion || '',
                puntaje_aprobacion: data.examen.puntaje_aprobacion || 60,
                intentos_maximos: data.examen.intentos_maximos || 1,
                esta_publicado: data.examen.esta_publicado || false
            })
        }
    }, [data])

    const handleSaveConfig = async () => {
        try {
            await saveExamenMutation.mutateAsync({ cursoId, data: configForm })
            enqueueSnackbar('Configuración del examen guardada', { variant: 'success' })
            setIsConfiguring(false)
            refetch()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al guardar configuración', { variant: 'error' })
        }
    }

    const handleDeleteQuestion = async (preguntaId: string) => {
        if (!window.confirm('¿Estás seguro de eliminar esta pregunta?')) return

        try {
            await deletePreguntaMutation.mutateAsync({ cursoId, preguntaId })
            enqueueSnackbar('Pregunta eliminada', { variant: 'success' })
            refetch()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al eliminar', { variant: 'error' })
        }
    }

    const handleSaveQuestion = async (formData: any) => {
        try {
            if (editingQuestion?.id) {
                await updatePreguntaMutation.mutateAsync({ cursoId, preguntaId: editingQuestion.id, data: formData })
                enqueueSnackbar('Pregunta actualizada', { variant: 'success' })
            } else {
                await createPreguntaMutation.mutateAsync({ cursoId, data: formData })
                enqueueSnackbar('Pregunta añadida', { variant: 'success' })
            }

            setEditingQuestion(null)
            refetch()
        } catch (error: any) {
            enqueueSnackbar(error?.message || 'Error al guardar pregunta', { variant: 'error' })
        }
    }

    if (isLoading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
            <CircularProgress />
        </Box>
    )

    const examen = data?.examen

    return (
        <Box>
            {/* Si no hay examen o si se está editando la configuración */}
            {(!examen || isConfiguring) ? (
                <Paper sx={{ p: 6, borderRadius: '24px' }}>
                    <Typography variant='h5' sx={{ mb: 4, fontWeight: 800 }}>Configuración de la Evaluación</Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <CustomTextField
                                fullWidth
                                label='Título del Examen'
                                placeholder='Ej: Examen Final de Marketing Digital'
                                value={configForm.titulo}
                                onChange={(e) => setConfigForm({ ...configForm, titulo: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <CustomTextField
                                fullWidth
                                multiline
                                rows={2}
                                label='Descripción'
                                placeholder='Instrucciones para la evaluación...'
                                value={configForm.descripcion}
                                onChange={(e) => setConfigForm({ ...configForm, descripcion: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CustomTextField
                                fullWidth
                                type='number'
                                label='Puntaje de Aprobación (%)'
                                value={configForm.puntaje_aprobacion}
                                onChange={(e) => setConfigForm({ ...configForm, puntaje_aprobacion: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <CustomTextField
                                fullWidth
                                type='number'
                                label='Intentos Máximos'
                                value={configForm.intentos_maximos}
                                onChange={(e) => setConfigForm({ ...configForm, intentos_maximos: Number(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                             <FormControlLabel
                                control={
                                    <Switch
                                        checked={configForm.esta_publicado}
                                        onChange={e => setConfigForm({ ...configForm, esta_publicado: e.target.checked })}
                                        color='success'
                                    />
                                }
                                label='Examen publicado y disponible'
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            {examen && (
                                <Button variant='outlined' onClick={() => setIsConfiguring(false)}>Cancelar</Button>
                            )}
                            <Button
                                variant='contained'
                                onClick={handleSaveConfig}
                                disabled={!configForm.titulo || saveExamenMutation.isPending}
                            >
                                {saveExamenMutation.isPending ? 'Guardando...' : 'Guardar y Continuar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            ) : (
                <Box>
                    {/* Resumen del Examen */}
                    <Card sx={{ mb: 4, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant='h5' fontWeight={800}>{examen.titulo}</Typography>
                                <Stack direction='row' spacing={2} sx={{ mt: 1 }}>
                                    <Chip size='small' label={`${examen.preguntas?.length || 0} preguntas`} />
                                    <Chip size='small' variant='tonal' color='success' label={`${examen.puntaje_aprobacion}% para aprobar`} />
                                    <Chip size='small' variant='tonal' color='primary' label={`${examen.intentos_maximos} intentos`} />
                                </Stack>
                            </Box>
                            <Button
                                variant='tonal'
                                color='primary'
                                startIcon={<i className='tabler-edit' />}
                                onClick={() => setIsConfiguring(true)}
                            >
                                Editar Configuración
                            </Button>
                        </CardContent>
                    </Card>

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Typography variant='h6' sx={{ fontWeight: 700 }}>Banco de Preguntas</Typography>
                        <Button
                            variant='contained'
                            startIcon={<i className='tabler-plus' />}
                            onClick={() => setEditingQuestion({ texto: '', tipo: 'OPCION_MULTIPLE', puntos: 1, opciones: [{ texto: '', es_correcta: false }, { texto: '', es_correcta: false }] })}
                        >
                            Añadir Pregunta
                        </Button>
                    </Box>

                    {examen.preguntas?.length === 0 ? (
                        <Paper sx={{ p: 10, textAlign: 'center', bgcolor: 'action.hover', border: '1px dashed', borderColor: 'divider' }}>
                            <i className='tabler-help text-5xl text-textDisabled' />
                            <Typography sx={{ mt: 2, color: 'text.secondary' }}>No hay preguntas en este examen. ¡Añade la primera!</Typography>
                        </Paper>
                    ) : (
                        <Stack spacing={3}>
                            {examen.preguntas.map((p: any, idx: number) => (
                                <Card key={p.id} variant='outlined' sx={{ p: 4, position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                                        <IconButton size='small' color='primary' onClick={() => setEditingQuestion(p)}>
                                            <i className='tabler-edit' />
                                        </IconButton>
                                        <IconButton size='small' color='error' onClick={() => handleDeleteQuestion(p.id)}>
                                            <i className='tabler-trash' />
                                        </IconButton>
                                    </Box>
                                    <Typography variant='subtitle1' sx={{ fontWeight: 700, mb: 2, pr: 10 }}>
                                        {idx + 1}. {p.texto}
                                        <Chip label={`${p.puntos} pto(s)`} size='small' sx={{ ml: 2, height: 20 }} />
                                    </Typography>

                                    <Grid container spacing={2}>
                                        {p.opciones.map((opt: any, optIdx: number) => (
                                            <Grid item xs={12} sm={6} key={opt.id}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: 1,
                                                        border: '1px solid',
                                                        borderColor: opt.es_correcta ? 'success.main' : 'divider',
                                                        bgcolor: opt.es_correcta ? 'success.lightOpacity' : 'transparent',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 2
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            bgcolor: opt.es_correcta ? 'success.main' : 'action.disabledBackground',
                                                            color: opt.es_correcta ? 'white' : 'text.disabled'
                                                        }}
                                                    >
                                                        {String.fromCharCode(65 + optIdx)}
                                                    </Box>
                                                    <Typography variant='body2' sx={{ color: opt.es_correcta ? 'success.main' : 'text.primary', fontWeight: opt.es_correcta ? 600 : 400 }}>
                                                        {opt.texto}
                                                    </Typography>
                                                    {opt.es_correcta && <i className='tabler-check text-success text-lg ms-auto' />}
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Box>
            )}

            <QuestionEditDialog
                key={editingQuestion?.id || 'new'}
                open={!!editingQuestion}
                onClose={() => setEditingQuestion(null)}
                questionData={editingQuestion}
                onSave={handleSaveQuestion}
                isSaving={createPreguntaMutation.isPending || updatePreguntaMutation.isPending}
            />
        </Box>
    )
}
