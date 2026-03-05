'use client'

import React, { useState, useEffect } from 'react'
import { Box, Grid, Container, useMediaQuery, useTheme, Drawer, IconButton, Fab } from '@mui/material'
import VideoPlayer from './VideoPlayer'
import CourseContentSidebar from './CourseContentSidebar'
import LessonContent from './LessonContent'

interface Lesson {
    id: string
    titulo: string
    contenido?: string
    orden: number
    video_url?: string
    completada: boolean
    recursos?: any[]
}

interface Module {
    id: string
    titulo: string
    orden: number
    lecciones: Lesson[]
}

interface CoursePlayerViewProps {
    course: {
        id: string
        titulo: string
        modulos: Module[]
    }
    initialLessonId?: string
}

const CoursePlayerView: React.FC<CoursePlayerViewProps> = ({ course, initialLessonId }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
    const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(
        initialLessonId || course.modulos[0]?.lecciones[0]?.id
    )

    // Encontrar la lección actual en los datos
    const currentLesson = course.modulos
        .flatMap(m => m.lecciones)
        .find(l => l.id === currentLessonId)

    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false)
        } else {
            setSidebarOpen(true)
        }
    }, [isMobile])

    const handleLessonSelect = (lessonId: string) => {
        setCurrentLessonId(lessonId)
        if (isMobile) {
            setSidebarOpen(false)
        }
    }

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', position: 'relative' }}>
            {/* Contenido principal */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: { xs: 2, md: 4 },
                    transition: 'margin 0.3s',
                    mr: sidebarOpen && !isMobile ? '350px' : 0
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <VideoPlayer
                                url={currentLesson?.video_url || undefined}
                                tipo="VIDEO"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {currentLesson && (
                                <LessonContent
                                    titulo={currentLesson.titulo}
                                    descripcion={currentLesson.contenido || undefined}
                                    recursos={currentLesson.recursos || []}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Sidebar (Desktop) */}
            {!isMobile && (
                <Box
                    sx={{
                        width: 350,
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        height: '100%',
                        borderLeft: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
                        transition: 'transform 0.3s',
                        zIndex: 10
                    }}
                >
                    <CourseContentSidebar
                        modules={course.modulos}
                        currentLessonId={currentLessonId}
                        onLessonSelect={handleLessonSelect}
                    />
                </Box>
            )}

            {/* Sidebar (Mobile Drawer) */}
            {isMobile && (
                <Drawer
                    anchor="right"
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    PaperProps={{ sx: { width: '85%' } }}
                >
                    <CourseContentSidebar
                        modules={course.modulos}
                        currentLessonId={currentLessonId}
                        onLessonSelect={handleLessonSelect}
                    />
                </Drawer>
            )}

            {/* Botón flotante para abrir el temario en mobile o cuando está oculto */}
            <Fab
                color="primary"
                size="medium"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 20,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
            >
                <i className={sidebarOpen ? 'tabler-x' : 'tabler-layout-sidebar-right'} style={{ fontSize: '1.5rem' }} />
            </Fab>
        </Box>
    )
}

export default CoursePlayerView
