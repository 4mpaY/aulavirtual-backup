'use client'

import { useEffect, useState } from 'react'

import { Box, CircularProgress, Typography } from '@mui/material'

interface Props {
  ebookId: string
}

export const EbookViewer = ({ ebookId }: Props) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setBlobUrl(null)

    let objectUrl: string | null = null

    fetch(`/api/estudiante/ebooks/${ebookId}/pdf`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        return res.blob()
      })
      .then(blob => {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' })

        objectUrl = URL.createObjectURL(pdfBlob)
        // #toolbar=0 oculta la barra con el botón de descarga en Chrome/Edge
        setBlobUrl(`${objectUrl}#toolbar=0&navpanes=0&scrollbar=1`)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
        setError(true)
      })

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [ebookId])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '85vh',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {loading && !error && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            zIndex: 1,
          }}
        >
          <CircularProgress />
          <Typography variant='body2' color='text.secondary'>
            Cargando ebook...
          </Typography>
        </Box>
      )}

      {error && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <i className='tabler-file-off text-5xl text-textSecondary' />
          <Typography color='text.secondary'>No se pudo cargar el ebook.</Typography>
        </Box>
      )}

      {blobUrl && (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <iframe
            src={blobUrl}
            title='Visor de Ebook'
            width='100%'
            height='100%'
            style={{ border: 'none', display: 'block' }}
          />
          {/* Capa transparente sobre el toolbar del PDF (Firefox/Safari no respetan #toolbar=0) */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 40,
              zIndex: 10,
              bgcolor: 'transparent',
              pointerEvents: 'none',
            }}
            aria-hidden
          />
        </Box>
      )}
    </Box>
  )
}
