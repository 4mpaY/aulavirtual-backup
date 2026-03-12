'use client'

import React from 'react'

import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    LinearProgress,
    Divider,
    Button
} from '@mui/material'

import { useCourseStore } from '../store/useCourseStore'

interface CourseContentSidebarProps {
    onLessonSelect: (lessonId: string) => void
}

const CourseContentSidebar: React.FC<CourseContentSidebarProps> = ({
    onLessonSelect
}) => {
    const { 
        course, 
        currentLessonId, 
        progressPercentage,
        examStatus,
        examenId,
        currentView,
        setCurrentView
    } = useCourseStore()

    const modules = course?.modulos || []

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Contenido del curso</Typography>
                
                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Tu progreso
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={800}>
                            {progressPercentage}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={progressPercentage} 
                        sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'action.hover',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4
                            }
                        }} 
                    />
                </Box>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {modules.map((module) => (
                    <Accordion
                        key={module.id}
                        defaultExpanded
                        disableGutters
                        elevation={0}
                        sx={{
                            '&:before': { display: 'none' },
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<i className="tabler-chevron-down" />}
                            sx={{ bgcolor: 'action.hover', px: 4 }}
                        >
                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                {module.titulo}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                            <List sx={{ p: 0 }}>
                                {module.lecciones.map((lesson) => (
                                    <ListItem key={lesson.id} disablePadding>
                                        <ListItemButton
                                            selected={currentLessonId === lesson.id && currentView === 'lesson'}
                                            onClick={() => onLessonSelect(lesson.id)}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                '&.Mui-selected': {
                                                    bgcolor: 'primary.50',
                                                    color: 'primary.main',
                                                    '&:hover': { bgcolor: 'primary.100' }
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                                                {lesson.completada ? (
                                                    <i 
                                                        className="tabler-circle-check-filled" 
                                                        style={{ 
                                                            color: 'var(--mui-palette-success-main)',
                                                            fontSize: '1.25rem' 
                                                        }} 
                                                    />
                                                ) : (
                                                    <i 
                                                        className="tabler-circle" 
                                                        style={{ fontSize: '1.25rem', opacity: 0.5 }} 
                                                    />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={lesson.titulo}
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: currentLessonId === lesson.id && currentView === 'lesson' ? 800 : 500
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}

                {/* Sección de Examen y Certificado */}
                {examenId && (
                    <>
                        <Divider />
                        <Box sx={{ p: 3 }}>
                            {examStatus === 'locked' && (
                                <Box sx={{ 
                                    p: 2.5, 
                                    borderRadius: '12px', 
                                    bgcolor: 'action.hover',
                                    textAlign: 'center'
                                }}>
                                    <i className="tabler-lock" style={{ fontSize: '1.5rem', opacity: 0.5 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontWeight: 600 }}>
                                        Completa todas las lecciones para acceder al examen
                                    </Typography>
                                </Box>
                            )}

                            {(examStatus === 'available' || examStatus === 'failed') && (
                                <Button
                                    fullWidth
                                    variant={currentView === 'exam' ? 'contained' : 'outlined'}
                                    color="warning"
                                    startIcon={<i className="tabler-clipboard-text" />}
                                    onClick={() => setCurrentView('exam')}
                                    sx={{ 
                                        borderRadius: '10px', 
                                        py: 1.5, 
                                        fontWeight: 700,
                                        textTransform: 'none'
                                    }}
                                >
                                    📝 Realizar Examen Final
                                </Button>
                            )}

                            {examStatus === 'passed' && (
                                <Button
                                    fullWidth
                                    variant={currentView === 'certificate' ? 'contained' : 'outlined'}
                                    color="success"
                                    startIcon={<i className="tabler-certificate" />}
                                    onClick={() => setCurrentView('certificate')}
                                    sx={{ 
                                        borderRadius: '10px', 
                                        py: 1.5, 
                                        fontWeight: 700,
                                        textTransform: 'none'
                                    }}
                                >
                                    🎓 Ver Certificado
                                </Button>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    )
}

export default CourseContentSidebar

