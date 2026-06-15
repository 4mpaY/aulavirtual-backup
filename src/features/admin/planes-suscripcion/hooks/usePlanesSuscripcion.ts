'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosPlanSuscripcion } from '../http/axiosPlanSuscripcion'
import type { PlanSuscripcion } from '../entity/PlanSuscripcion'

const QUERY_KEY = ['planes-suscripcion']

const axiosFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosPlanSuscripcion({ getAuthToken })
}

export const usePlanesSuscripcion = (buscar: string = '', initialData?: PlanSuscripcion[]) => {
  return useQuery({
    queryKey: [...QUERY_KEY, buscar],
    queryFn: async () => {
      const res = await axiosFactory().getAll(buscar)

      return res.planes
    },
    initialData: buscar === '' ? initialData : undefined
  })
}

export const usePlanSuscripcionMutation = () => {
  const queryClient = useQueryClient()

  const createPlan = useMutation({
    mutationFn: (data: any) => axiosFactory().create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  })

  const updatePlan = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => axiosFactory().update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  })

  const deletePlan = useMutation({
    mutationFn: (id: string) => axiosFactory().delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY })
  })

  return { createPlan, updatePlan, deletePlan }
}
