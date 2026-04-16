'use client'

import { useState, useMemo } from 'react'

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
    Button,
    InputAdornment
} from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { useCourseStore } from '../store/useCourseStore'

interface CourseContentSidebarProps {
    onLessonSelect: (lessonId: string) => void
}

const CourseContentSidebar = ({
    onLessonSelect
}: CourseContentSidebarProps) => {
    const {
        course,
        currentLessonId,
        currentExamenId,
        progressPercentage,
        examStatus,
        examenId,
        currentView,
        setCurrentView,
        openExam
    } = useCourseStore()

    const [searchQuery, setSearchQuery] = useState('')

    const filteredModules = useMemo(() => {
        const modules = course?.modulos || []

        if (!searchQuery.trim()) {
            return modules
        }

        const lowerQuery = searchQuery.toLowerCase()

        return modules
            .map(module => {
                const moduleMatches = module.titulo.toLowerCase().includes(lowerQuery)

                const matchedLessons = moduleMatches
                    ? module.lecciones
                    : module.lecciones.filter((l: any) => l.titulo.toLowerCase().includes(lowerQuery))

                if (matchedLessons.length > 0) {
                    return { ...module, lecciones: matchedLessons }
                }

                return null
            })
            .filter(Boolean) as any[]
    }, [course?.modulos, searchQuery])

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Contenido del curso</Typography>

                <Box sx={{ mt: 2, mb: 4 }}>
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

                <CustomTextField
                    fullWidth
                    size="small"
                    placeholder="Buscar video o clase..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <i className="tabler-search text-xl" />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery ? (
                            <InputAdornment position="end">
                                <i
                                    className="tabler-x text-xl cursor-pointer"
                                    onClick={() => setSearchQuery('')}
                                />
                            </InputAdornment>
                        ) : null
                    }}
                />
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {filteredModules.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No se encontraron lecciones con &quot;{searchQuery}&quot;
                        </Typography>
                    </Box>
                ) : (
                    filteredModules.map((module) => (
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
                                    {(() => {
                                        // Combinar y ordenar lecciones + exámenes del módulo
                                        const allItems = [
                                            ...(module.lecciones || []).map((l: any) => ({
                                                id: l.id,
                                                titulo: l.titulo,
                                                tipo: 'leccion',
                                                completada: l.completada,
                                                orden: l.orden || 0,
                                                ...l
                                            })),
                                            ...(course?.examenes || [])
                                                .filter((ex: any) => ex.modulo_id === module.id && ex.tipo === 'INTERMEDIO')
                                                .map((ex: any) => ({
                                                    id: ex.id,
                                                    titulo: ex.titulo,
                                                    tipo: 'examen',
                                                    completada: false, // Los exámenes no tienen estado "completada"
                                                    orden: ex.orden || 0,
                                                    progreso_minimo: ex.progreso_minimo,
                                                    ...ex
                                                }))
                                        ].sort((a, b) => (a.orden || 0) - (b.orden || 0))

                                        return allItems.map((item: any) => {
                                            const isLocked = item.tipo === 'examen' && progressPercentage < (item.progreso_minimo || 0)
                                            const isSelected = item.tipo === 'leccion'
                                                ? currentLessonId === item.id && currentView === 'lesson'
                                                : currentExamenId === item.id && currentView === 'exam'

                                            return (
                                                <ListItem key={item.id} disablePadding>
                                                    <ListItemButton
                                                        selected={isSelected}
                                                        onClick={() => {
                                                            if (item.tipo === 'leccion') {
                                                                onLessonSelect(item.id)
                                                            } else if (!isLocked) {
                                                                openExam(item.id)
                                                            }
                                                        }}
                                                        disabled={isLocked}
                                                        sx={{
                                                            px: 4,
                                                            py: 1.5,
                                                            '&.Mui-selected': {
                                                                bgcolor: 'primary.50',
                                                                color: 'primary.main',
                                                                '&:hover': { bgcolor: 'primary.100' }
                                                            },
                                                            '&.Mui-disabled': {
                                                                opacity: 0.6
                                                            }
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 28, color: 'inherit' }}>
                                                            {isLocked ? (
                                                                <i className="tabler-lock" style={{ fontSize: '1.25rem' }} />
                                                            ) : item.tipo === 'leccion' ? (
                                                                item.completada ? (
                                                                    <i className="tabler-circle-check-filled" style={{ color: 'var(--mui-palette-success-main)', fontSize: '1.25rem' }} />
                                                                ) : (
                                                                    <i className="tabler-circle" style={{ fontSize: '1.25rem', opacity: 0.5 }} />
                                                                )
                                                            ) : (
                                                                <i className="tabler-clipboard-check" style={{ color: 'var(--mui-palette-warning-main)', fontSize: '1.25rem' }} />
                                                            )}
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={item.titulo}
                                                            secondary={item.tipo === 'examen' ? `Peso ×${item.peso}` : undefined}
                                                            primaryTypographyProps={{
                                                                variant: 'body2',
                                                                fontWeight: isSelected ? 800 : 500
                                                            }}
                                                            secondaryTypographyProps={{
                                                                variant: 'caption'
                                                            }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                        })
                                    })()}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    )))}

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

                            {(examStatus === 'available' || examStatus === 'failed') && examenId && (
                                <Button
                                    fullWidth
                                    variant={currentView === 'exam' && currentExamenId === examenId ? 'contained' : 'outlined'}
                                    color="warning"
                                    startIcon={<i className="tabler-clipboard-text" />}
                                    onClick={() => openExam(examenId)}
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

