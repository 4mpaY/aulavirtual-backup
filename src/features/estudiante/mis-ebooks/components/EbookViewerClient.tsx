'use client'

import dynamic from 'next/dynamic'

import { Box, CircularProgress } from '@mui/material'

const EbookViewerDynamic = dynamic(
  () => import('./EbookViewer').then(m => m.EbookViewer),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ height: 'calc(100vh - 220px)', minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1a1a1a', borderRadius: 2 }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    ),
  }
)

export default function EbookViewerClient({ ebookId }: { ebookId: string }) {
  return <EbookViewerDynamic ebookId={ebookId} />
}
