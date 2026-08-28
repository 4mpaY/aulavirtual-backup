'use client'

// Next Imports
import Link from 'next/link'

// MUI Imports
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Styled Components
const MaskImg = styled('img')({
  blockSize: 'auto',
  maxBlockSize: 355,
  inlineSize: '100%',
  position: 'absolute',
  insetBlockEnd: 0,
  zIndex: -1
})

const Unauthorized = ({ mode }: { mode: SystemMode }) => {
  // Vars
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'

  // Hooks
  const theme = useTheme()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
          <Typography className='font-medium text-8xl' color='text.primary'>
            401
          </Typography>
          <Typography variant='h4'>Acceso No Autorizado 🔒</Typography>
          <Typography color='text.secondary'>
            No tienes los permisos necesarios para acceder a esta sección del sistema.
          </Typography>
        </div>
        <Stack direction='row' spacing={2} sx={{ mt: 1 }}>
          <Button href='/' component={Link} variant='contained'>
            Ir al Inicio
          </Button>
          <Button href='/login' component={Link} variant='outlined'>
            Iniciar Sesión
          </Button>
        </Stack>
        <img
          alt='unauthorized-illustration'
          src='/images/illustrations/characters/2.png'
          className='object-cover bs-[350px] md:bs-[400px] lg:bs-[450px] mbs-8 md:mbs-12'
        />
      </div>
      {!hidden && (
        <MaskImg
          alt='mask'
          src={miscBackground}
          className={classnames({ 'scale-x-[-1]': theme.direction === 'rtl' })}
        />
      )}
    </div>
  )
}

export default Unauthorized
