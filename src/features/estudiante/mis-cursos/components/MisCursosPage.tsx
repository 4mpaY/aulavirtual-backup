'use client'

import { Box, Button, CircularProgress, Container, Stack, Typography } from '@mui/material'

import MyCoursesList from './MyCoursesList'
import { useMisCursos } from '../hooks/useMisCursos'

export default function MisCursosPage() {
  const { data: courses = [], isLoading, isError } = useMisCursos()

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                Mis <span style={{ color: 'var(--mui-palette-primary-main)' }}>Cursos</span>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Gestiona tu aprendizaje y sigue tu progreso en cada curso.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'stretch', sm: 'flex-end' } }}>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ borderRadius: '10px' }}
                startIcon={<i className="tabler-certificate" />}
                href="/diplomados"
              >
                Diplomados
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ borderRadius: '10px' }}
                startIcon={<i className="tabler-school" />}
                href="/especializaciones"
              >
                Especializaciones
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                sx={{ borderRadius: '10px' }}
                startIcon={<i className="tabler-search" />}
                href="/cursos"
              >
                Explorar Cursos
              </Button>
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" color="error" sx={{ fontWeight: 700 }}>
                No se pudieron cargar tus cursos
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Intenta recargar la página en unos momentos.
              </Typography>
            </Box>
          ) : (
            <MyCoursesList courses={courses} />
          )}
        </Stack>
      </Container>
    </Box>
  )
}
