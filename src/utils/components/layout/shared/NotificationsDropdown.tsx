'use client'

// React Imports
import { useRef, useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import HydratedDate from '@/utils/components/HydratedDate'

interface Notification {
    id: string
    titulo: string
    mensaje: string
    tipo: string
    leida: boolean
    creado_en: string
    enlace?: string
}

const NotificationsDropdown = () => {
    // States
    const [open, setOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])

    // Refs
    const anchorRef = useRef<HTMLButtonElement>(null)

    // Hooks
    const router = useRouter()
    const { settings } = useSettings()

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notificaciones')
            const data = await res.json()

            if (Array.isArray(data)) setNotifications(data)
        } catch (err) {
            console.error('Error fetching notifications:', err)
        }
    }

    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Poll every 30s

        return () => clearInterval(interval)
    }, [])

    const handleOpen = () => setOpen(prev => !prev)
    const handleClose = () => setOpen(false)

    const handleMarkAsRead = async (id?: string) => {
        try {
            await fetch('/api/notificaciones', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(id ? { id } : { todas: true })
            })
            fetchNotifications()
        } catch (err) {
            console.error(err)
        }
    }

    const unreadCount = notifications.filter(n => !n.leida).length

    return (
        <>
            <IconButton ref={anchorRef} onClick={handleOpen} className='text-textPrimary'>
                <Badge badgeContent={unreadCount} color='error'>
                    <i className='tabler-bell text-[22px]' />
                </Badge>
            </IconButton>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                placement='bottom-end'
                transition
                className='z-[1500] !mbs-3 min-is-[320px] max-is-[320px]'
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                        <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList className='p-0'>
                                    <div className='flex items-center justify-between pli-4 plb-3'>
                                        <Typography className='font-semibold'>Notificaciones</Typography>
                                        {unreadCount > 0 && <Chip label={`${unreadCount} Nuevas`} size='small' color='primary' variant='tonal' />}
                                    </div>
                                    <Divider />
                                    <div className='max-bs-[400px] overflow-y-auto'>
                                        {notifications.length === 0 ? (
                                            <div className='p-6 text-center text-textSecondary'>
                                                <i className='tabler-bell-off text-[40px] mb-2 block' />
                                                <Typography variant='body2'>No hay notificaciones</Typography>
                                            </div>
                                        ) : (
                                            notifications.map(n => (
                                                <MenuItem
                                                    key={n.id}
                                                    onClick={() => {
                                                        handleMarkAsRead(n.id)
                                                        if (n.enlace) router.push(n.enlace)
                                                        handleClose()
                                                    }}
                                                    className={`flex flex-col items-start gap-1 p-4 whitespace-normal ${!n.leida ? 'bg-actionHover' : ''}`}
                                                    sx={{ borderBottom: '1px solid var(--mui-palette-divider)' }}
                                                >
                                                    <div className='flex justify-between is-full'>
                                                        <Typography variant='subtitle2' className='font-bold' color='text.primary'>
                                                            {n.titulo}
                                                        </Typography>
                                                        <Typography variant='caption' color='text.disabled'>
                                                            <HydratedDate date={n.creado_en} format="date" />
                                                        </Typography>
                                                    </div>
                                                    <Typography variant='caption' color='text.secondary' className='line-clamp-2'>
                                                        {n.mensaje}
                                                    </Typography>
                                                </MenuItem>
                                            ))
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className='p-2'>
                                            <Button fullWidth variant='tonal' size='small' onClick={() => handleMarkAsRead()}>
                                                Marcar todas como leídas
                                            </Button>
                                        </div>
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

export default NotificationsDropdown
