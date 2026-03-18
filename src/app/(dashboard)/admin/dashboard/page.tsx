import { Typography, Box } from '@mui/material'

import { DashboardView } from '@/features/admin/dashboard'

export default function Page() {
  return (
    <Box>
      <Typography variant='h4' sx={{ mb: 6, fontWeight: 600 }}>
        Panel de Control
      </Typography>
      <DashboardView />
    </Box>
  )
}
