'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import classnames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// Type Imports
import type { SystemMode } from '@core/types'
import { resetPasswordSchema, type ResetPasswordDto } from '@/schemas/auth.schema'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import Link from '@components/Link'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

// Styled Custom Components
const ResetPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  blockSize: 'auto',
  maxBlockSize: 650,
  maxInlineSize: '100%',
  margin: theme.spacing(12),
  [theme.breakpoints.down(1536)]: {
    maxBlockSize: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxBlockSize: 450
  }
}))

const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const ResetPassword = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Vars
  const searchParams = useSearchParams()
  const router = useRouter()
  const correoParam = searchParams.get('correo') || ''

  const darkImg = '/images/pages/auth-mask-dark.png'
  const lightImg = '/images/pages/auth-mask-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-reset-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-reset-password-light.png'

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const characterIllustration = useImageVariant(mode, lightIllustration, darkIllustration)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      correo: correoParam,
      codigo: '',
      nuevaContrasena: '',
      confirmarNuevaContrasena: ''
    }
  })

  useEffect(() => {
    if (correoParam) {
      setValue('correo', correoParam)
    }
  }, [correoParam, setValue])

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  const onSubmit = async (data: ResetPasswordDto) => {
    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: data.correo,
          codigo: data.codigo,
          nuevaContrasena: data.nuevaContrasena
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al restablecer la contraseña')
      }

      setSuccess('¡Contraseña restablecida con éxito! Serás redirigido al inicio de sesión.')

      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex justify-center min-bs-[100dvh]'>
      <div
        className={classnames(
          'flex items-center justify-center flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <ResetPasswordIllustration src={characterIllustration} alt='character-illustration' />
        {!hidden && (
          <MaskImg
            alt='mask'
            src={authBackground}
            className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
          />
        )}
      </div>
      <div className='flex justify-center items-center bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <div className='absolute block-start-5 sm:block-start-[33px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </div>
        <div className='flex flex-col gap-6 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div className='flex flex-col gap-1'>
            <Typography variant='h4'>Restablecer Contraseña 🛠️</Typography>
            <Typography>Ingresa el código enviado a tu correo y tu nueva contraseña.</Typography>
          </div>

          {error && (
            <Alert severity='error' className='mb-4'>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity='success' className='mb-4'>
              {success}
            </Alert>
          )}

          <form
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-5'
          >
            <Controller
              name='correo'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Correo electrónico'
                  disabled
                  error={!!errors.correo}
                  helperText={errors.correo?.message}
                />
              )}
            />

            <Controller
              name='codigo'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  autoFocus
                  fullWidth
                  label='Código de Verificación (OTP)'
                  placeholder='123456'
                  error={!!errors.codigo}
                  helperText={errors.codigo?.message}
                  disabled={isLoading || !!success}
                />
              )}
            />

            <Controller
              name='nuevaContrasena'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Nueva Contraseña'
                  placeholder='············'
                  type={isPasswordShown ? 'text' : 'password'}
                  error={!!errors.nuevaContrasena}
                  helperText={errors.nuevaContrasena?.message}
                  disabled={isLoading || !!success}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />

            <Controller
              name='confirmarNuevaContrasena'
              control={control}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Confirmar Nueva Contraseña'
                  placeholder='············'
                  type={isConfirmPasswordShown ? 'text' : 'password'}
                  error={!!errors.confirmarNuevaContrasena}
                  helperText={errors.confirmarNuevaContrasena?.message}
                  disabled={isLoading || !!success}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />

            <Button fullWidth variant='contained' type='submit' disabled={isLoading || !!success}>
              {isLoading ? <CircularProgress size={24} /> : 'Restablecer Contraseña'}
            </Button>

            <Typography className='flex justify-center items-center' color='primary'>
              <Link href='/login' className='flex items-center gap-1.5'>
                <i className='tabler-chevron-left text-xl' />
                <span>Volver al inicio de sesión</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
