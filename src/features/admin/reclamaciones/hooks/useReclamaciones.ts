'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosReclamacion } from '../http/axiosReclamacion'
import type { Reclamacion } from '../entity/Reclamacion'
import type { UpdateReclamacionDto } from '@/schemas/reclamacion.schema'

const QUERY_KEY = {
  RECLAMACIONES: ['reclamaciones']
}

const axiosReclamacionFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosReclamacion({ getAuthToken })
}

export function useReclamaciones(query?: Record<string, string>, initialData?: Reclamacion[]) {
  const axiosReclamacion = axiosReclamacionFactory()

  const isDefaultQuery =
    !query?.buscar && (!query?.estado || query?.estado === 'TODOS') && (!query?.page || query?.page === '1')

  return useQuery<{ reclamaciones: Reclamacion[]; paginacion: any }, any>({
    queryKey: [...QUERY_KEY.RECLAMACIONES, query],
    queryFn: async () => await axiosReclamacion.getAll(query),
    initialData: isDefaultQuery && initialData ? { reclamaciones: initialData, paginacion: {} } : undefined,
    staleTime: 60_000,
    retry: 1
  })
}

export function useUpdateReclamacion() {
  const qc = useQueryClient()
  const axiosReclamacion = axiosReclamacionFactory()

  return useMutation<{ message: string; data: Reclamacion }, any, { id: string; data: UpdateReclamacionDto }>({
    mutationFn: async ({ id, data }) => await axiosReclamacion.updateReclamacion(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.RECLAMACIONES })
    }
  })
}
