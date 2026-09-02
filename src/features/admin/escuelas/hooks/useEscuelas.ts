import { getSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { AxiosEscuela } from '../http/axiosEscuela'
import type { Escuela, CreateEscuelaDto } from '../entity/Escuela'

const QUERY_KEY = { ESCUELAS: ['escuelas'] }

const axiosEscuelaFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosEscuela({ getAuthToken })
}

export function useEscuelas(initialData?: Escuela[]) {
  const axiosEscuela = axiosEscuelaFactory()

  return useQuery<Escuela[]>({
    queryKey: QUERY_KEY.ESCUELAS,
    queryFn: async () => await axiosEscuela.getAll(),
    initialData
  })
}

export function useEscuela(id: string | null) {
  return useQuery<Escuela>({
    queryKey: [...QUERY_KEY.ESCUELAS, id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/escuelas/${id}`)

      return data.result
    },
    enabled: !!id
  })
}

export function useCreateEscuela() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateEscuelaDto) => {
      const { data } = await axios.post('/api/admin/escuelas', payload)

      return data.result
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.ESCUELAS })
  })
}

export function useUpdateEscuela() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateEscuelaDto> }) => {
      const { data } = await axios.put(`/api/admin/escuelas/${id}`, payload)

      return data.result
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.ESCUELAS })
      qc.invalidateQueries({ queryKey: [...QUERY_KEY.ESCUELAS, variables.id] })
    }
  })
}

export function useDeleteEscuela() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/admin/escuelas/${id}`)

      return data.result
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.ESCUELAS })
  })
}

export function useReorderEscuelas() {
  const qc = useQueryClient()
  const axiosEscuela = axiosEscuelaFactory()

  return useMutation({
    mutationFn: async ({ items }: { items: { id: string; orden: number }[] }) => {
      return await axiosEscuela.reorder(items)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.ESCUELAS })
  })
}

