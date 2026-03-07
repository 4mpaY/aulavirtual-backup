'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'
import { AxiosMedia } from '../http/axiosMedia'

const QUERY_KEY = { MEDIA: ['media'] }

const axiosMediaFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosMedia({ getAuthToken })
}

/**
 * Hook para listar todos los medios
 */
export function useMedia() {
  const axiosMedia = axiosMediaFactory()

  return useQuery<any[], any>({
    queryKey: QUERY_KEY.MEDIA,
    queryFn: async () => await axiosMedia.getAll(),
    staleTime: 60_000,
    retry: 1
  })
}

/**
 * Hook para subir un medio
 */
export function useUploadMedia() {
  const qc = useQueryClient()
  const axiosMedia = axiosMediaFactory()

  return useMutation<any, any, File>({
    mutationFn: async file => await axiosMedia.upload(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.MEDIA })
  })
}
