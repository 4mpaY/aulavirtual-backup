'use client'

import React from 'react'

import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material'

import CourseCard from './CourseCard'

interface CourseListProps {
    courses: any[]
    loading?: boolean
    error?: string | null
}

const CourseList: React.FC<CourseListProps> = ({ courses, loading, error }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Box sx={{ py: 5 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        )
    }

    if (courses.length === 0) {
        return (
            <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500 }}>
                    No encontramos cursos que coincidan con tu búsqueda.
                </Typography>
                <Typography variant="body1" color="text.disabled" sx={{ mt: 1 }}>
                    Prueba con otras palabras clave o categorías.
                </Typography>
            </Box>
        )
    }

    return (
        <Box sx={{ py: 2 }}>
            <Grid container spacing={4}>
                {courses.map((course) => (
                    <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
                        <CourseCard
                            id={course.id}
                            titulo={course.titulo}
                            slug={course.slug}
                            descripcion={course.descripcion}
                            miniatura={course.miniatura}
                            precio={Number(course.precio)}
                            moneda={course.moneda}
                            es_gratis={course.es_gratis}
                            profesor={{
                                nombre: course.profesor.nombre,
                                apellido: course.profesor.apellido,
                                avatar: course.profesor.avatar
                            }}
                            categoria={course.categoria}
                            nivel={course.nivel}
                            tipo_emision={course.tipo_emision}
                            _count={course._count}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default CourseList
