'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
    Box,
    Typography,
    Stack,
    TextField,
    Button,
    Grid,
    Tab,
    Tabs,
    Paper,
    InputAdornment
} from '@mui/material'
import { useSession } from 'next-auth/react'

import AuthDialog from './AuthDialog'

interface PaymentFormProps {
    course: {
        id: string
        titulo: string
        slug: string
        precio: number
    }
}

const PaymentForm: React.FC<PaymentFormProps> = ({ course }) => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [tabValue, setTabValue] = useState(0)
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        correo: ''
    })

    // Sync form with session
    useEffect(() => {
        if (session?.user) {
            const user = session.user as any

            setFormData({
                nombres: user.nombre || '',
                apellidos: user.apellido || '',
                correo: user.email || ''
            })
        }
    }, [session])

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    const handleCheckout = async () => {
        if (!session) {
            setIsAuthDialogOpen(true)

            return
        }

        try {
            setIsLoading(true)

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cursoId: course.id
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error al procesar la inscripción')
            }

            // Redirect to student dashboard
            router.push('/estudiante/mis-cursos')
        } catch (error: any) {
            console.error('Error in checkout:', error)
            alert(error.message || 'Ocurrió un error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    const isGuest = status === 'unauthenticated'

    return (
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                Información de <span style={{ color: 'var(--mui-palette-primary-main)' }}>Pago</span>
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
                {isGuest ? 'Identifícate e ingresa tus datos para finalizar la inscripción.' : 'Verifica tus datos y completa el pago.'}
            </Typography>

            <Stack spacing={4}>
                {/* Personal Info */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>Datos del Estudiante</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Nombres"
                                value={formData.nombres}
                                onChange={e => setFormData(p => ({ ...p, nombres: e.target.value }))}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Apellidos"
                                value={formData.apellidos}
                                onChange={e => setFormData(p => ({ ...p, apellidos: e.target.value }))}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                value={formData.correo}
                                onChange={e => setFormData(p => ({ ...p, correo: e.target.value }))}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="tabler-mail" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Payment Methods */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Método de Pago</Typography>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                            <Tab
                                icon={<i className="tabler-credit-card" style={{ fontSize: '1.2rem' }} />}
                                iconPosition="start"
                                label="Tarjeta"
                                sx={{ fontWeight: 700, textTransform: 'none' }}
                            />
                            <Tab
                                icon={<i className="tabler-qrcode" style={{ fontSize: '1.2rem' }} />}
                                iconPosition="start"
                                label="Yape / Plin"
                                sx={{ fontWeight: 700, textTransform: 'none' }}
                            />
                        </Tabs>
                    </Box>

                    {tabValue === 0 && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Número de Tarjeta"
                                    placeholder="0000 0000 0000 0000"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <i className="tabler-credit-card" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="Fecha de Exp." placeholder="MM/YY" />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label="CVV" placeholder="123" type="password" />
                            </Grid>
                        </Grid>
                    )}

                    {tabValue === 1 && (
                        <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'grey.50', borderRadius: '16px', border: '1px solid', borderColor: 'divider' }}>
                            <Box
                                component="img"
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AulaVirtualPayment"
                                sx={{ width: 150, height: 150, mb: 2, borderRadius: '8px' }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Escanea el código para pagar</Typography>
                            <Typography variant="caption" color="text.secondary">Sube tu constancia después de pagar</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Button variant="outlined" size="small" sx={{ borderRadius: '8px' }}>Adjuntar Comprobante</Button>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    sx={{
                        py: 2,
                        borderRadius: '16px',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        boxShadow: '0 10px 25px rgba(var(--mui-palette-primary-mainChannel), 0.2)',
                        textTransform: 'none'
                    }}
                >
                    {isLoading ? 'Procesando...' : (isGuest ? 'Identificarse para Comprar' : 'Finalizar Compra')}
                </Button>
            </Stack>

            <AuthDialog
                open={isAuthDialogOpen}
                onClose={() => setIsAuthDialogOpen(false)}
            />
        </Paper>
    )
}

export default PaymentForm
