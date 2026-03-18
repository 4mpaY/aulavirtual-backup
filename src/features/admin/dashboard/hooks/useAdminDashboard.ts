'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/dashboard')

      return data.result
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}
