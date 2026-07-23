'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'

// Hook Imports
import { useSession, signOut } from 'next-auth/react'

import UserAvatar from '@/utils/components/UserAvatar'
import CurrencyToggle from '@components/layout/shared/CurrencyToggle'

import { useSettings } from '@core/hooks/useSettings'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

function getDashboardPath(rol?: string): string {
  switch (rol) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'PROFESOR':
      return '/profesor/dashboard'
    default:
      return '/estudiante/dashboard'
  }
}

function getRolLabel(rol?: string): string {
  switch (rol) {
    case 'ADMIN':
      return 'Administrador'
    case 'PROFESOR':
      return 'Profesor'
    default:
      return 'Estudiante'
  }
}

interface UserDropdownProps {
  showCurrencyToggle?: boolean
  onLoginClick?: () => void
  onRegisterClick?: () => void
  dark?: boolean
}

const UserDropdown = ({ showCurrencyToggle = false, onLoginClick, onRegisterClick, dark = false }: UserDropdownProps = {}) => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)
  const { data } = useSession()

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const dashboardPath = getDashboardPath(data?.user?.rol)
  const rolLabel = getRolLabel(data?.user?.rol)
  const hasSession = !!data?.user
  const isEstudiante = !data?.user?.rol || data.user.rol === 'ESTUDIANTE'

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <>
      {hasSession ? (
        <div
          ref={anchorRef}
          onClick={handleDropdownOpen}
          className='mis-2 flex items-center gap-2 cursor-pointer'
        >
          <div className='hidden sm:flex flex-col items-end leading-tight max-w-[140px]'>
            <Typography
              className='font-medium truncate max-is-full'
              variant='body2'
              sx={{ color: dark ? '#ffffff' : 'text.primary' }}
            >
              {data?.user?.name}
            </Typography>
            <Typography
              variant='caption'
              sx={{ color: dark ? 'var(--web-light, #BDD962)' : 'text.secondary', fontWeight: 600 }}
            >
              {rolLabel}
            </Typography>
          </div>
          <Badge
            overlap='circular'
            badgeContent={<BadgeContentSpan />}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <UserAvatar
              src={data?.user?.avatar}
              name={data?.user?.name || 'User'}
              size={38}
            />
          </Badge>
          <i
            className='tabler-chevron-down text-[18px] hidden sm:inline-block'
            style={{ color: dark ? '#ffffff' : undefined }}
          />
        </div>
      ) : (
        <div ref={anchorRef} className='mis-2'>
          <Avatar
            onClick={handleDropdownOpen}
            className='cursor-pointer'
            sx={{ width: 38, height: 38, bgcolor: 'rgba(255,255,255,0.15)', color: 'inherit' }}
          >
            <i className='tabler-user text-[20px]' />
          </Avatar>
        </div>
      )}
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  {hasSession && (
                    <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                      <UserAvatar
                        src={data?.user?.avatar}
                        name={data?.user?.name || ''}
                        size={40}
                      />
                      <div className='flex items-start flex-col'>
                        <Typography className='font-medium' color='text.primary'>
                          {`${data?.user.name}`}
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {rolLabel}
                        </Typography>
                      </div>
                    </div>
                  )}
                  {hasSession && <Divider className='mlb-1' />}

                  {showCurrencyToggle && (
                    <>
                      <div className='sm:hidden flex items-center justify-center plb-2 pli-4'>
                        <CurrencyToggle />
                      </div>
                      <Divider className='sm:hidden mlb-1' />
                    </>
                  )}

                  {hasSession ? (
                    <>
                      <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/perfil')}>
                        <i className='tabler-user text-[22px]' />
                        <Typography color='text.primary'>Mi Perfil</Typography>
                      </MenuItem>
                      {isEstudiante ? (
                        <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/estudiante/mis-cursos')}>
                          <i className='tabler-book text-[22px]' />
                          <Typography color='text.primary'>Mis Cursos</Typography>
                        </MenuItem>
                      ) : (
                        <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, dashboardPath)}>
                          <i className='tabler-layout-dashboard text-[22px]' />
                          <Typography color='text.primary'>Mi Panel</Typography>
                        </MenuItem>
                      )}
                      <Divider className='mlb-1' />
                      <MenuItem
                        className='mli-2 gap-3'
                        onClick={() => {
                          setOpen(false)
                          handleLogout()
                        }}
                      >
                        <i className='tabler-arrow-left text-[22px]' />
                        <Typography color='text.primary'>Cerrar Sesión</Typography>
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem
                        className='mli-2 gap-3'
                        onClick={() => {
                          setOpen(false)
                          onLoginClick?.()
                        }}
                      >
                        <i className='tabler-login text-[22px]' />
                        <Typography color='text.primary'>Iniciar Sesión</Typography>
                      </MenuItem>
                      <MenuItem
                        className='mli-2 gap-3'
                        onClick={() => {
                          setOpen(false)
                          onRegisterClick?.()
                        }}
                      >
                        <i className='tabler-user-plus text-[22px]' />
                        <Typography color='text.primary'>Registrarse</Typography>
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
