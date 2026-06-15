'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'
import axios from 'axios'

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

  return useMutation<any, any, { file: File; onProgress?: (progress: number) => void }>({
    mutationFn: async ({ file, onProgress }) => await axiosMedia.upload(file, onProgress),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.MEDIA })
  })
}

/**
 * Hook para subir un video privado
 */
export function useUploadPrivateVideo() {
  const qc = useQueryClient()
  const axiosMedia = axiosMediaFactory()

  return useMutation<any, any, { file: File; onProgress?: (progress: number) => void }>({
    mutationFn: async ({ file, onProgress }) => {
      const formData = new FormData()

      formData.append('file', file)

      const token = typeof axiosMedia['getAuthToken'] === 'function' ? await axiosMedia['getAuthToken']() : null

      const headers: any = {
        'Content-Type': 'multipart/form-data'
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const res = await axios.post('/api/videos/upload', formData, {
        headers,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)

            onProgress(percentCompleted)
          }
        }
      })

      return res.data?.result !== undefined ? res.data.result : res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.MEDIA })
  })
}

/**
 * Hook para eliminar un medio
 */
export function useDeleteMedia() {
  const qc = useQueryClient()
  const axiosMedia = axiosMediaFactory()

  return useMutation<any, any, string>({
    mutationFn: async id => await axiosMedia.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.MEDIA })
  })
}
