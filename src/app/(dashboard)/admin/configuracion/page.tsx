import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'
import { Box, Typography } from '@mui/material'

import { ConfiguracionView } from '@/features/admin/configuracion'
import { AxiosConfiguracion } from '@/features/admin/configuracion/http/axiosConfiguracion'
import { authOptions } from '@/utils/configs/auth'

export const metadata = {
  title: 'Configuración del Sistema | Aula Virtual'
}

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosConfig = new AxiosConfiguracion({
    getAuthToken: () => token
  })

  let initialData: any[] = []

  try {
    initialData = await axiosConfig.getAll()
  } catch (error) {
    console.error('Error fetching system config:', error)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Configuración del Sistema</Typography>
      <ConfiguracionView initialData={initialData} />
    </Box>
  )
}
