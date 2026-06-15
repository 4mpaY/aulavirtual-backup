'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosSuscripcion, AxiosPlanesSuscripcion } from '../http/axiosSuscripcion'

const KEYS = {
  MI_SUSCRIPCION: ['estudiante', 'suscripcion'],
  PLANES: ['planes-suscripcion-publico']
}

const suscripcionFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosSuscripcion({ getAuthToken })
}

const planesFactory = () => new AxiosPlanesSuscripcion()

export function useMiSuscripcion() {
  return useQuery({
    queryKey: KEYS.MI_SUSCRIPCION,
    queryFn: () => suscripcionFactory().getMiSuscripcion(),
    staleTime: 60_000
  })
}

export function usePlanesPublicos() {
  return useQuery({
    queryKey: KEYS.PLANES,
    queryFn: () => planesFactory().getPlanes(),
    staleTime: 5 * 60_000
  })
}

export function useSuscribirse() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: { planId: string; tokenId: string }) =>
      suscripcionFactory().suscribirse(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.MI_SUSCRIPCION })
  })
}

export function useCancelarSuscripcion() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => suscripcionFactory().cancelar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.MI_SUSCRIPCION })
  })
}
