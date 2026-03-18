import { getSession } from 'next-auth/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

import { AxiosRuta } from '../http/axiosRuta'
import type { Ruta, CreateRutaDto } from '../entity/Ruta'

const QUERY_KEY = { RUTAS: ['rutas'] }

const axiosRutaFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosRuta({ getAuthToken })
}

export function useRutas(initialData?: Ruta[]) {
  const axiosRuta = axiosRutaFactory()

  return useQuery<Ruta[]>({
    queryKey: QUERY_KEY.RUTAS,
    queryFn: async () => await axiosRuta.getAll(),
    initialData
  })
}

export function useRuta(id: string | null) {
  return useQuery<Ruta>({
    queryKey: [...QUERY_KEY.RUTAS, id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/admin/rutas/${id}`)

      return data.result
    },
    enabled: !!id
  })
}

export function useCreateRuta() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateRutaDto) => {
      const { data } = await axios.post('/api/admin/rutas', payload)

      return data.result
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.RUTAS })
  })
}

export function useUpdateRuta() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<CreateRutaDto> }) => {
      const { data } = await axios.put(`/api/admin/rutas/${id}`, payload)

      return data.result
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: QUERY_KEY.RUTAS })
      qc.invalidateQueries({ queryKey: [...QUERY_KEY.RUTAS, variables.id] })
    }
  })
}

export function useDeleteRuta() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`/api/admin/rutas/${id}`)

      return data.result
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.RUTAS })
  })
}

export function useManageRutaCursos() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, cursos, secciones }: { id: string; cursos: { id: string; seccion_id?: string | null }[]; secciones: any[] }) => {
      const axiosRuta = axiosRutaFactory()

      return await axiosRuta.manageCursos(id, { cursos, secciones })
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...QUERY_KEY.RUTAS, variables.id] })
    }
  })
}
