'use client'

import { useCallback, useEffect, useState } from 'react'

import { Badge, Box, Drawer, Fab, Tooltip } from '@mui/material'

import { useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

import ConversacionList from './ConversacionList'
import MensajePanel from './MensajePanel'
import { useUnreadCount, useConversaciones } from '../hooks/useChat'
import { useChatSocket } from '../hooks/useChatSocket'

export default function ChatWidget() {
  const { data: session } = useSession()
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [conversacionId, setConversacionId] = useState<string | null>(null)

  const { data: unread } = useUnreadCount()
  const { data: conversaciones = [] } = useConversaciones()

  const handleConversacionActualizada = useCallback(() => {
    qc.invalidateQueries({ queryKey: ['chat', 'conversaciones'] })
    qc.invalidateQueries({ queryKey: ['chat', 'unread'] })
  }, [qc])

  useChatSocket(session?.user?.id, handleConversacionActualizada)

  // Escucha el evento del botón del navbar para abrir el chat
  useEffect(() => {
    function handleOpen() { setOpen(true) }

    window.addEventListener('chat:open', handleOpen)

    return () => window.removeEventListener('chat:open', handleOpen)
  }, [])

  if (!session?.user) return null

  const conversacionActual = conversaciones.find(c => c.id === conversacionId) ?? null

  function handleSeleccionar(id: string) {
    setConversacionId(id)
  }

  function handleCerrarPanel() {
    setConversacionId(null)
  }

  return (
    <>
      <Tooltip title='Mensajes' placement='left'>
        <Fab
          color='primary'
          size='medium'
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: theme => theme.zIndex.speedDial,
            display: open ? 'none' : 'flex'
          }}
        >
          <Badge badgeContent={unread?.total ?? 0} color='error' max={99} showZero={false}
            sx={{ '& .MuiBadge-badge': { top: -4, right: -4 } }}
          >
            <i className='tabler-message-circle text-[22px]' />
          </Badge>
        </Fab>
      </Tooltip>

      <Drawer
        anchor='right'
        open={open}
        onClose={() => { setOpen(false); setConversacionId(null) }}
        PaperProps={{
          sx: { width: { xs: '100vw', md: 700 }, display: 'flex', flexDirection: 'row', overflow: 'hidden' }
        }}
      >
        {/* Panel izquierdo: lista de conversaciones */}
        <Box width={{ xs: conversacionId ? 0 : '100%', md: 260 }} flexShrink={0} overflow='hidden' display='flex' flexDirection='column'>
          <ConversacionList
            conversacionSeleccionada={conversacionId}
            onSeleccionar={handleSeleccionar}
          />
        </Box>

        {/* Panel derecho: mensajes */}
        <Box flex={1} display={{ xs: conversacionId ? 'flex' : 'none', md: 'flex' }} flexDirection='column'>
          {conversacionActual ? (
            <MensajePanel
              conversacion={conversacionActual}
              onCerrar={handleCerrarPanel}
            />
          ) : (
            <Box
              flex={1}
              display={{ xs: 'none', md: 'flex' }}
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              gap={2}
              color='text.disabled'
            >
              <i className='tabler-message-circle text-[56px]' />
              <Box textAlign='center'>
                Selecciona una conversación<br />o inicia una nueva
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  )
}
