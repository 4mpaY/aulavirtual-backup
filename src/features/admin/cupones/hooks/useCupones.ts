import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosCupon } from '../http/axiosCupon'
import type { Cupon } from '../entity/Cupon'

const axiosCuponFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosCupon({ getAuthToken })
}

export const useCupones = (buscar: string = '', initialData?: Cupon[]) => {
  return useQuery({
    queryKey: ['cupones', buscar],
    queryFn: async () => {
      const axiosCupon = axiosCuponFactory()

      return await axiosCupon.getAll(buscar)
    },
    initialData
  })
}

export const useCuponMutation = () => {
  const queryClient = useQueryClient()

  const createCupon = useMutation({
    mutationFn: async (data: any) => {
      const axiosCupon = axiosCuponFactory()

      return await axiosCupon.create(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] })
    }
  })

  const updateCupon = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const axiosCupon = axiosCuponFactory()

      return await axiosCupon.update(id, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] })
    }
  })

  const deleteCupon = useMutation({
    mutationFn: async (id: string) => {
      const axiosCupon = axiosCuponFactory()

      return await axiosCupon.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] })
    }
  })

  return { createCupon, updateCupon, deleteCupon }
}
