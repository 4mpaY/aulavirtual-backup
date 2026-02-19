'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'
import type { Usuario } from '../entity/Usuario'
import type { CrearUsuarioDto, ActualizarUsuarioDto } from '@/schemas/usuario.schema'
import { AxiosUsuario } from '../http/axiosUsuario'

const QUERY_KEY = { USUARIOS: ['usuarios'] }

// Factory para crear instancia con autenticación
const axiosUsuarioFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosUsuario({ getAuthToken })
}

/**
 * Hook para obtener todos los usuarios
 */
export function useUsuarios(initialData?: Usuario[]) {
  const axiosUsuario = axiosUsuarioFactory()

  return useQuery<Usuario[], any>({
    queryKey: QUERY_KEY.USUARIOS,
    queryFn: async () => await axiosUsuario.searchAll(),
    initialData,
    staleTime: 60_000,
    retry: 1,
    select: data => {
      return [...data].sort((a, b) => {
        const dateA = new Date(a.creado_en).getTime()
        const dateB = new Date(b.creado_en).getTime()

        return dateB - dateA
      })
    }
  })
}

/**
 * Hook para obtener un usuario por ID
 */
export function useUsuario(id: string) {
  const axiosUsuario = axiosUsuarioFactory()

  return useQuery<Usuario, any>({
    queryKey: [...QUERY_KEY.USUARIOS, id],
    queryFn: async () => await axiosUsuario.getById(id),
    enabled: !!id,
    staleTime: 60_000,
    retry: 1
  })
}

/**
 * Hook para crear un usuario
 */
export function useCreateUsuario() {
  const qc = useQueryClient()
  const axiosUsuario = axiosUsuarioFactory()

  return useMutation<{ usuario: Usuario }, any, CrearUsuarioDto>({
    mutationFn: async (payload: CrearUsuarioDto) => await axiosUsuario.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.USUARIOS })
  })
}

/**
 * Hook para editar un usuario
 */
export function useEditUsuario() {
  const qc = useQueryClient()
  const axiosUsuario = axiosUsuarioFactory()

  return useMutation<{ usuario: Usuario }, any, { id: string; data: ActualizarUsuarioDto }>({
    mutationFn: async ({ id, data }) => await axiosUsuario.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.USUARIOS })
  })
}

/**
 * Hook para eliminar un usuario
 */
export function useDeleteUsuario() {
  const qc = useQueryClient()
  const axiosUsuario = axiosUsuarioFactory()

  return useMutation<{ message: string }, any, string>({
    mutationFn: async (id: string) => await axiosUsuario.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.USUARIOS })
  })
}

/**
 * Hook para activar/desactivar un usuario
 */
export function useToggleUsuarioStatus() {
  const qc = useQueryClient()
  const axiosUsuario = axiosUsuarioFactory()

  return useMutation<{ usuario: Usuario }, any, { id: string; esta_activo: boolean }>({
    mutationFn: async ({ id, esta_activo }) => await axiosUsuario.toggleStatus(id, esta_activo),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY.USUARIOS })
  })
}
