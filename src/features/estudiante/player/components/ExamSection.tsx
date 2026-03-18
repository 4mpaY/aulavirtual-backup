'use client'

import React, { useState, useEffect, useCallback } from 'react'

import axios from 'axios'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    CircularProgress,
    Alert,
    Chip,
    Stack,
    LinearProgress,
    Divider
} from '@mui/material'

interface Opcion {
    id: string
    texto: string
    orden: number
}

interface Pregunta {
    id: string
    texto: string
    tipo: string
    puntos: number
    opciones: Opcion[]
}

interface ExamenData {
    id: string
    titulo: string
    descripcion?: string
    limite_tiempo?: number
    puntaje_aprobacion: number
    mezclar_preguntas: boolean
    preguntas: Pregunta[]
}

interface ExamSectionProps {
    examenId: string
    onExamPassed: () => void
}

const ExamSection: React.FC<ExamSectionProps> = ({ examenId, onExamPassed }) => {
    const [submitting, setSubmitting] = useState(false)
    const [respuestas, setRespuestas] = useState<Record<string, string>>({})
    const [resultado, setResultado] = useState<any>(null)
    const [yaAprobado, setYaAprobado] = useState(false)
    const [intentosRestantes, setIntentosRestantes] = useState(0)
    const [tiempoRestante, setTiempoRestante] = useState<number | null>(null)
    const [examenIniciado, setExamenIniciado] = useState(false)

    // Cargar examen con React Query
    const { data: queryData, isLoading: loading, error: queryError } = useQuery<{
        examen: ExamenData
        yaAprobado: boolean
        intentosRestantes: number
    }>({
        queryKey: ['examen', 'estudiante', examenId],
        queryFn: async () => {
            const res = await axios.get(`/api/estudiante/examen/${examenId}`)

            if (!res.data.status) throw new Error('Error al cargar el examen')

            return res.data.result
        },
        enabled: !!examenId,
        staleTime: 60_000
    })

    const examen = queryData?.examen ?? null
    const error = queryError ? (queryError as any).response?.data?.message || (queryError as Error).message : null

    // Sincronizar estado local desde query data
    useEffect(() => {
        if (queryData) {
            setYaAprobado(queryData.yaAprobado)
            setIntentosRestantes(queryData.intentosRestantes)
        }
    }, [queryData])

    // Temporizador
    useEffect(() => {
        if (!examenIniciado || tiempoRestante === null || tiempoRestante <= 0) return

        const timer = setInterval(() => {
            setTiempoRestante(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer)
                    handleSubmit()

                    return 0
                }

                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [examenIniciado, tiempoRestante])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleStartExam = () => {
        setExamenIniciado(true)
        setResultado(null)
        setRespuestas({})

        if (examen?.limite_tiempo) {
            setTiempoRestante(examen.limite_tiempo * 60)
        }
    }

    const handleRespuesta = (preguntaId: string, opcionId: string) => {
        setRespuestas(prev => ({ ...prev, [preguntaId]: opcionId }))
    }

    const handleSubmit = useCallback(async () => {
        if (!examen) return

        const respuestasArray = Object.entries(respuestas).map(([preguntaId, opcionId]) => ({
            preguntaId,
            opcionId
        }))

        if (respuestasArray.length < examen.preguntas.length) {
            toast.warning('Por favor, responde todas las preguntas antes de enviar')

            return
        }

        setSubmitting(true)

        try {
            const res = await axios.post(`/api/estudiante/examen/${examenId}/enviar`, {
                respuestas: respuestasArray
            })

            if (res.data.status) {
                setResultado(res.data.result)
                setExamenIniciado(false)
                setIntentosRestantes(res.data.result.intentosRestantes)

                if (res.data.result.aprobado) {
                    setYaAprobado(true)
                    toast.success('🎉 ¡Felicidades! Has aprobado el examen')
                    onExamPassed()
                } else {
                    toast.error('No has alcanzado el puntaje mínimo. ¡Inténtalo de nuevo!')
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error al enviar el examen')
        } finally {
            setSubmitting(false)
        }
    }, [examen, respuestas, examenId, onExamPassed])

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {error}
            </Alert>
        )
    }

    if (!examen) {
        return (
            <Alert severity="info" sx={{ borderRadius: '12px' }}>
                No hay examen disponible para este curso
            </Alert>
        )
    }

    // Ya aprobó y no hay resultado reciente
    if (yaAprobado && !resultado) {
        return (
            <Card variant="outlined" sx={{ borderRadius: '16px', borderColor: 'success.main', bgcolor: 'success.50' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <i className="tabler-circle-check-filled" style={{ fontSize: '3rem', color: 'var(--mui-palette-success-main)' }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 2, color: 'success.main' }}>
                        ¡Examen aprobado!
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        Ya has superado este examen. Ahora puedes obtener tu certificado.
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    // Mostrar resultado
    if (resultado) {
        return (
            <Card variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Box sx={{ 
                    p: 4, 
                    bgcolor: resultado.aprobado ? 'success.50' : 'error.50',
                    textAlign: 'center'
                }}>
                    <i 
                        className={resultado.aprobado ? 'tabler-trophy' : 'tabler-mood-sad'} 
                        style={{ 
                            fontSize: '3rem', 
                            color: resultado.aprobado ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)' 
                        }} 
                    />
                    <Typography variant="h4" sx={{ fontWeight: 900, mt: 2 }}>
                        {resultado.aprobado ? '¡Felicidades!' : 'No aprobado'}
                    </Typography>
                    <Typography variant="h2" sx={{ 
                        fontWeight: 900, 
                        color: resultado.aprobado ? 'success.main' : 'error.main',
                        mt: 1
                    }}>
                        {resultado.puntaje}%
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {resultado.respuestasCorrectas} de {resultado.totalPreguntas} respuestas correctas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Puntaje mínimo: {resultado.puntajeAprobacion}%
                    </Typography>
                </Box>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    {resultado.aprobado ? (
                        <Typography color="success.main" fontWeight={600}>
                            Ya puedes obtener tu certificado 🎓
                        </Typography>
                    ) : (
                        <>
                            {resultado.intentosRestantes > 0 ? (
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleStartExam}
                                    sx={{ borderRadius: '10px', mt: 1 }}
                                >
                                    Reintentar ({resultado.intentosRestantes} intentos restantes)
                                </Button>
                            ) : (
                                <Alert severity="warning" sx={{ borderRadius: '10px' }}>
                                    Has agotado todos tus intentos
                                </Alert>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        )
    }

    // Pantalla de inicio del examen
    if (!examenIniciado) {
        return (
            <Card variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                <Box sx={{ p: 4, bgcolor: 'primary.50', textAlign: 'center' }}>
                    <i className="tabler-clipboard-text" style={{ fontSize: '3rem', color: 'var(--mui-palette-primary-main)' }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 2 }}>
                        {examen.titulo}
                    </Typography>
                    {examen.descripcion && (
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            {examen.descripcion}
                        </Typography>
                    )}
                </Box>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Chip 
                                icon={<i className="tabler-list-numbers" />} 
                                label={`${examen.preguntas.length} preguntas`}
                                variant="outlined"
                            />
                            {examen.limite_tiempo && (
                                <Chip 
                                    icon={<i className="tabler-clock" />} 
                                    label={`${examen.limite_tiempo} minutos`}
                                    variant="outlined"
                                />
                            )}
                            <Chip 
                                icon={<i className="tabler-target" />} 
                                label={`Aprobación: ${examen.puntaje_aprobacion}%`}
                                variant="outlined"
                                color="primary"
                            />
                        </Stack>

                        {intentosRestantes <= 0 ? (
                            <Alert severity="warning" sx={{ borderRadius: '10px' }}>
                                Has agotado todos tus intentos para este examen
                            </Alert>
                        ) : (
                            <>
                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                    Tienes {intentosRestantes} intento{intentosRestantes !== 1 ? 's' : ''} restante{intentosRestantes !== 1 ? 's' : ''}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleStartExam}
                                    sx={{ borderRadius: '10px', py: 1.5, fontWeight: 700 }}
                                    fullWidth
                                >
                                    Comenzar Examen
                                </Button>
                            </>
                        )}
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    // Examen en progreso
    const preguntasRespondidas = Object.keys(respuestas).length
    const progreso = (preguntasRespondidas / examen.preguntas.length) * 100

    return (
        <Box>
            {/* Barra superior fija */}
            <Card variant="outlined" sx={{ borderRadius: '12px', mb: 3, position: 'sticky', top: 0, zIndex: 5 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={800}>{examen.titulo}</Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Chip 
                                label={`${preguntasRespondidas}/${examen.preguntas.length}`} 
                                color="primary" 
                                size="small"
                            />
                            {tiempoRestante !== null && (
                                <Chip 
                                    icon={<i className="tabler-clock" />}
                                    label={formatTime(tiempoRestante)}
                                    color={tiempoRestante < 60 ? 'error' : 'default'}
                                    size="small"
                                />
                            )}
                        </Stack>
                    </Stack>
                    <LinearProgress 
                        variant="determinate" 
                        value={progreso} 
                        sx={{ mt: 1, height: 6, borderRadius: 3 }} 
                    />
                </CardContent>
            </Card>

            {/* Preguntas */}
            <Stack spacing={3}>
                {examen.preguntas.map((pregunta, index) => (
                    <Card key={pregunta.id} variant="outlined" sx={{ borderRadius: '12px' }}>
                        <CardContent sx={{ p: 3 }}>
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel 
                                    component="legend" 
                                    sx={{ fontWeight: 700, color: 'text.primary', mb: 2, fontSize: '1rem' }}
                                >
                                    <Chip 
                                        label={index + 1} 
                                        size="small" 
                                        color="primary" 
                                        sx={{ mr: 1, fontWeight: 800 }} 
                                    />
                                    {pregunta.texto}
                                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        ({pregunta.puntos} {pregunta.puntos === 1 ? 'punto' : 'puntos'})
                                    </Typography>
                                </FormLabel>
                                <RadioGroup
                                    value={respuestas[pregunta.id] || ''}
                                    onChange={(e) => handleRespuesta(pregunta.id, e.target.value)}
                                >
                                    {pregunta.opciones.map((opcion) => (
                                        <FormControlLabel
                                            key={opcion.id}
                                            value={opcion.id}
                                            control={<Radio />}
                                            label={opcion.texto}
                                            sx={{
                                                py: 0.5,
                                                px: 2,
                                                mx: 0,
                                                borderRadius: '8px',
                                                mb: 0.5,
                                                bgcolor: respuestas[pregunta.id] === opcion.id ? 'primary.50' : 'transparent',
                                                transition: 'background 0.2s',
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }}
                                        />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Divider sx={{ my: 4 }} />

            {/* Botón de envío */}
            <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSubmit}
                disabled={submitting || preguntasRespondidas < examen.preguntas.length}
                sx={{ borderRadius: '12px', py: 1.5, fontWeight: 800, fontSize: '1.1rem' }}
            >
                {submitting ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    `Enviar Examen (${preguntasRespondidas}/${examen.preguntas.length})`
                )}
            </Button>
        </Box>
    )
}

export default ExamSection
