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
    Tooltip,
    Switch,
    IconButton
} from '@mui/material'

import { toast } from 'react-toastify'

import CustomTextField from '@core/components/mui/TextField'

interface QuestionEditDialogProps {
    open: boolean
    onClose: () => void
    questionData: any
    onSave: (data: any) => void
    isSaving: boolean
}

export function QuestionEditDialog({ open, onClose, questionData, onSave, isSaving }: QuestionEditDialogProps) {
    const [texto, setTexto] = useState('')
    const [puntos, setPuntos] = useState(1)
    const [opciones, setOpciones] = useState<any[]>([])

    useEffect(() => {
        if (questionData) {
            setTexto(questionData.texto || '')
            setPuntos(questionData.puntos || 1)
            setOpciones(questionData.opciones?.map((o: any) => ({ ...o })) || [
                { texto: '', es_correcta: false },
                { texto: '', es_correcta: false }
            ])
        }
    }, [questionData])

    const handleAddOption = () => {
        setOpciones([...opciones, { texto: '', es_correcta: false }])
    }

    const handleRemoveOption = (idx: number) => {
        if (opciones.length <= 2) return
        setOpciones(opciones.filter((_, i) => i !== idx))
    }

    const handleOptionChange = (idx: number, field: string, value: any) => {
        const newOptions = [...opciones]
        
        if (field === 'es_correcta' && value === true) {
            // Solo una opción correcta (Opción Múltiple básica)
            newOptions.forEach((opt, i) => opt.es_correcta = i === idx)
        } else {
            newOptions[idx][field] = value
        }

        setOpciones(newOptions)
    }

    const handleSave = () => {
        if (!texto.trim()) return

        if (!opciones.some(o => o.es_correcta)) {
            toast.error('Debes marcar al menos una opción como correcta')

            return
        }

        if (opciones.some(o => !o.texto.trim())) {
            toast.error('Todas las opciones deben tener texto')

            return
        }

        onSave({
            texto,
            tipo: 'OPCION_MULTIPLE',
            puntos,
            opciones
        })
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>{questionData?.id ? 'Editar Pregunta' : 'Nueva Pregunta'}</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={4} sx={{ mt: 2 }}>
                    <CustomTextField
                        fullWidth
                        multiline
                        rows={2}
                        label='Enunciado de la pregunta'
                        value={texto}
                        onChange={e => setTexto(e.target.value)}
                        required
                    />
                    <CustomTextField
                        label='Puntos'
                        type='number'
                        value={puntos}
                        onChange={e => setPuntos(Number(e.target.value))}
                        sx={{ width: 120 }}
                    />

                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant='subtitle2' fontWeight={700}>Respuestas</Typography>
                        <Button size='small' startIcon={<i className='tabler-plus' />} onClick={handleAddOption}>Añadir Opción</Button>
                    </Box>

                    <Stack spacing={2}>
                        {opciones.map((opt, idx) => (
                            <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                <Tooltip title='Marcar como correcta'>
                                    <Switch
                                        size='small'
                                        color='success'
                                        checked={opt.es_correcta}
                                        onChange={e => handleOptionChange(idx, 'es_correcta', e.target.checked)}
                                    />
                                </Tooltip>
                                <CustomTextField
                                    fullWidth
                                    size='small'
                                    placeholder={`Opción ${idx + 1}`}
                                    value={opt.texto}
                                    onChange={e => handleOptionChange(idx, 'texto', e.target.value)}
                                    error={opt.es_correcta}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: opt.es_correcta ? 'success.lightOpacity' : 'transparent',
                                            borderColor: opt.es_correcta ? 'success.main' : 'inherit'
                                        }
                                    }}
                                />
                                <IconButton size='small' color='error' disabled={opciones.length <= 2} onClick={() => handleRemoveOption(idx)}>
                                    <i className='tabler-trash text-lg' />
                                </IconButton>
                            </Box>
                        ))}
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant='contained' onClick={handleSave} disabled={isSaving || !texto}>
                    {isSaving ? 'Guardando...' : 'Guardar Pregunta'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
