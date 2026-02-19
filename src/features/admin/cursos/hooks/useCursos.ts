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
 * Hook para obtener un curso por ID (con módulos y lecciones)
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

// ===================== MÓDULOS =====================

export function useCreateModulo() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; data: { titulo: string; descripcion?: string | null } }>({
    mutationFn: async ({ cursoId, data }) => await axiosCurso.createModulo(cursoId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

export function useUpdateModulo() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; moduloId: string; data: { titulo?: string; descripcion?: string | null } }>({
    mutationFn: async ({ cursoId, moduloId, data }) => await axiosCurso.updateModulo(cursoId, moduloId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

export function useDeleteModulo() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; moduloId: string }>({
    mutationFn: async ({ cursoId, moduloId }) => await axiosCurso.deleteModulo(cursoId, moduloId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

export function useReorderModulos() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; items: { id: string; orden: number }[] }>({
    mutationFn: async ({ cursoId, items }) => await axiosCurso.reorderModulos(cursoId, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

// ===================== LECCIONES =====================

export function useCreateLeccion() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; moduloId: string; data: { titulo: string } }>({
    mutationFn: async ({ cursoId, moduloId, data }) => await axiosCurso.createLeccion(cursoId, moduloId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

export function useUpdateLeccion() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; moduloId: string; leccionId: string; data: any }>({
    mutationFn: async ({ cursoId, moduloId, leccionId, data }) => await axiosCurso.updateLeccion(cursoId, moduloId, leccionId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

export function useDeleteLeccion() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; moduloId: string; leccionId: string }>({
    mutationFn: async ({ cursoId, moduloId, leccionId }) => await axiosCurso.deleteLeccion(cursoId, moduloId, leccionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}

export function useReorderLecciones() {
  const qc = useQueryClient()
  const axiosCurso = axiosCursoFactory()

  return useMutation<any, any, { cursoId: string; moduloId: string; items: { id: string; orden: number }[] }>({
    mutationFn: async ({ cursoId, moduloId, items }) => await axiosCurso.reorderLecciones(cursoId, moduloId, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.CURSOS })
  })
}
