import React from 'react'

import Link from 'next/link'

import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Button,
  Avatar,
  Stack,
  Chip,
  Grid
} from '@mui/material'

import {
  CheckCircle2 as CheckCircleIcon,
  AlertCircle as ErrorIcon,
  Award as AwardIcon,
  Calendar as CalendarIcon,
  User as PersonIcon,
  FileSearch as HistoryIcon,
  ArrowLeft as ArrowBackIcon
} from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'

interface Props {
  params: {
    codigo: string
  }
}

export const dynamic = 'force-dynamic'

/**
 * Página pública de verificación de certificados
 */
export default async function VerificarCertificadoPage({ params }: Props) {
  const { codigo } = params

  const [certificado, configs] = await Promise.all([
    prisma.certificado.findUnique({
      where: { codigo_verificacion: codigo },
      include: {
        curso: {
          select: {
            titulo: true,
            slug: true,
            miniatura: true
          }
        },
        usuario: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      }
    }),
    getConfigs()
  ])

  const primaryColor = configs.PRIMARY_COLOR_MAIN
  const templateName = configs.TEMPLATE_NAME
  const logoUrl = configs.TEMPLATE_LOGO

  if (!certificado) {
    return (
      <Container maxWidth="sm" sx={{ py: 12 }}>
        <Paper
          elevation={4}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #fee2e2'
          }}
        >
          <ErrorIcon size={80} style={{ color: '#ef4444', marginBottom: '24px' }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
            Certificado No Válido
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            No hemos podido encontrar ningún certificado con el código <strong>{codigo}</strong> en nuestra base de datos.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon size={20} />}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 'bold',
              backgroundColor: primaryColor,
              '&:hover': { filter: 'brightness(0.85)' }
            }}
          >
            Volver al inicio
          </Button>
        </Paper>
      </Container>
    )
  }

  const snapshot = certificado.datos as any

  const nombreCompleto =
    (snapshot?.usuario?.nombre && snapshot?.usuario?.apellido)
      ? `${snapshot.usuario.nombre} ${snapshot.usuario.apellido}`
      : `${certificado.usuario?.nombre || ''} ${certificado.usuario?.apellido || ''}`.trim()

  const cursoTitulo = snapshot?.curso?.titulo || certificado.curso?.titulo
  const fechaEmisionVal = snapshot?.fechas?.emision || certificado.emitido_en

  const fechaEmision = new Date(fechaEmisionVal).toLocaleDateString('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        {logoUrl && (
          <Box component="img" src={logoUrl} alt={templateName} sx={{ height: 60, mb: 3, mx: 'auto' }} />
        )}
        <Typography variant="h5" fontWeight="medium" color="text.secondary">
          Sistema de Verificación de Certificados
        </Typography>
      </Box>

      <Paper
        elevation={10}
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: 6,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Adorno decorativo superior */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            bgcolor: primaryColor
          }}
        />

        <Stack spacing={4} alignItems="center">
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <CheckCircleIcon size={90} style={{ color: '#22c55e', marginBottom: '16px' }} />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 25,
                  right: 0,
                  bgcolor: 'white',
                  borderRadius: '50%',
                  p: 0.5,
                  display: 'flex',
                  boxShadow: 2
                }}
              >
                <AwardIcon size={24} style={{ color: '#fbbf24' }} />
              </Box>
            </Box>

            <Typography variant="h3" fontWeight={800} color="text.primary" sx={{
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 1
            }}>
              Certificado Verificado
            </Typography>
            <Chip
              icon={<HistoryIcon size={16} />}
              label={`Código: ${codigo}`}
              variant="outlined"
              sx={{ fontWeight: 'bold', px: 1 }}
            />
          </Box>

          <Divider sx={{ width: '100%', borderStyle: 'dashed' }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight="bold">
                    Estudiante
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                    <Avatar sx={{ bgcolor: primaryColor, width: 48, height: 48 }}>
                      <PersonIcon size={24} />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      {nombreCompleto}
                    </Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="overline" color="text.secondary" fontWeight="bold">
                    Fecha de Emisión
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                    <CalendarIcon size={20} style={{ color: '#64748b' }} />
                    <Typography variant="body1" fontWeight="medium">
                      {fechaEmision}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.05)',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.15)',
                  height: '100%'
                }}
              >
                <Typography variant="overline" color="text.secondary" fontWeight="bold">
                  Curso Completado
                </Typography>
                <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, mb: 2, lineHeight: 1.3 }}>
                  {cursoTitulo}
                </Typography>
                <Button
                  variant="text"
                  component={Link}
                  href={`/cursos/${certificado.curso?.slug || ''}`}
                  sx={{
                    color: primaryColor,
                    fontWeight: 'bold',
                    p: 0,
                    textTransform: 'none',
                    '&:hover': { background: 'transparent', textDecoration: 'underline' }
                  }}
                >
                  Ver detalles del programa
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 600 }}>
            <Typography variant="body2" color="text.secondary" fontStyle="italic">
              Este certificado es auténtico y ha sido emitido de forma digital.
              La integridad de este documento puede ser confirmada en este portal oficial de verificación.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon size={20} />}
            sx={{
              borderRadius: 3,
              px: 4,
              mt: 4,
              textTransform: 'none',
              fontWeight: 'bold',
              borderColor: 'divider',
              color: 'text.secondary'
            }}
          >
            Volver al inicio
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
