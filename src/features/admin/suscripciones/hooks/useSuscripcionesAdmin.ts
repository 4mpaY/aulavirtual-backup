'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosSuscripcionAdmin } from '../http/axiosSuscripcionAdmin'

const QUERY_KEY = ['admin-suscripciones']

const factory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosSuscripcionAdmin({ getAuthToken })
}

export function useSuscripcionesAdmin(params: Record<string, string> = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, params],
    queryFn: () => factory().getAll(params),
    staleTime: 30_000
  })
}

export function useCancelarSuscripcionAdmin() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => factory().cancelar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY })
  })
}
