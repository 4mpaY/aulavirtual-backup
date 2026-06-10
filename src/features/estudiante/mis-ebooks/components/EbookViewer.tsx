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
        // Ensure the blob is typed as PDF so the browser renders it correctly
        const pdfBlob = new Blob([blob], { type: 'application/pdf' })

        objectUrl = URL.createObjectURL(pdfBlob)
        setBlobUrl(objectUrl)
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
        <iframe
          src={blobUrl}
          title='Visor de Ebook'
          width='100%'
          height='100%'
          style={{ border: 'none', display: 'block' }}
        />
      )}
    </Box>
  )
}
