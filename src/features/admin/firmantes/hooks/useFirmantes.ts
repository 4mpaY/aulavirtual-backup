'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosFirmantes } from '../http/axiosFirmantes'
import type { Firmante } from '../entity/Firmante'

const factory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosFirmantes({ getAuthToken })
}

export const useFirmantes = () => {
  return useQuery({
    queryKey: ['admin', 'firmantes'],
    queryFn: () => factory().getAll()
  })
}

export const useFirmantesMutation = () => {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'firmantes'] })

  const crear = useMutation({
    mutationFn: (data: Partial<Firmante>) => factory().create(data),
    onSuccess: invalidate
  })

  const actualizar = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Firmante> }) => factory().update(id, data),
    onSuccess: invalidate
  })

  const eliminar = useMutation({
    mutationFn: (id: string) => factory().remove(id),
    onSuccess: invalidate
  })

  return { crear, actualizar, eliminar }
}
