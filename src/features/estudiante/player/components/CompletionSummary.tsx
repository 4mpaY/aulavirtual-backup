'use client'

import { useEffect, useState } from 'react'

import axios from 'axios'
import {
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button
} from '@mui/material'

interface CompletionSummaryProps {
    cursoId: string
}

interface InscripcionData {
    nota_final: number
    estado_nota: 'APROBADO' | 'DESAPROBADO' | null
}

interface ExamenDetalle {
    titulo: string
    peso: number
    mejor_puntaje: number
    modulo?: { titulo: string }
}

export default function CompletionSummary({ cursoId }: CompletionSummaryProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [inscripcion, setInscripcion] = useState<InscripcionData | null>(null)
    const [examenes, setExamenes] = useState<ExamenDetalle[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCompletionData = async () => {
            try {
                setIsLoading(true)

                // Obtener datos de inscripción (nota final)
                const inscRes = await axios.get(`/api/estudiante/cursos/${cursoId}`)

                if (inscRes.data.status && inscRes.data.inscripcion) {
                    setInscripcion(inscRes.data.inscripcion)
                }

                // Obtener detalles de exámenes
                const examenesRes = await axios.get(`/api/cursos/${cursoId}/examenes`)

                if (examenesRes.data.status && examenesRes.data.examenes) {
                    const publicados = examenesRes.data.examenes.filter((e: any) => e.esta_publicado)

                    setExamenes(publicados)
                }
            } catch (err: any) {
                setError(err.message || 'Error al cargar datos de finalización')
            } finally {
                setIsLoading(false)
            }
        }

        fetchCompletionData()
    }, [cursoId])

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'error.lightOpacity' }}>
                <Typography color='error'>{error}</Typography>
            </Paper>
        )
    }

    const notaFinal = inscripcion?.nota_final ?? 0
    const estadoNota = inscripcion?.estado_nota ?? 'DESAPROBADO'
    const esAprobado = estadoNota === 'APROBADO'

    return (
        <Box>
            {/* Card de resultado final */}
            <Card sx={{ mb: 4, background: esAprobado ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #f44336 0%, #e53935 100%)' }}>
                <CardContent sx={{ color: 'white', textAlign: 'center', py: 6 }}>
                    <Box sx={{ mb: 3 }}>
                        <i className={`tabler-${esAprobado ? 'circle-check' : 'circle-x'}`} style={{ fontSize: '4rem' }} />
                    </Box>

                    <Typography variant='h4' sx={{ fontWeight: 800, mb: 2 }}>
                        🎓 {esAprobado ? 'Curso Completado' : 'Curso No Completado'}
                    </Typography>

                    <Typography variant='h3' sx={{ fontWeight: 800, mb: 1 }}>
                        {notaFinal.toFixed(1)} / 100
                    </Typography>

                    <Chip
                        label={estadoNota === 'APROBADO' ? '✅ APROBADO' : '❌ DESAPROBADO'}
                        color={esAprobado ? 'success' : 'error'}
                        variant='outlined'
                        sx={{ color: 'white', borderColor: 'white', fontWeight: 700 }}
                    />

                    <Typography variant='body2' sx={{ mt: 3, opacity: 0.9 }}>
                        {esAprobado
                            ? 'Felicidades por completar este curso. Ahora puedes solicitar tu certificado.'
                            : 'Necesitas una nota mínima de 60/100 para aprobar. Intenta nuevamente.'}
                    </Typography>
                </CardContent>
            </Card>

            {/* Tabla de detalles de exámenes */}
            {examenes.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant='h6' sx={{ mb: 2, fontWeight: 700 }}>
                        Detalle de Evaluaciones
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'action.hover' }}>
                                    <TableCell>Evaluación</TableCell>
                                    <TableCell align='right'>Peso</TableCell>
                                    <TableCell align='right'>Puntaje</TableCell>
                                    <TableCell align='center'>Porcentaje</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {examenes.map((examen: any) => {
                                    const puntajePorcentaje = examen.mejor_puntaje ?? 0

                                    return (
                                        <TableRow key={examen.id}>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant='body2' fontWeight={600}>
                                                        {examen.titulo}
                                                    </Typography>
                                                    {examen.modulo && (
                                                        <Typography variant='caption' color='text.secondary'>
                                                            {examen.modulo.titulo}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell align='right'>
                                                <Chip label={`×${examen.peso}`} size='small' variant='outlined' />
                                            </TableCell>
                                            <TableCell align='right'>
                                                <Typography variant='body2' fontWeight={700}>
                                                    {puntajePorcentaje.toFixed(0)} pts
                                                </Typography>
                                            </TableCell>
                                            <TableCell align='center'>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                    <CircularProgress
                                                        variant='determinate'
                                                        value={puntajePorcentaje}
                                                        size={40}
                                                        thickness={4}
                                                        sx={{
                                                            color:
                                                                puntajePorcentaje >= 60
                                                                    ? 'success.main'
                                                                    : puntajePorcentaje >= 40
                                                                        ? 'warning.main'
                                                                        : 'error.main'
                                                        }}
                                                    />
                                                    <Typography variant='body2' fontWeight={700} sx={{ minWidth: 40 }}>
                                                        {puntajePorcentaje.toFixed(0)}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Typography variant='body2' color='text.secondary'>
                            <strong>Cómo se calcula tu nota:</strong> Cada evaluación contribuye según su peso. La nota final es el promedio ponderado
                            de todas tus evaluaciones.
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* Botón para ir al certificado */}
            {esAprobado && (
                <Button
                    fullWidth
                    variant='contained'
                    color='success'
                    size='large'
                    startIcon={<i className='tabler-certificate-2' />}
                    sx={{ py: 2, fontWeight: 700, textTransform: 'none', fontSize: '1rem' }}
                >
                    Ver Certificado
                </Button>
            )}
        </Box>
    )
}
