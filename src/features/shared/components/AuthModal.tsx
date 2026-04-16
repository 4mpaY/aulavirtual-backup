'use client'

import { useState, useEffect } from 'react'

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
  Divider,
  InputAdornment
} from '@mui/material'
import { signIn } from 'next-auth/react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { loginSchema, type LoginDto, registerSchema, type RegisterDto, forgotPasswordSchema, type ForgotPasswordDto } from '@/schemas/auth.schema'
import CustomTextField from '@core/components/mui/TextField'
import Logo from '@components/layout/shared/Logo'

export type Mode = 'login' | 'register' | 'forgot-password'

interface AuthModalProps {
  open: boolean
  mode: Mode
  callbackUrl?: string
  onClose: () => void
  onSwitchMode: (mode: Mode) => void
}

const AuthModal = ({ open, mode, callbackUrl, onClose, onSwitchMode }: AuthModalProps) => {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [forgotSuccess, setForgotSuccess] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const router = useRouter()

  const loginForm = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: '', contrasena: '' }
  })

  const registerForm = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      correo: '',
      numero_documento: '',
      celular: '',
      contrasena: '',
      confirmarContrasena: ''
    }
  })

  const forgotForm = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { correo: '' }
  })

  useEffect(() => {
    if (!open) {
      setError('')
      setIsLoading(false)
      setRegisterSuccess(false)
      setForgotSuccess(false)
      setIsPasswordShown(false)
      setIsConfirmPasswordShown(false)
      loginForm.reset()
      registerForm.reset()
      forgotForm.reset()
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoginSuccess = () => {
    onClose()

    if (callbackUrl) {
      window.location.href = callbackUrl
    } else {
      router.refresh()
    }
  }

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
        if (result.error === 'CredentialsSignin') {
          setError('Correo o contraseña incorrectos')
        } else if (result.error.includes('desactivada')) {
          setError('Tu cuenta ha sido desactivada. Contacta al administrador.')
        } else {
          setError('Error al iniciar sesión. Intenta nuevamente.')
        }

        return
      }

      if (result?.ok) {
        handleLoginSuccess()
      }
    } catch {
      setError('Ocurrió un error inesperado. Intenta nuevamente.')
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
        setError(result.message || 'Error al registrar usuario')

        return
      }

      setRegisterSuccess(true)

      // Auto-login tras registro exitoso
      const loginResult = await signIn('credentials', {
        redirect: false,
        correo: data.correo,
        contrasena: data.contrasena
      })

      if (loginResult?.ok) {
        handleLoginSuccess()
      } else {
        // Si falla el auto-login, llevamos al modo login con mensaje de éxito
        onSwitchMode('login')
        setRegisterSuccess(false)
        setError('')
        loginForm.setValue('correo', data.correo)
      }
    } catch {
      setError('Ocurrió un error al registrar el usuario')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true)
      const result = await signIn('google', { redirect: false })

      if (result?.url) {
        const width = 500
        const height = 600
        const left = window.screenX + (window.outerWidth - width) / 2
        const top = window.screenY + (window.outerHeight - height) / 2

        const popup = window.open(
          result.url,
          'google-auth',
          `width=${width},height=${height},left=${left},top=${top}`
        )

        const checkPopup = setInterval(() => {
          if (!popup || popup.closed) {
            clearInterval(checkPopup)
            handleLoginSuccess()
          }
        }, 1000)
      } else {
        setError('No se pudo conectar con Google.')
      }
    } catch {
      setError('Ocurrió un error al conectar con Google.')
    } finally {
      setIsLoading(false)
    }
  }

  const onForgotSubmit = async (data: ForgotPasswordDto) => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al solicitar recuperación')
      }

      setForgotSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitch = (next: Mode) => {
    setError('')
    setRegisterSuccess(false)
    setForgotSuccess(false)
    forgotForm.reset()
    onSwitchMode(next)
  }

  return (
    <Dialog
      open={open}
      onClose={() => !isLoading && onClose()}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: { xs: '16px', sm: '24px' },
          p: 2,
          overflowX: 'hidden',
          maxHeight: { xs: '92dvh', sm: '90vh' },
          mx: { xs: 2, sm: 'auto' }
        }
      }}
    >
      <Box sx={{ position: 'absolute', right: 16, top: 16, zIndex: 1 }}>
        <IconButton onClick={onClose} disabled={isLoading}>
          <i className="tabler-x" />
        </IconButton>
      </Box>

      <DialogContent sx={{ overflowX: 'hidden', overflowY: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ transform: 'scale(1.5)', transformOrigin: 'center', display: 'inline-block' }}>
              <Logo />
            </Box>
          </Box>
          <Typography variant="h5" sx={{ mt: 3, fontWeight: 800 }}>
            {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : '¿Olvidaste tu contraseña?'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mode === 'login'
              ? 'Ingresa tus datos para continuar'
              : mode === 'register'
                ? 'Completa tus datos para registrarte'
                : 'Te enviaremos un enlace para restablecer tu contraseña'}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {registerSuccess && <Alert severity="success" sx={{ mb: 2 }}>¡Registro exitoso! Iniciando sesión...</Alert>}

        {mode === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="correo"
                control={loginForm.control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Correo electrónico"
                    placeholder="correo@ejemplo.com"
                    type="email"
                    error={!!loginForm.formState.errors.correo}
                    helperText={loginForm.formState.errors.correo?.message}
                    disabled={isLoading}
                  />
                )}
              />
              <Controller
                name="contrasena"
                control={loginForm.control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Contraseña"
                    placeholder="············"
                    type={isPasswordShown ? 'text' : 'password'}
                    error={!!loginForm.formState.errors.contrasena}
                    helperText={loginForm.formState.errors.contrasena?.message}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            onClick={() => setIsPasswordShown(v => !v)}
                            onMouseDown={e => e.preventDefault()}
                            disabled={isLoading}
                          >
                            <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                  />
                )}
              />

              <Box sx={{ textAlign: 'right', mt: -1 }}>
                <Typography
                  variant="body2"
                  component="button"
                  type="button"
                  onClick={() => handleSwitch('forgot-password')}
                  sx={{ color: 'primary.main', border: 'none', bgcolor: 'transparent', cursor: 'pointer', p: 0, '&:hover': { textDecoration: 'underline' } }}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
              </Box>

              <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading} sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
              </Button>

              <Divider>o</Divider>

              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                size="large"
                startIcon={<i className="tabler-brand-google-filled" />}
                onClick={handleGoogleAuth}
                disabled={isLoading}
                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}
              >
                Continuar con Google
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" component="span">¿No tienes cuenta? </Typography>
                <Typography
                  variant="body2"
                  component="button"
                  type="button"
                  onClick={() => handleSwitch('register')}
                  sx={{ color: 'primary.main', fontWeight: 700, border: 'none', bgcolor: 'transparent', cursor: 'pointer', p: 0 }}
                >
                  Regístrate aquí
                </Typography>
              </Box>
            </Stack>
          </form>
        ) : mode === 'register' ? (
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="nombre"
                  control={registerForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="Nombre"
                      placeholder="Juan"
                      error={!!registerForm.formState.errors.nombre}
                      helperText={registerForm.formState.errors.nombre?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="apellido"
                  control={registerForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="Apellido"
                      placeholder="Pérez"
                      error={!!registerForm.formState.errors.apellido}
                      helperText={registerForm.formState.errors.apellido?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="numero_documento"
                  control={registerForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="DNI"
                      placeholder="12345678"
                      error={!!registerForm.formState.errors.numero_documento}
                      helperText={registerForm.formState.errors.numero_documento?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="celular"
                  control={registerForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="Celular (opcional)"
                      placeholder="987654321"
                      error={!!registerForm.formState.errors.celular}
                      helperText={registerForm.formState.errors.celular?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="correo"
                  control={registerForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="Correo electrónico"
                      placeholder="correo@ejemplo.com"
                      type="email"
                      error={!!registerForm.formState.errors.correo}
                      helperText={registerForm.formState.errors.correo?.message}
                      disabled={isLoading}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="contrasena"
                  control={registerForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="Contraseña"
                      placeholder="············"
                      type={isPasswordShown ? 'text' : 'password'}
                      error={!!registerForm.formState.errors.contrasena}
                      helperText={registerForm.formState.errors.contrasena?.message}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setIsPasswordShown(v => !v)}
                              onMouseDown={e => e.preventDefault()}
                              disabled={isLoading}
                            >
                              <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Controller
                  name="confirmarContrasena"
                  control={registerForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label="Confirmar Contraseña"
                      placeholder="············"
                      type={isConfirmPasswordShown ? 'text' : 'password'}
                      error={!!registerForm.formState.errors.confirmarContrasena}
                      helperText={registerForm.formState.errors.confirmarContrasena?.message}
                      disabled={isLoading}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={() => setIsConfirmPasswordShown(v => !v)}
                              onMouseDown={e => e.preventDefault()}
                              disabled={isLoading}
                            >
                              <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading || registerSuccess} sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Divider>o</Divider>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  size="large"
                  startIcon={<i className="tabler-brand-google-filled" />}
                  onClick={handleGoogleAuth}
                  disabled={isLoading || registerSuccess}
                  sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}
                >
                  Registrarse con Google
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" component="span">¿Ya tienes cuenta? </Typography>
                  <Typography
                    variant="body2"
                    component="button"
                    type="button"
                    onClick={() => handleSwitch('login')}
                    sx={{ color: 'primary.main', fontWeight: 700, border: 'none', bgcolor: 'transparent', cursor: 'pointer', p: 0 }}
                  >
                    Inicia sesión
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        ) : (

          forgotSuccess ? (
            <Stack spacing={3} sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: '3rem' }}>📧</Box>
              <Typography variant="h6" fontWeight={700}>¡Revisa tu correo!</Typography>
              <Typography variant="body2" color="text.secondary">
                Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => handleSwitch('login')}
                sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}
              >
                Volver al inicio de sesión
              </Button>
            </Stack>
          ) : (
            <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)}>
              <Stack spacing={3}>
                <Controller
                  name="correo"
                  control={forgotForm.control}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      autoFocus
                      label="Correo electrónico"
                      placeholder="correo@ejemplo.com"
                      type="email"
                      error={!!forgotForm.formState.errors.correo}
                      helperText={forgotForm.formState.errors.correo?.message}
                      disabled={isLoading}
                    />
                  )}
                />

                <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading} sx={{ py: 1.5, borderRadius: '12px', fontWeight: 700 }}>
                  {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Enviar enlace'}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="body2"
                    component="button"
                    type="button"
                    onClick={() => handleSwitch('login')}
                    sx={{ color: 'primary.main', fontWeight: 700, border: 'none', bgcolor: 'transparent', cursor: 'pointer', p: 0, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <i className="tabler-chevron-left" style={{ fontSize: '1rem' }} />
                    Volver al inicio de sesión
                  </Typography>
                </Box>
              </Stack>
            </form>
          )
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
