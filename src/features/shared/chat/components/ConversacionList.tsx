'use client'

import { useState } from 'react'

import {
  Box, Button, CircularProgress, Divider, IconButton,
  InputAdornment, List, TextField, Tooltip, Typography
} from '@mui/material'

import ConversacionItem from './ConversacionItem'
import NuevaConversacionModal from './NuevaConversacionModal'
import { useConversaciones } from '../hooks/useChat'
import type { ConversacionResumen } from '../entity/Chat'

interface Props {
  conversacionSeleccionada: string | null
  onSeleccionar: (id: string) => void
}

export default function ConversacionList({ conversacionSeleccionada, onSeleccionar }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const { data: conversaciones = [], isLoading } = useConversaciones()

  const filtradas: ConversacionResumen[] = conversaciones.filter(c => {
    if (!busqueda) return true

    const nombre = c.otroParticipante
      ? `${c.otroParticipante.nombre} ${c.otroParticipante.apellido}`.toLowerCase()
      : ''

    return nombre.includes(busqueda.toLowerCase())
  })

  return (
    <Box display='flex' flexDirection='column' height='100%' borderRight='1px solid' borderColor='divider'>
      {/* Header */}
      <Box px={2} pt={2} pb={1}>
        <Box display='flex' alignItems='center' justifyContent='space-between' mb={1.5}>
          <Typography variant='h6' fontWeight={600}>
            Mensajes
          </Typography>
          <Tooltip title='Nueva conversación'>
            <IconButton onClick={() => setModalOpen(true)} className='text-textPrimary'>
              <i className='tabler-message-plus text-[22px]' />
            </IconButton>
          </Tooltip>
        </Box>
        <TextField
          fullWidth
          size='small'
          placeholder='Buscar...'
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-search text-[16px]' />
              </InputAdornment>
            )
          }}
        />
      </Box>

      <Divider />

      {/* Lista */}
      <Box flex={1} overflow='auto'>
        {isLoading ? (
          <Box display='flex' justifyContent='center' pt={4}>
            <CircularProgress size={24} />
          </Box>
        ) : filtradas.length === 0 ? (
          <Box display='flex' flexDirection='column' alignItems='center' pt={6} gap={2} px={2}>
            <i className={`${busqueda ? 'tabler-search-off' : 'tabler-message-plus'} text-[40px] text-textDisabled`} />
            <Typography variant='body2' color='text.disabled' textAlign='center'>
              {busqueda ? 'Sin resultados' : 'Aún no tienes conversaciones'}
            </Typography>
            {!busqueda && (
              <Button
                variant='contained'
                size='small'
                startIcon={<i className='tabler-message-plus text-[16px]' />}
                onClick={() => setModalOpen(true)}
                fullWidth
              >
                Nueva conversación
              </Button>
            )}
          </Box>
        ) : (
          <List disablePadding>
            {filtradas.map(c => (
              <ConversacionItem
                key={c.id}
                conversacion={c}
                seleccionada={c.id === conversacionSeleccionada}
                onClick={() => onSeleccionar(c.id)}
              />
            ))}
          </List>
        )}
      </Box>

      <NuevaConversacionModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        onConversacionIniciada={id => { onSeleccionar(id); setModalOpen(false) }}
      />
    </Box>
  )
}
