'use client'

import { Box, CircularProgress, Typography } from '@mui/material'

import { usePreventEscapeStopLoading } from '@/utils/hooks/usePreventEscapeStopLoading'

export default function DashboardLoadingView({
  title = 'Cargando panel...',
  subtitle = 'Estamos preparando tu información'
}: {
  title?: string
  subtitle?: string
}) {
  usePreventEscapeStopLoading(true)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        gap: 4,
        animation: 'fadeIn 0.3s ease-in-out'
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `
        }}
      />
      <CircularProgress
        size={56}
        thickness={4}
        sx={{
          color: 'primary.main',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round'
          }
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}
