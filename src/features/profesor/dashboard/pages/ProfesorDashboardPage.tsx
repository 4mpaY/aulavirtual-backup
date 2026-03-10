'use client'

import React from 'react'

import { Box, Typography, Grid, Card, CardContent, Avatar, Stack } from '@mui/material'
import { useSession } from 'next-auth/react'

import { useCursos } from '@/features/admin/cursos/hooks/useCursos'

const ProfesorDashboardPage = () => {
    const { data: session } = useSession()

    const { data } = useCursos({
        profesor_id: session?.user?.id as string
    })

    const totalCursos = data?.cursos?.length || 0
    const totalEstudiantes = data?.cursos?.reduce((acc: number, curso: any) => acc + (curso._count?.inscripciones || 0), 0) || 0
    const cursosPublicados = data?.cursos?.filter((c: any) => c.estado === 'PUBLICADO').length || 0

    return (
        <Box>
            <Box sx={{ mb: 6 }}>
                <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                    ¡Hola, {session?.user?.name || 'Profesor'}! 👋
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                    Aquí tienes un resumen de lo que está pasando en tus cursos hoy.
                </Typography>
            </Box>

            <Grid container spacing={6}>
                {/* Stats Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent>
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar sx={{ bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.12)', color: 'primary.main', width: 56, height: 56 }}>
                                    <i className="tabler-book" style={{ fontSize: '1.8rem' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{totalCursos}</Typography>
                                    <Typography variant="body2" color="text.secondary">Total de Cursos</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent>
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar sx={{ bgcolor: 'rgba(var(--mui-palette-success-mainChannel) / 0.12)', color: 'success.main', width: 56, height: 56 }}>
                                    <i className="tabler-users" style={{ fontSize: '1.8rem' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{totalEstudiantes}</Typography>
                                    <Typography variant="body2" color="text.secondary">Estudiantes Inscritos</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ borderRadius: '16px', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <CardContent>
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Avatar sx={{ bgcolor: 'rgba(var(--mui-palette-info-mainChannel) / 0.12)', color: 'info.main', width: 56, height: 56 }}>
                                    <i className="tabler-circle-check" style={{ fontSize: '1.8rem' }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{cursosPublicados}</Typography>
                                    <Typography variant="body2" color="text.secondary">Cursos Publicados</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Info Section */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: '16px', bgcolor: 'primary.main', color: 'white', p: 4 }}>
                        <Grid container alignItems="center" spacing={4}>
                            <Grid item xs={12} md={8}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'white' }}>
                                    ¿Listo para compartir más conocimiento?
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
                                    Sigue creando contenido de calidad para tus alumnos. Recuerda que puedes responder sus dudas directamente desde el reproductor de cada lección.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                                <i className="tabler-certificate" style={{ fontSize: '5rem', opacity: 0.3 }} />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProfesorDashboardPage
