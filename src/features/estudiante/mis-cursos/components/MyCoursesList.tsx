'use client'

import React from 'react'

import { Grid, Typography, Box } from '@mui/material'

import MyCourseCard from './MyCourseCard'

interface Course {
    id: string
    titulo: string
    slug: string
    miniatura?: string
    profesor: {
        nombre: string
        apellido: string
    }
    progreso: number
    categoria?: string
}

interface MyCoursesListProps {
    courses: Course[]
}

const MyCoursesList: React.FC<MyCoursesListProps> = ({ courses }) => {
    if (courses.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Aún no estas inscrito en ningún curso.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Explora nuestro catálogo y comienza a aprender hoy mismo.
                </Typography>
            </Box>
        )
    }

    return (
        <Grid container spacing={8}>
            {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                    <MyCourseCard
                        titulo={course.titulo}
                        slug={course.slug}
                        miniatura={course.miniatura}
                        profesor={course.profesor}
                        progreso={course.progreso}
                        categoria={course.categoria}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default MyCoursesList
