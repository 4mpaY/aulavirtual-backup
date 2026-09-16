import { Box } from '@mui/material'

import ClientOnly from '@/utils/components/ClientOnly'

import EbookViewer from './EbookViewer'


export default function EbookViewerClient({ ebookId }: { ebookId: string }) {
  return (
    <ClientOnly>
      <EbookViewer ebookId={ebookId} />
    </ClientOnly>
  )
}

