'use client'

import { useQuery } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import type { PedidoEstudiante } from '../entity/PedidoEstudiante'
import { AxiosPedidoEstudiante } from '../http/axiosPedidoEstudiante'

const QUERY_KEY = { MIS_PEDIDOS: ['mis-pedidos'] }

const axiosPedidoEstudianteFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosPedidoEstudiante({ getAuthToken })
}

/**
 * Hook para obtener los pedidos del estudiante autenticado
 */
export function useMisPedidos(query?: Record<string, string>, initialData?: PedidoEstudiante[]) {
  const axiosPedido = axiosPedidoEstudianteFactory()

  return useQuery<{ pedidos: PedidoEstudiante[]; paginacion: any }, any>({
    queryKey: [...QUERY_KEY.MIS_PEDIDOS, query],
    queryFn: async () => await axiosPedido.getAll(query),
    initialData: initialData ? { pedidos: initialData, paginacion: {} } : undefined,
    staleTime: 60_000,
    retry: 1
  })
}
