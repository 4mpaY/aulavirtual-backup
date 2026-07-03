'use client'

import { Badge, IconButton, Tooltip } from '@mui/material'

import { useSession } from 'next-auth/react'

import { useUnreadCount } from '@/features/shared/chat/hooks/useChat'

export default function ChatNavbarButton() {
  const { data: session } = useSession()
  const { data: unread } = useUnreadCount()

  const count = unread?.total ?? 0

  if (!session?.user) return null

  function handleClick() {
    window.dispatchEvent(new CustomEvent('chat:open'))
  }

  return (
    <Tooltip title={count > 0 ? `${count} mensaje(s) sin leer` : 'Mensajes'}>
      <IconButton onClick={handleClick} className='text-textPrimary'>
        <Badge badgeContent={count} color='error' showZero={false}>
          <i className='tabler-message-circle text-[22px]' />
        </Badge>
      </IconButton>
    </Tooltip>
  )
}
