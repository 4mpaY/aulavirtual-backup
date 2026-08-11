'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'

import { Box, Button, CircularProgress, Container, Stack, Typography, LinearProgress, Grid, Card, CardContent, Tooltip } from '@mui/material'

import axios from 'axios'
import Swal from 'sweetalert2'


export default function MisRutasPage() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    axios.get('/api/estudiante/mis-rutas')
      .then(res => {
        setData(res.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsError(true)
        setIsLoading(false)
      })
  }, [])

  const handleClaimCertificate = async (rutaId: string) => {
    try {
      const response = await axios.post('/api/estudiante/certificado/ruta', { ruta_id: rutaId })

      if (response.data.certificado) {
        Swal.fire({
          icon: 'success',
          title: '¡Felicidades!',
          text: 'Has reclamado exitosamente tu certificado de ruta.',
          confirmButtonColor: '#006F65'
        }).then(() => {
          router.push('/estudiante/mis-certificados')
        })
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'No se pudo reclamar el certificado.',
        confirmButtonColor: '#006F65'
      })
    }
  }

  const rutas = data?.rutas || []

  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                Mis <span style={{ color: 'var(--mui-palette-primary-main)' }}>Rutas</span>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                Sigue tu progreso en cada ruta y obtén tu certificado integral.
              </Typography>
            </Box>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : isError ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h5" color="error" sx={{ fontWeight: 700 }}>
                No se pudieron cargar tus rutas
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Intenta recargar la página en unos momentos.
              </Typography>
            </Box>
          ) : rutas.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant="h6" color="text.secondary">
                Aún no estás inscrito en ninguna ruta.
              </Typography>
              <Button variant="contained" component={Link} href="/rutas" size="large" sx={{ mt: 2 }}>
                Explorar Rutas
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {rutas.map((ruta: any) => (
                <Grid item xs={12} md={6} lg={4} key={ruta.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ flexGrow: 1, p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Link href={`/rutas/${ruta.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Typography variant="h5" sx={{ fontWeight: 800, '&:hover': { color: 'primary.main' }, transition: 'color 0.2s' }}>
                            {ruta.titulo}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {ruta.escuela?.nombre}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" fontWeight="700">Progreso</Typography>
                          <Typography variant="body2" fontWeight="700">{ruta.progreso}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={ruta.progreso} 
                          sx={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.05)', mb: 2 }} 
                        />
                        <Button
                          component={Link}
                          href={`/rutas/${ruta.slug}`}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ borderRadius: '8px', fontWeight: 600 }}
                        >
                          Ver cursos de la ruta
                        </Button>
                      </Box>
                      
                      <Box sx={{ mt: 3 }}>
                        <Tooltip title={!ruta.completado ? "Debes completar y reclamar los certificados de todos los cursos de esta ruta para poder obtener el certificado integral de la ruta." : ""} placement="top" arrow>
                          <span>
                            <Button 
                              fullWidth 
                              variant={ruta.completado ? 'contained' : 'outlined'} 
                              color="primary"
                              disabled={!ruta.completado}
                              onClick={() => handleClaimCertificate(ruta.id)}
                              sx={{ borderRadius: '8px', py: 1.2, fontWeight: 700 }}
                            >
                              {ruta.completado ? 'Reclamar Certificado' : 'Certificado'}
                            </Button>
                          </span>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
