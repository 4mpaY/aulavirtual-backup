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
export function usePedidos(query?: Record<string, string>, initialData?: Pedido[]) {
  const axiosPedido = axiosPedidoFactory()

  return useQuery<{ pedidos: Pedido[]; paginacion: any }, any>({
    queryKey: [...QUERY_KEY.PEDIDOS, query],
    queryFn: async () => await axiosPedido.getAll(query),
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

/**
 * Hook para obtener el detalle de un pedido
 */
export function usePedido(id: string) {
  const axiosPedido = axiosPedidoFactory()

  return useQuery<{ data: Pedido }, any>({
    queryKey: [...QUERY_KEY.PEDIDOS, id],
    queryFn: async () => await axiosPedido.getById(id),
    staleTime: 60_000,
    retry: 1
  })
}

/**
 * Hook para actualizar un pedido
 */
export function useUpdatePedido() {
  const qc = useQueryClient()
  const axiosPedido = axiosPedidoFactory()

  return useMutation<{ message: string; data: Pedido }, any, { id: string; data: Partial<Pedido> }>({
    mutationFn: async ({ id, data }) => await axiosPedido.updatePedido(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.PEDIDOS })
      qc.invalidateQueries({ queryKey: [...QUERY_KEY.PEDIDOS, variables.id] })
    }
  })
}

/**
 * Hook para eliminar un pedido
 */
export function useDeletePedido() {
  const qc = useQueryClient()
  const axiosPedido = axiosPedidoFactory()

  return useMutation<{ message: string }, any, string>({
    mutationFn: async (id: string) => await axiosPedido.drop(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.PEDIDOS })
    }
  })
}
