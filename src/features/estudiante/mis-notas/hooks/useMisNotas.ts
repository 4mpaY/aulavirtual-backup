'use client'

import { useQuery } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosMisNotas } from '../http/axiosMisNotas'
import type { DetalleNotasCurso, MisNotasResponse } from '../entity/Notas'

const QUERY_KEY = ['estudiante', 'notas']

const getAuthToken = async () => {
  const session = await getSession()

  return session?.user?.accessToken ?? null
}

const axiosMisNotas = new AxiosMisNotas({ getAuthToken })

export function useMisNotas(filters?: { anio?: string; categoria_id?: string }) {
  return useQuery<MisNotasResponse>({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () => axiosMisNotas.getHistorial(filters),
    staleTime: 30_000
  })
}

export function useDetalleNotasCurso(cursoId: string | null) {
  return useQuery<DetalleNotasCurso>({
    queryKey: [...QUERY_KEY, 'detalle', cursoId],
    queryFn: () => axiosMisNotas.getDetalleCurso(cursoId!),
    enabled: !!cursoId,
    staleTime: 0
  })
}
