'use client'

import { useQuery } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosCalendario } from '../http/axiosCalendario'

const factory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosCalendario({ getAuthToken })
}

export function useCalendario(desde?: string, hasta?: string) {
  const client = factory()

  return useQuery<any[], any>({
    queryKey: ['calendario', desde, hasta],
    queryFn: () => client.getEventos(desde, hasta),
    staleTime: 5 * 60_000,
    retry: 1
  })
}
