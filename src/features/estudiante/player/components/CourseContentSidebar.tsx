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
    Divider
} from '@mui/material'

interface Lesson {
    id: string
    titulo: string
    orden: number
    completada: boolean
}

interface Module {
    id: string
    titulo: string
    orden: number
    lecciones: Lesson[]
}

interface CourseContentSidebarProps {
    modules: Module[]
    currentLessonId?: string
    onLessonSelect: (lessonId: string) => void
}

const CourseContentSidebar: React.FC<CourseContentSidebarProps> = ({
    modules,
    currentLessonId,
    onLessonSelect
}) => {
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Contenido del curso</Typography>
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
                            sx={{ bgcolor: 'action.hover', px: 3 }}
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
                                            selected={currentLessonId === lesson.id}
                                            onClick={() => onLessonSelect(lesson.id)}
                                            sx={{
                                                px: 3,
                                                py: 1.5,
                                                '&.Mui-selected': {
                                                    bgcolor: 'primary.50',
                                                    color: 'primary.main',
                                                    '&:hover': { bgcolor: 'primary.100' }
                                                }
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                                                {lesson.completada ? (
                                                    <i className="tabler-circle-check-filled" style={{ color: 'var(--mui-palette-success-main)' }} />
                                                ) : (
                                                    <i className="tabler-circle" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={lesson.titulo}
                                                primaryTypographyProps={{
                                                    variant: 'body2',
                                                    fontWeight: currentLessonId === lesson.id ? 800 : 500
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Box>
    )
}

export default CourseContentSidebar
