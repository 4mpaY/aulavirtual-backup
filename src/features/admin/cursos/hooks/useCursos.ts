'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'
import type { Curso } from '../entity/Curso'
import type { CrearCursoDto, ActualizarCursoDto, CambiarEstadoCursoDto } from '@/schemas/curso.schema'
import { AxiosCurso } from '../http/axiosCurso'

const QUERY_KEY = { CURSOS: ['cursos'] }

const axiosCursoFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosCurso({ getAuthToken })
}

/**
 * Hook para listar cursos con filtros
 */
export function useCursos(query?: Record<string, string>) {
  const axiosCurso = axiosCursoFactory()

  return useQuery<{ cursos: Curso[]; paginacion: any }, any>({
    queryKey: [...QUERY_KEY.CURSOS, query],
    queryFn: async () => await axiosCurso.searchAll(query),
    staleTime: 60_000,
    retry: 1
  })
}

/**
 * Hook para obtener un curso por ID
 */
export function useCurso(id: string) {
  const axiosCurso = axiosCursoFactory()

  return useQuery<Curso, any>({
    queryKey: [...QUERY_KEY.CURSOS, id],
    queryFn: async () => await axiosCurso.getById(id),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1
  })
}

/**
 * Hook para crear un curso
 */
export function useCreateCurso() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<{ curso: Curso }, any, CrearCursoDto>({
    mutationFn: async (payload) => await axiosCurso.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

/**
 * Hook para editar un curso
 */
export function useEditCurso() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<{ curso: Curso }, any, { id: string; data: ActualizarCursoDto }>({
    mutationFn: async ({ id, data }) => await axiosCurso.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

/**
 * Hook para eliminar un curso
 */
export function useDeleteCurso() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<{ message: string }, any, string>({
    mutationFn: async (id) => await axiosCurso.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

/**
 * Hook para cambiar estado del curso
 */
export function useCambiarEstadoCurso() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<{ curso: Curso }, any, { id: string; data: CambiarEstadoCursoDto }>({
    mutationFn: async ({ id, data }) => await axiosCurso.cambiarEstado(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}
