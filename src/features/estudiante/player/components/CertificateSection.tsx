'use client'

import { useState, useEffect } from 'react'

import axios from 'axios'
import { toast } from 'react-toastify'
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Stack,
    Chip
} from '@mui/material'

interface CertificateData {
    id: string
    codigoVerificacion: string
    emitidoEn: string
    cursoTitulo: string
    nombreCompleto: string
}

interface CertificateSectionProps {
    cursoId: string
}

const CertificateSection = ({ cursoId }: CertificateSectionProps) => {
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [certificado, setCertificado] = useState<CertificateData | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Cargar certificado existente
    useEffect(() => {
        const fetchCertificado = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`/api/estudiante/certificado?cursoId=${cursoId}`)

                if (res.data.status) {
                    setCertificado(res.data.result.certificado)
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Error al cargar el certificado')
            } finally {
                setLoading(false)
            }
        }

        fetchCertificado()
    }, [cursoId])

    const handleGenerar = async () => {
        setGenerating(true)

        try {
            const res = await axios.post('/api/estudiante/certificado', { cursoId })

            if (res.data.status) {
                setCertificado(res.data.result.certificado)
                toast.success('🎓 ¡Certificado generado exitosamente!')
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error al generar el certificado')
        } finally {
            setGenerating(false)
        }
    }

    const handleDescargar = async () => {
        if (!certificado) return

        setDownloading(true)

        try {
            const res = await axios.get(`/api/estudiante/certificado/${certificado.id}/pdf`, {
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')

            link.href = url
            link.setAttribute('download', `certificado-${certificado.codigoVerificacion}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)

            toast.success('Certificado descargado correctamente')
        } catch (err) {
            toast.error('Error al descargar el certificado')
        } finally {
            setDownloading(false)
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
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

    // Si ya tiene certificado
    if (certificado) {
        const fechaEmision = new Date(certificado.emitidoEn).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        return (
            <Card
                variant="outlined"
                sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    borderColor: 'success.main',
                    borderWidth: 2
                }}
            >
                <Box
                    sx={{
                        p: 5,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 50%, #e0f2f1 100%)'
                    }}
                >
                    <i className="tabler-certificate" style={{ fontSize: '4rem', color: 'var(--mui-palette-success-main)' }} />
                    <Typography variant="h4" sx={{ fontWeight: 900, mt: 2, color: 'success.dark' }}>
                        ¡Certificado Obtenido!
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, color: 'text.secondary' }}>
                        {certificado.cursoTitulo}
                    </Typography>
                    <Typography sx={{ mt: 2, fontWeight: 600 }}>
                        {certificado.nombreCompleto}
                    </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2} alignItems="center">
                        <Stack direction="row" spacing={2}>
                            <Chip
                                icon={<i className="tabler-calendar" />}
                                label={`Emitido: ${fechaEmision}`}
                                variant="outlined"
                            />
                            <Chip
                                icon={<i className="tabler-fingerprint" />}
                                label={certificado.codigoVerificacion}
                                variant="outlined"
                                color="primary"
                            />
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleDescargar}
                            disabled={downloading}
                            startIcon={
                                downloading 
                                    ? <CircularProgress size={20} color="inherit" /> 
                                    : <i className="tabler-download" />
                            }
                            sx={{
                                borderRadius: '12px',
                                py: 1.5,
                                px: 4,
                                fontWeight: 800,
                                fontSize: '1rem',
                                mt: 1
                            }}
                        >
                            {downloading ? 'Descargando...' : 'Descargar Certificado PDF'}
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        )
    }

    // No tiene certificado todavía, mostrar botón para generar
    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                borderColor: 'primary.main',
                borderWidth: 2,
                borderStyle: 'dashed'
            }}
        >
            <Box sx={{ p: 5, textAlign: 'center', bgcolor: 'primary.50' }}>
                <i className="tabler-certificate" style={{ fontSize: '3.5rem', color: 'var(--mui-palette-primary-main)' }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 2 }}>
                    ¡Felicidades! Has aprobado el examen
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Ahora puedes generar tu certificado de finalización
                </Typography>
            </Box>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleGenerar}
                    disabled={generating}
                    startIcon={
                        generating 
                            ? <CircularProgress size={20} color="inherit" /> 
                            : <i className="tabler-certificate" />
                    }
                    sx={{
                        borderRadius: '12px',
                        py: 1.5,
                        px: 4,
                        fontWeight: 800,
                        fontSize: '1rem'
                    }}
                >
                    {generating ? 'Generando...' : 'Obtener Mi Certificado'}
                </Button>
            </CardContent>
        </Card>
    )
}

export default CertificateSection
