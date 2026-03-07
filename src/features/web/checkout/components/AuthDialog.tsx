'use client'

import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    IconButton,
    Button,
    Alert,
    CircularProgress,
    Stack,
    Grid,
    Divider
} from '@mui/material'
import { signIn } from 'next-auth/react'
import { useForm, Controller } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, type LoginDto, registerSchema, type RegisterDto } from '@/schemas/auth.schema'
import CustomTextField from '@core/components/mui/TextField'
import Logo from '@components/layout/shared/Logo'

interface AuthDialogProps {
    open: boolean
    onClose: () => void
    initialMode?: 'login' | 'register'
}

const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode)
    const [error, setError] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Form logic for Login
    const {
        control: loginControl,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors },
        reset: resetLogin
    } = useForm<LoginDto>({
        resolver: zodResolver(loginSchema),
        defaultValues: { correo: '', contrasena: '' }
    })

    // Form logic for Register
    const {
        control: registerControl,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
        reset: resetRegister
    } = useForm<RegisterDto>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            correo: '',
            contrasena: '',
            confirmarContrasena: '',
            nombre: '',
            apellido: '',
            numero_documento: '',
            celular: ''
        }
    })


    const onLoginSubmit = async (data: LoginDto) => {
        try {
            setIsLoading(true)
            setError('')

            const result = await signIn('credentials', {
                redirect: false,
                correo: data.correo,
                contrasena: data.contrasena
            })

            if (result?.error) {
                setError('Correo o contraseña incorrectos')
            } else if (result?.ok) {
                onClose()
                router.refresh()
            }
        } catch (err) {
            setError('Error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    const onRegisterSubmit = async (data: RegisterDto) => {
        try {
            setIsLoading(true)
            setError('')

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.message || 'Error al registrar')

                return
            }

            // After success register, try to login automatically
            const loginResult = await signIn('credentials', {
                redirect: false,
                correo: data.correo,
                contrasena: data.contrasena
            })

            if (loginResult?.ok) {
                onClose()
                router.refresh()
            } else {
                setMode('login')
                setError('Registro exitoso. Por favor inicia sesión.')
            }
        } catch (err) {
            setError('Error inesperado')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!open) {
            setError('')
            setIsLoading(false)
            resetLogin()
            resetRegister()
        }
    }, [open, resetLogin, resetRegister])

    return (
        <Dialog open={open} onClose={() => !isLoading && onClose()} maxWidth="sm" fullWidth scroll="body" PaperProps={{ sx: { borderRadius: '24px', p: 2 } }}>
            <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
                <IconButton onClick={onClose} disabled={isLoading}>
                    <i className="tabler-x" />
                </IconButton>
            </Box>

            <DialogContent>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Logo />
                    <Typography variant="h5" sx={{ mt: 3, fontWeight: 800 }}>
                        {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {mode === 'login' ? 'Identifícate para continuar con tu compra' : 'Regístrate para guardar tu progreso'}
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

                {mode === 'login' ? (
                    <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
                        <Stack spacing={4}>
                            <Controller
                                name="correo"
                                control={loginControl}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Correo electrónico"
                                        placeholder="juan.perez@email.com"
                                        error={!!loginErrors.correo}
                                        helperText={loginErrors.correo?.message}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                            <Controller
                                name="contrasena"
                                control={loginControl}
                                render={({ field }) => (
                                    <CustomTextField
                                        {...field}
                                        fullWidth
                                        label="Contraseña"
                                        type="password"
                                        placeholder="········"
                                        error={!!loginErrors.contrasena}
                                        helperText={loginErrors.contrasena?.message}
                                        disabled={isLoading}
                                    />
                                )}
                            />
                            <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading} sx={{ py: 1.5, borderRadius: '12px' }}>
                                {isLoading ? <CircularProgress size={24} /> : 'Entrar'}
                            </Button>
                        </Stack>
                    </form>
                ) : (
                    <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="nombre"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <CustomTextField {...field} fullWidth label="Nombre" error={!!registerErrors.nombre} helperText={registerErrors.nombre?.message} disabled={isLoading} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="apellido"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <CustomTextField {...field} fullWidth label="Apellido" error={!!registerErrors.apellido} helperText={registerErrors.apellido?.message} disabled={isLoading} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="correo"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <CustomTextField {...field} fullWidth label="Correo" error={!!registerErrors.correo} helperText={registerErrors.correo?.message} disabled={isLoading} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="numero_documento"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <CustomTextField {...field} fullWidth label="DNI" error={!!registerErrors.numero_documento} helperText={registerErrors.numero_documento?.message} disabled={isLoading} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="celular"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <CustomTextField {...field} fullWidth label="Celular" error={!!registerErrors.celular} helperText={registerErrors.celular?.message} disabled={isLoading} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="contrasena"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <CustomTextField {...field} fullWidth label="Contraseña" type="password" error={!!registerErrors.contrasena} helperText={registerErrors.contrasena?.message} disabled={isLoading} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="confirmarContrasena"
                                    control={registerControl}
                                    render={({ field }) => (
                                        <CustomTextField {...field} fullWidth label="Confirmar" type="password" error={!!registerErrors.confirmarContrasena} helperText={registerErrors.confirmarContrasena?.message} disabled={isLoading} />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading} sx={{ py: 1.5, borderRadius: '12px' }}>
                                    {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}

                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2">
                        {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes cuenta?'}
                        <Button color="primary" sx={{ fontWeight: 700, textTransform: 'none' }} onClick={() => setMode(mode === 'login' ? 'register' : 'login')} disabled={isLoading}>
                            {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                        </Button>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default AuthDialog
