import { getSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { AxiosEbook } from '../http/axiosEbook'
import type { Ebook, CreateEbookDto, UpdateEbookDto } from '../entity/Ebook'

const QUERY_KEY = { EBOOKS: ['admin', 'ebooks'] }

const ebookFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosEbook({ getAuthToken })
}

export function useAdminEbooks(params?: { buscar?: string; estado?: string }) {
  return useQuery<Ebook[]>({
    queryKey: [...QUERY_KEY.EBOOKS, params],
    queryFn: () => ebookFactory().getAll(params),
  })
}

export function useAdminEbook(id: string | null) {
  return useQuery<Ebook>({
    queryKey: [...QUERY_KEY.EBOOKS, id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/ebooks/${id}`)

      return data.result?.ebook ?? data.ebook
    },
    enabled: !!id,
  })
}

export function useCreateEbook() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEbookDto) => ebookFactory().create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.EBOOKS }),
  })
}

export function useUpdateEbook() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEbookDto }) =>
      ebookFactory().update(id, payload),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.EBOOKS })
      qc.invalidateQueries({ queryKey: [...QUERY_KEY.EBOOKS, variables.id] })
    },
  })
}

export function useDeleteEbook() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ebookFactory().remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.EBOOKS }),
  })
}
