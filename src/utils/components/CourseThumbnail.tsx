'use client'

import React, { useState, useMemo, useEffect } from 'react'

import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

interface CourseThumbnailProps {
  src?: string | null
  title?: string
  videoUrl?: string | null
  sx?: SxProps<Theme>
  aspectRatio?: string
  icon?: string
  variant?: 'landscape' | 'simple'
}

/**
 * Valida si un string es una miniatura válida
 */
const CourseThumbnail = ({
  src,
  title = 'Curso',
  videoUrl,
  sx = {},
  aspectRatio = '16/9',
  icon = 'tabler-school',
  variant = 'landscape'
}: CourseThumbnailProps) => {
  const [imgError, setImgError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  // Reiniciar el error si el src cambia
  useEffect(() => {
    setImgError(false)
    setRetryCount(0)
  }, [src])

  const computedThumbnail = useMemo(() => {
    let finalUrl: string | null = null

    // 1. Si hay src, lo normalizamos
    if (src && typeof src === 'string' && src.trim() !== '' && src !== 'null' && src !== 'undefined') {
      finalUrl = src.trim()

      // Asegurar prefijo / para rutas locales
      if (!finalUrl.startsWith('http') && !finalUrl.startsWith('/')) {
        finalUrl = `/${finalUrl}`
      }
    }

    // 2. Si no hay src, probamos con videoUrl (YouTube)
    else if (videoUrl) {
      const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)

      if (ytMatch) {
        finalUrl = `https://i3.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`
      }
    }

    if (!finalUrl) return null

    // 🚀 CACHE BUSTING: Solo en reintento
    if (retryCount > 0 && (finalUrl.startsWith('/') || finalUrl.includes('uploads'))) {
      const separator = finalUrl.includes('?') ? '&' : '?'
      
      return `${finalUrl}${separator}v=${retryCount}_${Date.now()}`
    }

    return finalUrl
  }, [src, videoUrl, retryCount])

  const handleImageError = () => {
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
      }, 1000)
    } else {
      setImgError(true)
    }
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...(aspectRatio && aspectRatio !== 'auto' ? { aspectRatio } : {}),
        bgcolor: '#1e293b',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1,
          p: 2,
          textAlign: 'center',
          zIndex: 0
        }}
      >
        <Box
          sx={{
            width: variant === 'simple' ? '40px' : { xs: 40, md: 50 },
            height: variant === 'simple' ? '40px' : { xs: 40, md: 50 },
            borderRadius: '12px',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <i
            className={icon}
            style={{
              fontSize: variant === 'simple' ? '1.2rem' : '1.5rem',
              color: 'rgba(255, 255, 255, 0.3)'
            }}
          />
        </Box>

        {variant === 'landscape' && (
          <Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.75rem' }}>
              Sin Vista Previa
            </Typography>
          </Box>
        )}
      </Box>

      {/* Capa de Imagen (Encima) */}
      {computedThumbnail && !imgError && (
        <Box
          component="img"
          key={`${computedThumbnail}_${retryCount}`}
          src={computedThumbnail}
          alt={title}
          onError={handleImageError}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
            transition: 'transform 0.5s ease',
            '&:hover': { transform: variant === 'landscape' ? 'scale(1.05)' : 'none' }
          }}
        />
      )}
    </Box>
  )
}

export default CourseThumbnail
