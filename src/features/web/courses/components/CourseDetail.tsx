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
    Paper,
    Breadcrumbs
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
            <Box sx={{
                position: 'relative',
                bgcolor: '#0f172a', // Dark base to make colors pop
                pt: { xs: 4, md: 6 },
                pb: { xs: 10, md: 16 },
                minHeight: { md: '650px' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderBottom: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
            }}>
                {/* Background Blur Image - More prominent */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${course.miniatura || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(40px)', // Reduced blur for more definition
                        opacity: 0.4, // Increased opacity
                        transform: 'scale(1.1)',
                        zIndex: 0
                    }}
                />

                {/* Darker Overlay for Contrast */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%)',
                        zIndex: 0
                    }}
                />

                <Container maxWidth={false} sx={{ px: { xs: 4, md: 8, lg: 12 }, position: 'relative', zIndex: 1 }}>
                    {/* Breadcrumbs inside Hero */}
                    <Box sx={{ mb: 6, mt: 2 }}>
                        <Breadcrumbs
                            separator={<i className="tabler-chevron-right" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }} />}
                            aria-label="breadcrumb"
                        >
                            <Link
                                href="/"
                                style={{
                                    textDecoration: 'none',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.95rem',
                                    fontWeight: 500
                                }}
                            >
                                Inicio
                            </Link>
                            <Link
                                href="/cursos"
                                style={{
                                    textDecoration: 'none',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '0.95rem',
                                    fontWeight: 500
                                }}
                            >
                                Cursos
                            </Link>
                            {course.categoria && (
                                <Typography
                                    sx={{
                                        color: 'rgba(255,255,255,0.6)',
                                        fontSize: '0.95rem',
                                        fontWeight: 500
                                    }}
                                >
                                    {course.categoria.nombre}
                                </Typography>
                            )}
                            <Typography
                                sx={{
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    fontWeight: 700
                                }}
                            >
                                {course.titulo}
                            </Typography>
                        </Breadcrumbs>
                    </Box>

                    <Grid container spacing={6} alignItems="center">
                        {/* Left: Featured Image */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: '32px',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)', // Stronger shadow
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
                                    <Chip label={course.nivel === 'BASICO' ? 'Intermedio' : 'Avanzado'} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 600 }} />
                                    <Chip label={course.tipo_emision === 'MIXTO' ? 'Mixto' : 'Sincrónico'} size="small" sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }} />
                                </Stack>

                                <Typography variant="h2" component="h1" sx={{ fontWeight: 900, color: 'white', lineHeight: 1.1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                                    {course.titulo}
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                                                <i className="tabler-user" style={{ fontSize: '1.4rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Docente</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>{course.profesor.nombre} {course.profesor.apellido}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                                                <i className="tabler-calendar" style={{ fontSize: '1.4rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Inicio</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>07/04/2026</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                                                <i className="tabler-users" style={{ fontSize: '1.4rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Inscritos</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>70 alumnos</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', width: 44, height: 44 }}>
                                                <i className="tabler-clock" style={{ fontSize: '1.4rem' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }} display="block">Duración</Typography>
                                                <Typography variant="body1" sx={{ fontWeight: 700, color: 'white', fontSize: '1.1rem' }}>4 Semanas</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#4ade80', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                                        {course.es_gratis ? 'S/. 0.00' : `${course.moneda} ${course.precio}`}
                                    </Typography>
                                    {!course.es_gratis && (
                                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>
                                            {course.moneda} {(course.precio * 1.5).toFixed(2)}
                                        </Typography>
                                    )}
                                </Box>

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

                    {/* Benefit Highlights Cards - Now inside Hero */}
                    <Box sx={{ mt: 8 }}>
                        <Grid container spacing={3}>
                            {(course.beneficios?.length ? course.beneficios : [
                                { title: 'Clase en vivo', desc: 'Clases 100% en vivo por la plataforma de Zoom.', icon: 'tabler-video' },
                                { title: 'Seguimiento personalizado', desc: 'Apoyo y soporte de la coordinadora académica.', icon: 'tabler-headset' },
                                { title: 'Plataforma virtual', desc: 'Acceso 24/7 durante la duración del programa.', icon: 'tabler-device-laptop' },
                                { title: 'Certificado Opcional', desc: 'Podrás solicitarlo durante o al finalizar el curso.', icon: 'tabler-certificate' }
                            ]).map((item, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            borderRadius: '24px',
                                            bgcolor: 'rgba(255, 255, 255, 0.05)', // Transparent white
                                            backdropFilter: 'blur(10px)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            transition: 'transform 0.2s',
                                            '&:hover': { transform: 'translateY(-5px)', bgcolor: 'rgba(255, 255, 255, 0.08)' }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: 'rgba(74, 222, 128, 0.1)',
                                                color: '#4ade80',
                                                mb: 2
                                            }}
                                        >
                                            <i className={item.icon} style={{ fontSize: '1.5rem' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>{item.title}</Typography>
                                            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{item.desc}</Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth={false} sx={{ mt: 6, px: { xs: 4, md: 8, lg: 12 } }}>
                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            {/* Methodology Section */}
                            <Paper sx={{ p: 4, borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h3" align="center" sx={{ fontWeight: 900, mb: 1 }}>
                                    Metodología de <span style={{ color: 'primary.main' }}>Aprendizaje</span>
                                </Typography>
                                <Typography variant="h6" align="center" sx={{ color: '#475569', mb: 5, fontWeight: 500 }}>
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
                                                <Avatar sx={{ bgcolor: 'success.50', color: 'success.main', width: 70, height: 70 }}>
                                                    <i className={m.icon} style={{ fontSize: '2.5rem' }} />
                                                </Avatar>
                                                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                                                    {m.title}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>

                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    Objetivos del <span style={{ color: 'primary.main' }}>curso</span>
                                </Typography>
                                <Stack spacing={2}>
                                    {(course.objetivos?.length ? course.objetivos : [
                                        'Formar profesionales capaces de aplicar metodologías avanzadas para transformar procesos reales.',
                                        'Aprender flujos de trabajo eficientes desde el inicio hasta el despliegue final.',
                                        'Identificar causas raíz y optimizar el rendimiento utilizando herramientas de última generación.'
                                    ]).map((text, idx) => (
                                        <Stack key={idx} direction="row" spacing={2} alignItems="flex-start">
                                            <i className="tabler-check" style={{ color: '#4ade80', marginTop: '4px', fontSize: '1.4rem', fontWeight: 900 }} />
                                            <Typography variant="h6" sx={{ color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{text}</Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>

                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 800, mb: 4 }}>
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
                                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>{modulo.titulo}</Typography>
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
                                                                        primaryTypographyProps={{ variant: 'body1', fontWeight: 600 }}
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
                                <Typography variant="body2" align="center" sx={{ color: '#475569', mb: 3, fontWeight: 600 }}>
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
                                            <Typography variant="body1" sx={{ color: benefit.active ? 'text.primary' : 'text.secondary', fontWeight: benefit.active ? 600 : 400 }}>
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
