import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const useCupones = (buscar: string = '') => {
  return useQuery({
    queryKey: ['cupones', buscar],
    queryFn: async () => {
      const response = await axios.get(`/api/cupones?buscar=${buscar}`)

      
return response.data.result.cupones
    }
  })
}

export const useCuponMutation = () => {
  const queryClient = useQueryClient()

  const createCupon = useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post('/api/cupones', data)

      
return response.data.result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] })
    }
  })

  const updateCupon = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axios.patch(`/api/cupones/${id}`, data)

      
return response.data.result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] })
    }
  })

  const deleteCupon = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/cupones/${id}`)

      
return response.data.result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cupones'] })
    }
  })

  return { createCupon, updateCupon, deleteCupon }
}
