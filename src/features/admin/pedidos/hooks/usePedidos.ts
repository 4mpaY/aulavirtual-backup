'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import type { Pedido } from '../entity/Pedido'
import type { CrearPedidoManualDto } from '@/schemas/pedido.schema'
import { AxiosPedido } from '../http/axiosPedido'

const QUERY_KEY = { PEDIDOS: ['pedidos'] }

const axiosPedidoFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosPedido({ getAuthToken })
}

/**
 * Hook para obtener todos los pedidos
 */
export function usePedidos(initialData?: Pedido[]) {
  const axiosPedido = axiosPedidoFactory()

  return useQuery<{ pedidos: Pedido[]; paginacion: any }, any>({
    queryKey: QUERY_KEY.PEDIDOS,
    queryFn: async () => await axiosPedido.getAll(),
    initialData: initialData ? { pedidos: initialData, paginacion: {} } : undefined,
    staleTime: 60_000,
    retry: 1
  })
}

/**
 * Hook para crear un pedido manual
 */
export function useCreatePedidoManual() {
  const qc = useQueryClient()
  const axiosPedido = axiosPedidoFactory()

  return useMutation<{ message: string; data: any }, any, CrearPedidoManualDto>({
    mutationFn: async (payload: CrearPedidoManualDto) => await axiosPedido.createManual(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.PEDIDOS })
  })
}
