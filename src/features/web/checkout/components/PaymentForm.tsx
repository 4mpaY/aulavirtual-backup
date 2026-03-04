'use client'

import React, { useState } from 'react'

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

const PaymentForm = () => {
    const [tabValue, setTabValue] = useState(0)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue)
    }

    return (
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: '24px', bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                Información de <span style={{ color: 'var(--mui-palette-primary-main)' }}>Pago</span>
            </Typography>
            <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary', fontWeight: 500 }}>
                Completa tus datos para finalizar la inscripción al curso.
            </Typography>

            <Stack spacing={4}>
                {/* Personal Info */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>Datos Personales</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Nombres" placeholder="Ej. Juan" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Apellidos" placeholder="Ej. Pérez" variant="outlined" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                placeholder="juan.perez@email.com"
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
                            <Button variant="outlined" size="small" sx={{ mt: 2, borderRadius: '8px' }}>Adjuntar Comprobante</Button>
                        </Box>
                    )}
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                        py: 2,
                        borderRadius: '16px',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        boxShadow: '0 10px 25px rgba(var(--mui-palette-primary-mainChannel), 0.2)',
                        textTransform: 'none'
                    }}
                >
                    Finalizar Compra
                </Button>
            </Stack>
        </Paper>
    )
}

export default PaymentForm
