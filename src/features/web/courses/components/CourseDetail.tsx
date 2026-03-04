'use client'

import React from 'react'

import Link from 'next/link'

import {
    Container,
    Grid,
    Typography,
    Box,
    Stack,
    Chip,
    Avatar,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Paper
} from '@mui/material'

interface Leccion {
    id: string
    titulo: string
    duracion?: number
}

interface Modulo {
    id: string
    titulo: string
    lecciones: Leccion[]
}

interface CourseDetailProps {
    course: {
        id: string
        titulo: string
        slug: string
        descripcion?: string
        miniatura?: string
        precio: number
        moneda: string
        es_gratis: boolean
        nivel: string
        tipo_emision: string
        profesor: {
            nombre: string
            apellido: string
            avatar?: string
            profesion?: string
        }
        categoria?: {
            nombre: string
        }
        modulos: Modulo[]
        objetivos?: string[]
        metodologia?: any[]
        beneficios?: any[]
        incluye?: any[]
    }
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
    return (
        <Box sx={{ pb: 10, bgcolor: '#f8fafc' }}>
            {/* New Premium Hero Section */}
            <Box sx={{ bgcolor: 'white', pt: { xs: 4, md: 8 }, pb: { xs: 6, md: 10 }, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        {/* Left: Featured Image */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                                    aspectRatio: '16/9'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={course.miniatura || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                {course.es_gratis && (
                                    <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                                        <Chip label="CURSO GRATUITO" color="success" sx={{ fontWeight: 800, px: 1 }} />
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        {/* Right: Course Core Info */}
                        <Grid item xs={12} md={6}>
                            <Stack spacing={3}>
                                <Stack direction="row" spacing={1}>
                                    <Chip label={course.nivel === 'BASICO' ? 'Intermedio' : 'Avanzado'} size="small" sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 600 }} />
                                    <Chip label={course.tipo_emision === 'MIXTO' ? 'Mixto' : 'Sincrónico'} size="small" sx={{ bgcolor: 'secondary.50', color: 'secondary.main', fontWeight: 600 }} />
                                </Stack>

                                <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
                                    {course.titulo}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'success.50', color: 'success.main', width: 36, height: 36 }}>
                                                <i className="tabler-user" style={{ fontSize: '1.2rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">Docente</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{course.profesor.nombre} {course.profesor.apellido}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'warning.50', color: 'warning.main', width: 36, height: 36 }}>
                                                <i className="tabler-calendar" style={{ fontSize: '1.2rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">Inicio</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>07/04/2026</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'info.50', color: 'info.main', width: 36, height: 36 }}>
                                                <i className="tabler-users" style={{ fontSize: '1.2rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">Inscritos</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>70 alumnos</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'error.50', color: 'error.main', width: 36, height: 36 }}>
                                                <i className="tabler-clock" style={{ fontSize: '1.2rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" display="block">Duración</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>4 Semanas</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main', mt: 2 }}>
                                    {course.es_gratis ? 'S/. 0.00' : `${course.moneda} ${course.precio}`}
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    size="large"
                                    component={Link}
                                    href={`/checkout/${course.slug}`}
                                    sx={{
                                        py: 2,
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        boxShadow: '0 8px 20px rgba(46, 125, 50, 0.2)',
                                        textTransform: 'none'
                                    }}
                                >
                                    Matricúlate
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Benefit Highlights Cards */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {(course.beneficios?.length ? course.beneficios : [
                        { title: 'Clase en vivo', desc: 'Clases 100% en vivo por la plataforma de Zoom.', icon: 'tabler-video' },
                        { title: 'Seguimiento personalizado', desc: 'Apoyo y soporte de la coordinadora académica.', icon: 'tabler-headset' },
                        { title: 'Plataforma virtual', desc: 'Acceso 24/7 durante la duración del programa.', icon: 'tabler-device-laptop' },
                        { title: 'Certificado Opcional', desc: 'Podrás solicitarlo durante o al finalizar el curso.', icon: 'tabler-file-certificate' }
                    ]).map((item, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Paper
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: '20px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    gap: 2,
                                    border: '1px solid transparent',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-5px)', borderColor: 'success.light' }
                                }}
                            >
                                <Box sx={{ p: 1.5, bgcolor: 'success.50', color: 'success.main', borderRadius: '12px' }}>
                                    <i className={item.icon} style={{ fontSize: '2rem' }} />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>{item.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Container maxWidth="lg" sx={{ mt: 6 }}>
                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Methodology Section */}
                            <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 1 }}>
                                    Metodología de <span style={{ color: 'primary.main' }}>Aprendizaje</span>
                                </Typography>
                                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                                    Basado en la experiencia del profesional
                                </Typography>

                                <Grid container spacing={2}>
                                    {(course.metodologia?.length ? course.metodologia : [
                                        { title: 'Presentación de clase', icon: 'tabler-presentation' },
                                        { title: 'Material de clases y adicionales', icon: 'tabler-folder' },
                                        { title: 'Discusión y/o solución de casos reales', icon: 'tabler-messages' }
                                    ]).map((m, i) => (
                                        <Grid item xs={12} md={4} key={i}>
                                            <Box sx={{
                                                p: 3,
                                                bgcolor: 'white',
                                                borderRadius: '20px',
                                                border: '1px solid #f1f5f9',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                textAlign: 'center',
                                                gap: 2
                                            }}>
                                                <Avatar sx={{ bgcolor: 'success.50', color: 'success.main', width: 60, height: 60 }}>
                                                    <i className={m.icon} style={{ fontSize: '2rem' }} />
                                                </Avatar>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                                                    {m.title}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>

                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    Objetivos del <span style={{ color: 'primary.main' }}>curso</span>
                                </Typography>
                                <Stack spacing={2}>
                                    {(course.objetivos?.length ? course.objetivos : [
                                        'Formar profesionales capaces de aplicar metodologías avanzadas para transformar procesos reales.',
                                        'Aprender flujos de trabajo eficientes desde el inicio hasta el despliegue final.',
                                        'Identificar causas raíz y optimizar el rendimiento utilizando herramientas de última generación.'
                                    ]).map((text, idx) => (
                                        <Stack key={idx} direction="row" spacing={2} alignItems="flex-start">
                                            <i className="tabler-check" style={{ color: 'primary.main', marginTop: '4px', fontSize: '1.2rem' }} />
                                            <Typography variant="body1" color="text.secondary">{text}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                    Contenido del curso
                                </Typography>
                                {course.modulos.length > 0 ? (
                                    <Stack spacing={1}>
                                        {course.modulos.map((modulo, index) => (
                                            <Accordion
                                                key={modulo.id}
                                                defaultExpanded={index === 0}
                                                sx={{
                                                    borderRadius: '16px !important',
                                                    boxShadow: 'none',
                                                    border: '1px solid',
                                                    borderColor: '#e2e8f0',
                                                    bgcolor: 'white',
                                                    '&:before': { display: 'none' }
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<i className="tabler-chevron-down" />}
                                                    sx={{ px: 3, py: 1 }}
                                                >
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Box sx={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: '8px',
                                                            bgcolor: 'success.50',
                                                            color: 'success.main',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontWeight: 700,
                                                            fontSize: '0.875rem'
                                                        }}>
                                                            {index + 1}
                                                        </Box>
                                                        <Typography sx={{ fontWeight: 600 }}>{modulo.titulo}</Typography>
                                                    </Stack>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ p: 0 }}>
                                                    <List disablePadding>
                                                        {modulo.lecciones.map((leccion) => (
                                                            <React.Fragment key={leccion.id}>
                                                                <Divider />
                                                                <ListItem sx={{ py: 2, px: 3 }}>
                                                                    <ListItemIcon sx={{ minWidth: 40 }}>
                                                                        <i className="tabler-player-play" style={{ color: 'primary.main' }} />
                                                                    </ListItemIcon>
                                                                    <ListItemText
                                                                        primary={leccion.titulo}
                                                                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                                                    />
                                                                    {leccion.duracion && (
                                                                        <Typography variant="caption" color="text.disabled">
                                                                            {leccion.duracion} min
                                                                        </Typography>
                                                                    )}
                                                                </ListItem>
                                                            </React.Fragment>
                                                        ))}
                                                    </List>
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Stack>
                                ) : (
                                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'white', borderRadius: '16px' }}>
                                        <Typography color="text.secondary">Aún no hay módulos publicados para este curso.</Typography>
                                    </Paper>
                                )}
                            </Box>
                        </Stack>
                    </Grid>

                    {/* New Premium Sidebar */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ position: { md: 'sticky' }, top: 100 }}>
                            <Paper sx={{ p: 4, borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                                <Typography variant="h6" align="center" sx={{ fontWeight: 800, color: 'success.main', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Programa {course.es_gratis ? 'Gratuito' : 'Premium'}
                                </Typography>
                                <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3, fontWeight: 600 }}>
                                    Regular
                                </Typography>

                                <Stack spacing={1.5} sx={{ mb: 4 }}>
                                    {(course.incluye?.length ? course.incluye : [
                                        { text: 'Clases en vivo', active: true },
                                        { text: 'Clases grabadas', active: true },
                                        { text: 'Comunidad del curso', active: true },
                                        { text: 'Materiales de clase / Adicionales', active: true },
                                        { text: 'Seguimiento académico', active: true },
                                        { text: 'Evaluación programada', active: true },
                                        { text: 'Evaluación en Cualquier momento', active: false },
                                        { text: 'Recuperación de evaluación', active: false },
                                        { text: 'Certificado por Ecoambiental o CIP', active: false }
                                    ]).map((benefit, i) => (
                                        <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                                            <i
                                                className={benefit.active ? "tabler-circle-check" : "tabler-circle-x"}
                                                style={{ color: benefit.active ? '#2e7d32' : '#ef4444', fontSize: '1.2rem' }}
                                            />
                                            <Typography variant="body2" sx={{ color: benefit.active ? 'text.primary' : 'text.secondary', fontWeight: benefit.active ? 500 : 400 }}>
                                                {benefit.text}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>

                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    size="large"
                                    component={Link}
                                    href={`/checkout/${course.slug}`}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        boxShadow: '0 4px 12px rgba(46, 125, 50, 0.15)',
                                        textTransform: 'none'
                                    }}
                                >
                                    Matricúlate
                                </Button>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default CourseDetail
