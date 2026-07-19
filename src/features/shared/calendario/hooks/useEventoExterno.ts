'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import type { EventoExterno } from '../entity/EventoExterno'
import type { CrearEventoExternoDto, ActualizarEventoExternoDto } from '@/schemas/eventoExterno.schema'
import { AxiosEventoExterno } from '../http/axiosEventoExterno'

const axiosEventoExternoFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosEventoExterno({ getAuthToken })
}

/**
 * Hook para crear un evento externo
 */
export function useCreateEventoExterno() {
  const qc = useQueryClient()
  const axiosEventoExterno = axiosEventoExternoFactory()

  return useMutation<{ evento: EventoExterno }, any, CrearEventoExternoDto>({
    mutationFn: async (payload: CrearEventoExternoDto) => await axiosEventoExterno.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendario'] })
  })
}

/**
 * Hook para editar un evento externo
 */
export function useEditEventoExterno() {
  const qc = useQueryClient()
  const axiosEventoExterno = axiosEventoExternoFactory()

  return useMutation<{ evento: EventoExterno }, any, { id: string; data: ActualizarEventoExternoDto }>({
    mutationFn: async ({ id, data }) => await axiosEventoExterno.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendario'] })
  })
}

/**
 * Hook para eliminar un evento externo
 */
export function useDeleteEventoExterno() {
  const qc = useQueryClient()
  const axiosEventoExterno = axiosEventoExternoFactory()

  return useMutation<{ message: string }, any, string>({
    mutationFn: async (id: string) => await axiosEventoExterno.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendario'] })
  })
}
