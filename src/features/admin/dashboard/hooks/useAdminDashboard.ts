import { useQuery } from '@tanstack/react-query'
import { getSession } from 'next-auth/react'

import { AxiosDashboard } from '../http/axiosDashboard'

const axiosDashboardFactory = () => {
  const getAuthToken = async () => {
    const s = await getSession()

    return s?.user?.accessToken ?? null
  }

  return new AxiosDashboard({ getAuthToken })
}

export function useAdminDashboard(initialData?: any) {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const axiosDashboard = axiosDashboardFactory()

      return await axiosDashboard.getResumen()
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData
  })
}
