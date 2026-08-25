'use client'

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getSession } from 'next-auth/react'

import { AxiosChat } from '../http/axiosChat'

type ContactosParams = {
  curso_id?: string
  buscar?: string
  page?: number
  limit?: number
}

const KEYS = {
  UNREAD: ['chat', 'unread'],
  CURSOS: ['chat', 'cursos'],
  CONTACTOS: (params: ContactosParams) => ['chat', 'contactos', params],
  CONVERSACIONES: ['chat', 'conversaciones'],
  MENSAJES: (id: string) => ['chat', 'mensajes', id]
}

function buildClient() {
  return new AxiosChat({
    getAuthToken: async () => {
      const s = await getSession()

      return s?.user?.accessToken ?? null
    }
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: KEYS.UNREAD,
    queryFn: () => buildClient().getUnreadCount(),
    refetchInterval: 30_000,
    staleTime: 0
  })
}

export function useCursosChat(enabled = false) {
  return useQuery({
    queryKey: KEYS.CURSOS,
    queryFn: () => buildClient().getCursos(),
    enabled,
    staleTime: 5 * 60_000
  })
}

export function useContactos(params: ContactosParams = {}, enabled = false) {
  return useQuery({
    queryKey: KEYS.CONTACTOS(params),
    queryFn: () => buildClient().getContactos(params),
    enabled,
    staleTime: 0,
    placeholderData: keepPreviousData
  })
}

export function useConversaciones() {
  return useQuery({
    queryKey: KEYS.CONVERSACIONES,
    queryFn: () => buildClient().getConversaciones(),
    refetchInterval: 30_000,
    staleTime: 0
  })
}

export function useMensajes(conversacionId: string | null) {
  return useQuery({
    queryKey: KEYS.MENSAJES(conversacionId ?? ''),
    queryFn: () => buildClient().getMensajes(conversacionId!),
    enabled: !!conversacionId,
    staleTime: 0
  })
}

export function useIniciarConversacion() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (receptor_id: string) => buildClient().iniciarConversacion(receptor_id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.CONVERSACIONES })
  })
}

export function useEnviarMensaje() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      conversacionId,
      contenido,
      adjunto_id
    }: {
      conversacionId: string
      contenido: string
      adjunto_id?: string
    }) => buildClient().enviarMensaje(conversacionId, contenido, adjunto_id),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.MENSAJES(vars.conversacionId) })
      qc.invalidateQueries({ queryKey: KEYS.CONVERSACIONES })
      qc.invalidateQueries({ queryKey: KEYS.UNREAD })
    }
  })
}

export function useMarcarLeidos() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (conversacionId: string) => buildClient().marcarLeidos(conversacionId),
    onSuccess: (_, conversacionId) => {
      qc.invalidateQueries({ queryKey: KEYS.MENSAJES(conversacionId) })
      qc.invalidateQueries({ queryKey: KEYS.CONVERSACIONES })
      qc.invalidateQueries({ queryKey: KEYS.UNREAD })
    }
  })
}
