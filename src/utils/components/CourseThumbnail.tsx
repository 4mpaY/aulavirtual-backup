'use client'

import React, { useState, useMemo, useEffect } from 'react'

import { Box, CardMedia, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

interface CourseThumbnailProps {
  src?: string | null
  title?: string
  videoUrl?: string | null
  sx?: SxProps<Theme>
  aspectRatio?: string
  icon?: string
}

/**
 * Valida si un string es una miniatura válida
 */
const isValidThumbnail = (url?: string | null) => {
  if (!url || typeof url !== 'string') return false

  const trimmed = url.trim()

  if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return false

  if (trimmed.startsWith('/uploads/cursos/') && (trimmed.endsWith('/') || trimmed.split('/').pop() === '')) return false

  return true
}

const CourseThumbnail = ({
  src,
  title = 'Curso',
  videoUrl,
  sx = {},
  aspectRatio = '16/9',
  icon = 'tabler-school'
}: CourseThumbnailProps) => {
  const [imgError, setImgError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Reiniciar el error si el src cambia
  useEffect(() => {
    setImgError(false)
    setIsLoaded(false)
  }, [src])

  const computedThumbnail = useMemo(() => {
    // 1. Si hay una miniatura válida, la usamos
    if (isValidThumbnail(src)) return src

    // 2. Si no hay miniatura pero hay video de YouTube, intentamos sacar la de YT
    if (videoUrl) {
      const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)

      if (ytMatch) {
        return `https://i3.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`
      }
    }

    return null
  }, [src, videoUrl])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...(aspectRatio && aspectRatio !== 'auto' ? { aspectRatio } : {}),
        bgcolor: '#0f172a', // Fondo oscuro base
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', // Degradado base
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx
      }}
    >
      {/* Capa de Fallback (Siempre presente debajo) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1.5,
          p: 2,
          textAlign: 'center',
          zIndex: 0
        }}
      >
        <Box
          sx={{
            width: { xs: 40, md: 56 },
            height: { xs: 40, md: 56 },
            borderRadius: '16px',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <i className={icon} style={{ fontSize: '1.8rem', color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.625rem' }}>
            Aula Virtual
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, opacity: 0.9, lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}>
            Sin Vista Previa
          </Typography>
        </Box>
      </Box>

      {/* Capa de Imagen (Sobre el fallback) */}
      {computedThumbnail && (
        <CardMedia
          component="img"
          image={computedThumbnail}
          alt={title}
          onLoad={() => setIsLoaded(true)}
          onError={() => setImgError(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,

            // Si hay error o no ha cargado aún, lo ocultamos para que se vea el degradado
            opacity: (!imgError && isLoaded) ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 0.5s ease',
            '&:hover': { transform: 'scale(1.05)' }
          }}
        />
      )}
    </Box>
  )
}

export default CourseThumbnail
