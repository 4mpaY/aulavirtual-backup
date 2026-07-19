'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosPlantillaCertificado } from '../http/axiosPlantillaCertificado'
import type { PlantillaCertificado } from '../entity/PlantillaCertificado'

const factory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosPlantillaCertificado({ getAuthToken })
}

export const usePlantillasCertificado = () => {
  return useQuery({
    queryKey: ['admin', 'plantillas-certificado'],
    queryFn: () => factory().getAll()
  })
}

export const usePlantillaCertificado = (id: string | null) => {
  return useQuery({
    queryKey: ['admin', 'plantillas-certificado', id],
    queryFn: () => factory().getOne(id as string),
    enabled: !!id
  })
}

export const usePlantillasCertificadoMutation = () => {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'plantillas-certificado'] })

  const crear = useMutation({
    mutationFn: (data: Partial<PlantillaCertificado>) => factory().create(data),
    onSuccess: invalidate
  })

  const actualizar = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlantillaCertificado> }) => factory().update(id, data),
    onSuccess: invalidate
  })

  const eliminar = useMutation({
    mutationFn: (id: string) => factory().remove(id),
    onSuccess: invalidate
  })

  return { crear, actualizar, eliminar }
}
