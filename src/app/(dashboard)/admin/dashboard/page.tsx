import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import { Typography, Box } from '@mui/material'

import { DashboardView } from '@/features/admin/dashboard'
import { AxiosDashboard } from '@/features/admin/dashboard/http/axiosDashboard'
import { getAuthOptions } from '@/utils/configs/auth'

export const metadata = {
  title: 'Panel de Control'
}

export default async function Page() {
  const options = await getAuthOptions()
  const session = await getServerSession(options)

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosDashboard = new AxiosDashboard({
    getAuthToken: () => token
  })

  let initialData: any = null

  try {
    initialData = await axiosDashboard.getResumen()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }

  return (
    <Box>
      <Typography variant='h4' sx={{ mb: 6, fontWeight: 600 }}>
        Panel de Control
      </Typography>
      <DashboardView initialData={initialData} />
    </Box>
  )
}
