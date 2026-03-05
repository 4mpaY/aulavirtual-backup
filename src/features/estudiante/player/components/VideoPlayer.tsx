'use client'

import React from 'react'
import { Box, Paper } from '@mui/material'

interface VideoPlayerProps {
    url?: string
    tipo?: 'VIDEO' | 'INCRUSTADO'
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, tipo = 'VIDEO' }) => {
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
                    borderRadius: '12px',
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

    return (
        <Box
            sx={{
                width: '100%',
                aspectRatio: '16/9',
                bgcolor: 'black',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
        >
            {isEmbedded ? (
                <iframe
                    width="100%"
                    height="100%"
                    src={url.includes('youtube.com/watch?v=') ? url.replace('watch?v=', 'embed/') : url}
                    title="Reproductor de video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ border: 'none' }}
                />
            ) : (
                <video
                    controls
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
