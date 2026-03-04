'use client'

import React from 'react'

import Link from 'next/link'

import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Stack,
    Box,
    Chip,
    Divider,
    Avatar,
    Grid
} from '@mui/material'
import { styled } from '@mui/material/styles'

interface CourseCardProps {
    id: string
    titulo: string
    slug: string
    descripcion?: string
    miniatura?: string
    precio: number
    moneda: string
    es_gratis: boolean
    profesor: {
        nombre: string
        apellido: string
        avatar?: string
    }
    categoria?: {
        nombre: string
    }
    nivel?: string
    tipo_emision?: string
    _count?: {
        lecciones: number
        inscripciones: number
    }
}

const StyledCard = styled(Card)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '16px',
    transition: 'all 0.3s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
    }
}))

const CourseCard: React.FC<CourseCardProps> = ({
    titulo,
    slug,
    miniatura,
    precio,
    moneda,
    es_gratis,
    profesor,
    categoria,
    nivel,
    tipo_emision,
    _count
}) => {
    return (
        <StyledCard sx={{ border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <Box sx={{ position: 'relative', pt: '56.25%', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    image={miniatura || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                    alt={titulo}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5
                    }}
                >
                    <Chip
                        label={es_gratis ? 'GRATUITO' : `${moneda} ${precio}`}
                        color={es_gratis ? 'success' : 'primary'}
                        sx={{ fontWeight: 800, fontSize: '0.75rem', height: '24px' }}
                    />
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {categoria && (
                            <Chip
                                label={categoria.nombre}
                                size="small"
                                sx={{ bgcolor: 'info.50', color: 'info.main', fontWeight: 700, fontSize: '0.7rem' }}
                            />
                        )}
                        <Chip
                            label={nivel === 'BASICO' ? 'Intermedio' : 'Avanzado'}
                            size="small"
                            sx={{ bgcolor: 'warning.50', color: 'warning.main', fontWeight: 700, fontSize: '0.7rem' }}
                        />
                        <Chip
                            label={tipo_emision === 'MIXTO' ? 'Mixto' : 'Sincrónico'}
                            size="small"
                            sx={{ bgcolor: 'secondary.50', color: 'secondary.main', fontWeight: 700, fontSize: '0.7rem' }}
                        />
                    </Stack>

                    <Typography
                        variant="h6"
                        component={Link}
                        href={`/cursos/${slug}`}
                        sx={{
                            fontWeight: 800,
                            lineHeight: 1.2,
                            mb: 1.5,
                            color: '#1e293b',
                            textDecoration: 'none',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '44px',
                            transition: 'color 0.2s',
                            '&:hover': { color: 'primary.main' }
                        }}
                    >
                        {titulo}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                            src={profesor.avatar || ''}
                            sx={{ width: 20, height: 20, border: '1px solid #e2e8f0' }}
                        >
                            {profesor.nombre[0]}
                        </Avatar>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {profesor.nombre} {profesor.apellido}
                        </Typography>
                    </Stack>
                </Box>

                <Divider sx={{ borderStyle: 'dashed' }} />

                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <i className="tabler-book" style={{ fontSize: '1rem', color: 'var(--mui-palette-success-main)' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                {_count?.lecciones || 10} Lec.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={4}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <i className="tabler-users" style={{ fontSize: '1rem', color: 'var(--mui-palette-info-main)' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                70 Insc.
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={4}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <i className="tabler-clock" style={{ fontSize: '1rem', color: 'var(--mui-palette-warning-main)' }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                4 Sem.
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                <Button
                    component={Link}
                    href={`/cursos/${slug}`}
                    fullWidth
                    variant="outlined"
                    sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        py: 1,
                        borderWidth: '2px',
                        '&:hover': { borderWidth: '2px', bgcolor: 'primary.main', color: 'white' }
                    }}
                >
                    Ver programa
                </Button>
            </CardContent>
        </StyledCard>
    )
}

export default CourseCard
