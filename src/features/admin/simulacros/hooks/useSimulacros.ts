'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { AxiosSimulacro } from '../http/axiosSimulacro'
import type { CrearSimulacroDto, ActualizarSimulacroDto, CambiarEstadoSimulacroDto } from '../entity/Simulacro'

function useAxios() {
  const { data: session } = useSession()
  return new AxiosSimulacro({ getAuthToken: () => session?.user?.accessToken ?? null })
}

export function useSimulacros(params?: Record<string, any>) {
  const axios = useAxios()
  return useQuery({
    queryKey: ['simulacros', params],
    queryFn: () => axios.searchAll(params),
  })
}

export function useSimulacro(id: string) {
  const axios = useAxios()
  return useQuery({
    queryKey: ['simulacro', id],
    queryFn: () => axios.getById(id),
    enabled: !!id,
  })
}

export function useCreateSimulacro() {
  const axios = useAxios()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CrearSimulacroDto) => axios.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['simulacros'] }),
  })
}

export function useEditSimulacro() {
  const axios = useAxios()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ActualizarSimulacroDto }) => axios.update(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['simulacros'] })
      qc.invalidateQueries({ queryKey: ['simulacro', id] })
    },
  })
}

export function useDeleteSimulacro() {
  const axios = useAxios()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axios.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['simulacros'] }),
  })
}

export function useCambiarEstadoSimulacro() {
  const axios = useAxios()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CambiarEstadoSimulacroDto }) => axios.cambiarEstado(id, dto),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['simulacros'] })
      qc.invalidateQueries({ queryKey: ['simulacro', id] })
    },
  })
}
