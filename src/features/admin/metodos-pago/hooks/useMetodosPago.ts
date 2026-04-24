'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosMetodosPago } from '../http/axiosMetodosPago'
import type { MetodoPagoManual } from '../entity/MetodoPagoManual'

const factory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosMetodosPago({ getAuthToken })
}

export const useMetodosPago = () => {
  return useQuery({
    queryKey: ['admin', 'metodos-pago'],
    queryFn: () => factory().getAll()
  })
}

export const useMetodosPagoMutation = () => {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'metodos-pago'] })

  const crear = useMutation({
    mutationFn: (data: Partial<MetodoPagoManual>) => factory().create(data),
    onSuccess: invalidate
  })

  const actualizar = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MetodoPagoManual> }) => factory().update(id, data),
    onSuccess: invalidate
  })

  const eliminar = useMutation({
    mutationFn: (id: string) => factory().remove(id),
    onSuccess: invalidate
  })

  return { crear, actualizar, eliminar }
}
