import { useQuery } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosCursoAdmin } from '../http/axiosCursoAdmin'

interface UseCursoAlumnosProps {
  cursoId: string | null
  search?: string
}

export const useCursoAlumnos = ({ cursoId, search }: UseCursoAlumnosProps) => {
  return useQuery({
    queryKey: ['curso-alumnos', cursoId, search],
    queryFn: async () => {
      if (!cursoId) return { alumnos: [], total: 0 }

      const getAuthToken = async () => {
        const session = await getSession()

        return session?.user?.accessToken ?? null
      }

      const axiosCursoAdmin = new AxiosCursoAdmin({ getAuthToken })

      return await axiosCursoAdmin.getAlumnos(cursoId, search)
    },
    enabled: !!cursoId, // Solo se ejecuta si hay cursoId
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
