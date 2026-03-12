'use client'

import React from 'react'

import { Box, Paper } from '@mui/material'

interface VideoPlayerProps {
    url?: string
    tipo?: 'VIDEO' | 'INCRUSTADO'
    onEnded?: () => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, tipo = 'VIDEO', onEnded }) => {
    if (!url) {
        return (
            <Paper
                sx={{
                    width: '100%',
                    aspectRatio: '16/9',
                    bgcolor: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: { xs: 0, md: '12px' },
                    overflow: 'hidden'
                }}
            >
                <Box sx={{ color: 'white', textAlign: 'center' }}>
                    <i className="tabler-video-off" style={{ fontSize: '3rem', opacity: 0.5 }} />
                    <Box sx={{ mt: 1, opacity: 0.7 }}>No hay video disponible para esta lección</Box>
                </Box>
            </Paper>
        )
    }

    // Si es YouTube o Vimeo incrustado
    const isEmbedded = url.includes('youtube.com') || url.includes('vimeo.com') || tipo === 'INCRUSTADO'

    const getEmbedUrl = (originalUrl: string) => {
        if (originalUrl.includes('youtube.com/watch?v=')) {
            return originalUrl.replace('watch?v=', 'embed/')
        }

        if (originalUrl.includes('vimeo.com/') && !originalUrl.includes('player.vimeo.com')) {
            const videoId = originalUrl.split('vimeo.com/')[1]

            return `https://player.vimeo.com/video/${videoId}`
        }

        return originalUrl
    }

    return (
        <Box
            sx={{
                width: '100%',
                aspectRatio: '16/9',
                bgcolor: 'black',
                borderRadius: { xs: 0, md: '12px' },
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
        >
            {isEmbedded ? (
                <iframe
                    width="100%"
                    height="100%"
                    src={getEmbedUrl(url)}
                    title="Reproductor de video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ border: 'none' }}
                />
            ) : (
                <video
                    controls
                    onEnded={onEnded}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                >
                    <source src={url} />
                    Tu navegador no soporta el elemento de video.
                </video>
            )}
        </Box>
    )
}

export default VideoPlayer
