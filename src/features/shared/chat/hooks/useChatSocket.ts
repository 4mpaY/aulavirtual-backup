'use client'

import { useEffect, useRef } from 'react'

import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

let socketInstance: Socket | null = null

function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io({ path: '/socket.io', transports: ['websocket', 'polling'] })
  }

  return socketInstance
}

/** Join the personal user room and listen for conversation-list/unread updates. */
export function useChatSocket(
  userId: string | undefined,
  onConversacionActualizada?: () => void
) {
  const joinedUser = useRef(false)

  useEffect(() => {
    if (!userId) return

    const socket = getSocket()

    function onConnect() {
      if (!joinedUser.current) {
        socket.emit('join_user', userId)
        joinedUser.current = true
      }
    }

    if (socket.connected) {
      onConnect()
    }

    socket.on('connect', onConnect)

    if (onConversacionActualizada) {
      socket.on('conversacion_actualizada', onConversacionActualizada)
    }

    return () => {
      socket.off('connect', onConnect)

      if (onConversacionActualizada) {
        socket.off('conversacion_actualizada', onConversacionActualizada)
      }
    }
  }, [userId, onConversacionActualizada])
}

/** Join/leave a conversation room and listen for new messages. */
export function useConversacionSocket(
  conversacionId: string | null,
  onNuevoMensaje: () => void
) {
  const currentRoom = useRef<string | null>(null)

  useEffect(() => {
    const socket = getSocket()

    if (currentRoom.current && currentRoom.current !== conversacionId) {
      socket.emit('leave_conversation', currentRoom.current)
      socket.off('nuevo_mensaje', onNuevoMensaje)
      currentRoom.current = null
    }

    if (!conversacionId) return

    socket.emit('join_conversation', conversacionId)
    currentRoom.current = conversacionId
    socket.on('nuevo_mensaje', onNuevoMensaje)

    return () => {
      socket.off('nuevo_mensaje', onNuevoMensaje)
    }
  }, [conversacionId, onNuevoMensaje])
}
