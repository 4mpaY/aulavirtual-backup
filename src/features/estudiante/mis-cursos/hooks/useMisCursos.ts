'use client'

import { useQuery } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosMisCursos } from '../http/axiosMisCursos'
import type { MisCursoItem } from '../entity/MisCursos'

const QUERY_KEY = ['estudiante', 'mis-cursos']

const getAuthToken = async () => {
  const session = await getSession()

  return session?.user?.accessToken ?? null
}

const axiosMisCursos = new AxiosMisCursos({ getAuthToken })

export function useMisCursos() {
  return useQuery<MisCursoItem[]>({
    queryKey: QUERY_KEY,
    queryFn: () => axiosMisCursos.getAll(),
    staleTime: 30_000
  })
}
