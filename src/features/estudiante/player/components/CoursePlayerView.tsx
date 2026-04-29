'use client'

import { useState, useEffect, useMemo } from 'react'

import axios from 'axios'
import { toast } from 'react-toastify'
import { Box, Grid, Container, useMediaQuery, useTheme, Tabs, Tab, Button, Stack } from '@mui/material'

import VideoPlayer from './VideoPlayer'
import CourseContentSidebar from './CourseContentSidebar'
import LessonContent from './LessonContent'
import CommentsSection from './CommentsSection'
import ExamSection from './ExamSection'
import CertificateSection from './CertificateSection'
import CompletionSummary from './CompletionSummary'
import LiveLessonPlaceholder from './LiveLessonPlaceholder'

import { useCourseStore } from '../store/useCourseStore'

interface CoursePlayerViewProps {
    course: {
        id: string
        titulo: string
        modulos: any[]
        examenes?: any[]
    }
    initialLessonId?: string
}

const CoursePlayerView = ({ course, initialLessonId }: CoursePlayerViewProps) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile)
    const [mobileTab, setMobileTab] = useState(0)

    // Zustand Store
    const {
        course: storeCourse,
        currentLessonId,
        currentView,
        examenId,
        currentExamenId,
        setCourse,
        setCurrentLessonId,
        updateLessonProgress,
        setExamenId,
        setExamStatus
    } = useCourseStore()

    const [mounted, setMounted] = useState(false)

    // Inicializar store y mounted state
    useEffect(() => {
        setMounted(true)

        if (course) {
            setCourse(course)
            const examenFinal = course.examenes?.find((e: any) => e.tipo === 'FINAL' && e.esta_publicado)

            if (examenFinal) {
                setExamenId(examenFinal.id)
            }

            // Si el curso no tiene examen final pero el alumno ya aprobó el promedio, habilitamos el certificado
            if ((course as any).inscripcion?.estado_nota === 'APROBADO') {
                setExamStatus('passed')
            }
        }
    }, [course, setCourse, setExamenId, setExamStatus])

    // Verificar si el estudiante ya aprobó el examen
    useEffect(() => {
        const checkExamStatus = async () => {
            if (!examenId || !storeCourse) return

            try {
                const res = await axios.get(`/api/estudiante/examen/${examenId}`)

                if (res.data.status && res.data.result.yaAprobado) {
                    setExamStatus('passed')
                }
            } catch {
                // Silenciar error si el examen aún no está disponible
            }
        }

        if (mounted) checkExamStatus()
    }, [examenId, storeCourse, setExamStatus, mounted])

    // Sincronizar lección inicial si se proporciona
    useEffect(() => {
        if (initialLessonId && mounted) {
            setCurrentLessonId(initialLessonId)
        }
    }, [initialLessonId, setCurrentLessonId, mounted])

    // Encontrar la lección actual y las adyacentes (memoizado para evitar recálculos)
    const flatLessons = useMemo(
        () => storeCourse?.modulos.flatMap(m => m.lecciones) || [],
        [storeCourse?.modulos]
    )

    const currentIndex = useMemo(
        () => flatLessons.findIndex(l => l.id === currentLessonId),
        [flatLessons, currentLessonId]
    )

    const currentLesson = currentIndex >= 0 ? flatLessons[currentIndex] : undefined

    const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : undefined
    const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : undefined

    useEffect(() => {
        if (!mounted) return

        if (isMobile) {
            setSidebarOpen(false)
        } else {
            setSidebarOpen(true)
        }
    }, [isMobile, mounted])

    const handleLessonSelect = (lessonId: string) => {
        setCurrentLessonId(lessonId)

        if (isMobile) {
            setMobileTab(0)
        }
    }

    const handleLessonComplete = async (lessonId: string, completed: boolean = true) => {
        updateLessonProgress(lessonId, completed)

        try {
            const { goToNextLesson: storeGoToNextLesson } = useCourseStore.getState()

            const response = await axios.post('/api/estudiante/progreso', {
                leccionId: lessonId,
                estaCompletado: completed
            })

            if (response.data.status) {
                if (response.data.result?.porcentaje !== undefined) {
                    updateLessonProgress(lessonId, completed, response.data.result.porcentaje)
                }

                if (completed) {
                    toast.success('¡Lección completada!', {
                        position: 'bottom-right',
                        autoClose: 2000,
                        hideProgressBar: true
                    })
                    setTimeout(() => {
                        storeGoToNextLesson()
                    }, 1500)
                }
            } else {
                updateLessonProgress(lessonId, !completed)
                toast.error('No se pudo actualizar el progreso')
            }
        } catch (error) {
            updateLessonProgress(lessonId, !completed)
            console.error('Error al actualizar progreso:', error)
            toast.error('Error de conexión al actualizar progreso')
        }
    }

    const handleVideoEnded = () => {
        if (currentLesson && !currentLesson.completada) {
            handleLessonComplete(currentLesson.id, true)
        }
    }

    const handleExamPassed = () => {
        if (currentExamenId === examenId) {
            setExamStatus('passed')
        }
    }

    const handleContinueAfterExam = () => {
        if (!storeCourse || !currentExamenId) return;

        const allItems: any[] = [];
        storeCourse.modulos.forEach(module => {
            const moduleItems = [
                ...module.lecciones.map(l => ({ ...l, tipo: 'leccion' })),
                ...(storeCourse.examenes || [])
                    .filter(ex => ex.modulo_id === module.id && ex.tipo === 'INTERMEDIO')
                    .map(ex => ({ ...ex, tipo: 'examen' }))
            ].sort((a, b) => (a.orden || 0) - (b.orden || 0));

            allItems.push(...moduleItems);
        });

        const currentIndex = allItems.findIndex(item => item.id === currentExamenId);

        if (currentIndex !== -1 && currentIndex < allItems.length - 1) {
            const nextItem = allItems[currentIndex + 1];
            if (nextItem.tipo === 'leccion') {
                setCurrentLessonId(nextItem.id);
            } else {
                const { openExam } = useCourseStore.getState();
                openExam(nextItem.id);
            }
        } else {
            // Fallback si no hay siguiente item
            const firstLesson = storeCourse.modulos[0]?.lecciones[0];
            if (firstLesson) setCurrentLessonId(firstLesson.id);
        }
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setMobileTab(newValue)
    }

    const renderMainContent = () => {
        if (currentView === 'exam' && currentExamenId) {
            return (
                <Grid item xs={12} key="exam-section">
                    <ExamSection
                        examenId={currentExamenId}
                        onExamPassed={handleExamPassed}
                        isFinalExam={currentExamenId === examenId}
                        onContinue={handleContinueAfterExam}
                    />
                </Grid>
            )
        }

        if (currentView === 'completion' && storeCourse) {
            return (
                <Grid item xs={12} key="completion-section">
                    <CompletionSummary cursoId={storeCourse.id} />
                </Grid>
            )
        }

        if (currentView === 'certificate' && storeCourse) {
            return (
                <Grid item xs={12} key="certificate-section">
                    <CertificateSection cursoId={storeCourse.id} />
                </Grid>
            )
        }

        return (
            <>
                {/* Video fijo en la parte superior en móvil o Placeholder de Clase en Vivo */}
                <Grid item xs={12} key={`video-container-${currentLesson?.id || 'no-lesson'}`} sx={{
                    p: 0,
                    position: { xs: 'sticky', md: 'relative' },
                    top: 0,
                    zIndex: 6,
                    bgcolor: 'black'
                }}>
                    {currentLesson?.es_en_vivo ? (
                        <LiveLessonPlaceholder
                            titulo={currentLesson.titulo}
                            esEnVivo={true}
                            fechaProgramada={currentLesson.fecha_programada}
                            enlaceReunion={currentLesson.enlace_reunion}
                        />
                    ) : (
                        <VideoPlayer url={currentLesson?.video_url || undefined} tipo="VIDEO" onEnded={handleVideoEnded} />
                    )}
                </Grid>

                {/* Tabs fijos debajo del video en móvil */}
                <Grid item xs={12} sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    position: { xs: 'sticky', md: 'relative' },
                    top: { xs: 'calc((100vw * 9) / 16)', md: 0 },
                    zIndex: 5,
                    px: { xs: 0, sm: 0 },
                    mb: 1
                }}>
                    <Tabs
                        value={mobileTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            '& .MuiTab-root': {
                                fontSize: { xs: '0.875rem', md: '1rem' },
                                fontWeight: 700,
                                py: { xs: 1.5, md: 2.5 }
                            }
                        }}
                    >
                        <Tab label="Lección" />
                        <Tab label="Comentarios" />
                        {isMobile && <Tab label="Temario" />}
                    </Tabs>
                </Grid>

                <Grid item xs={12} sx={{ pt: 2, px: { xs: 2, sm: 0 }, pb: { xs: 4, md: 0 } }}>
                    {/* Botones Anterior / Completado / Siguiente */}
                    <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Button
                            variant="outlined"
                            disabled={!prevLesson}
                            startIcon={<i className="tabler-chevron-left" />}
                            onClick={() => prevLesson && handleLessonSelect(prevLesson.id)}
                            sx={{ borderRadius: 2 }}
                        >
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Anterior</Box>
                        </Button>

                        {currentLesson && (
                            <Button
                                variant={currentLesson.completada ? 'outlined' : 'contained'}
                                color={currentLesson.completada ? 'success' : 'primary'}
                                startIcon={<i className={currentLesson.completada ? 'tabler-circle-check-filled' : 'tabler-circle-check'} />}
                                onClick={() => handleLessonComplete(currentLesson.id, !currentLesson.completada)}
                                sx={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
                            >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                    {currentLesson.completada ? 'Completado' : 'Marcar como terminado'}
                                </Box>
                                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                                    {currentLesson.completada ? 'Completado' : 'Terminar'}
                                </Box>
                            </Button>
                        )}

                        <Button
                            variant="outlined"
                            disabled={!nextLesson}
                            endIcon={<i className="tabler-chevron-right" />}
                            onClick={() => nextLesson && handleLessonSelect(nextLesson.id)}
                            sx={{ borderRadius: 2 }}
                        >
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>Siguiente</Box>
                        </Button>
                    </Stack>

                    {/* Renderizamos el contenido según la pestaña activa */}
                    {mobileTab === 0 && currentLesson ? (
                        <Box sx={{ mt: 1 }}>
                            <LessonContent
                                id={currentLesson.id}
                                titulo={currentLesson.titulo}
                                descripcion={currentLesson.contenido || undefined}
                                recursos={currentLesson.recursos || []}
                            />
                        </Box>
                    ) : null}

                    {mobileTab === 1 && currentLesson ? (
                        <Box sx={{ mt: 1 }}>
                            <CommentsSection leccionId={currentLesson.id} />
                        </Box>
                    ) : null}

                    {/* En mobile, si seleccionamos Temario (Tab 2) */}
                    {isMobile && mobileTab === 2 ? (
                        <Box sx={{ mt: 0 }}>
                            <CourseContentSidebar onLessonSelect={handleLessonSelect} />
                        </Box>
                    ) : null}
                </Grid>
            </>
        )
    }

    // Prevents SSR Hydration mismatch that breaks the drawer and layout in mobile
    if (!mounted) {
        return null
    }

    return (
        <Box sx={{
            display: 'flex',
            height: 'calc(100dvh - 64px)',
            overflow: 'hidden',
            position: 'relative',

            // En móviles, forzamos 100vw y lo centramos para anular totalmente el padding del layout padre
            ml: { xs: 'calc(50% - 50vw)', md: 0 },
            mr: { xs: 'calc(50% - 50vw)', md: 0 },
            mt: { xs: -3, md: 0 },
            width: { xs: '100vw', md: '100%' }
        }}>
            <style>{`
                footer { display: none !important; }
            `}</style>

            {/* Contenido principal */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: { xs: 'auto', md: 'scroll' },
                    overflowX: 'hidden',
                    p: { xs: 0, md: 3, lg: 4 },
                    transition: 'margin 0.3s',
                    mr: sidebarOpen && !isMobile ? '350px' : 0
                }}
            >
                <Container disableGutters maxWidth={false} sx={{ px: { xs: 0, sm: 2, md: 4 }, py: { xs: 0, md: 2 } }}>
                    <Grid container spacing={0}>
                        {renderMainContent()}
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
                    <CourseContentSidebar onLessonSelect={handleLessonSelect} />
                </Box>
            )}
        </Box>
    )
}

export default CoursePlayerView
