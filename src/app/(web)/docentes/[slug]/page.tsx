import React from 'react'

import { notFound } from 'next/navigation'
import Link from 'next/link'

import {
  Container,
  Box,
  Grid,
  Typography,
  Stack,
  Chip,
  Paper
} from '@mui/material'

import { Award, BookOpen, ArrowLeft } from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import DocenteAvatarImage from './DocenteAvatarImage'
import CursoCard from './CursoCard'

interface Props {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

async function getDocente(slug: string) {
  const docente = await prisma.usuario.findFirst({
    where: {
      OR: [
        { slug },
        { id: slug }
      ]
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      avatar: true,
      biografia: true,
      cargo: true,
      cursos_dictados: {
        where: { estado: 'PUBLICADO' },
        select: {
          id: true,
          titulo: true,
          slug: true,
          miniatura: true,
          precio: true,
          moneda: true,
          es_gratis: true,
          nivel: true,
          tipo_emision: true,
          categoria: {
            select: { nombre: true }
          }
        },
        orderBy: { creado_en: 'desc' }
      }
    }
  })

  if (!docente) return null

  // Serializar Decimal a Number para Client Components
  return {
    ...docente,
    cursos_dictados: docente.cursos_dictados.map((c: any) => ({
      ...c,
      precio: c.precio ? Number(c.precio) : 0,
      precio_oferta: c.precio_oferta ? Number(c.precio_oferta) : null
    }))
  }
}

export async function generateMetadata({ params }: Props) {
  const docente = await getDocente(params.slug)

  if (!docente) return { title: 'Docente no encontrado' }

  return {
    title: `${docente.nombre} ${docente.apellido} | Docente`,
    description: docente.cargo ?? `Perfil del docente ${docente.nombre} ${docente.apellido}`
  }
}

export default async function DocentePage({ params }: Props) {
  const docente = await getDocente(params.slug)

  if (!docente) notFound()

  const nombreCompleto = `${docente!.nombre} ${docente!.apellido}`

  // Extraer datos estructurados del JSON embebido
  let tituloEspecializacion = docente!.cargo || ''
  let bioDataStrucutred: any = null

  if (docente!.biografia) {
    const match = docente!.biografia.match(/<!--PROFESOR_BIO_JSON:(.*?)-->/)

    if (match) {
      try {
        bioDataStrucutred = JSON.parse(match[1])

        if (bioDataStrucutred.titulo) tituloEspecializacion = bioDataStrucutred.titulo
      } catch { }
    }
  }

  return (
    <Box sx={{ pb: 10, bgcolor: '#f8fafc', pt: 4 }}>
      {/* Hero del docente */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)',
          py: { xs: 8, md: 12 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decoración de fondo */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 60% 50%, rgba(var(--web-primary-rgb, 37, 146, 127),0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <Link
            href="/cursos"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: 32
            }}
          >
            <ArrowLeft size={16} />
            Volver a cursos
          </Link>

          <Grid container spacing={6} alignItems="center">
            {/* Avatar — componente cliente que maneja onError */}
            <Grid item xs={12} md="auto">
              <Box sx={{ mx: { xs: 'auto', md: 0 }, width: 'fit-content' }}>
                <DocenteAvatarImage
                  src={docente!.avatar}
                  alt={nombreCompleto}
                  size={200}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md>
              <Stack spacing={2} alignItems={{ xs: 'center', md: 'flex-start' }}>
                <Chip
                  label="Docente"
                  size="small"
                  sx={{ bgcolor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.15)', color: 'var(--web-primary, #25927F)', fontWeight: 700, borderRadius: 2 }}
                />
                <Typography
                  variant="h2"
                  sx={{ fontWeight: 900, color: 'white', lineHeight: 1.1, textAlign: { xs: 'center', md: 'left' } }}
                >
                  {nombreCompleto}
                </Typography>
                {tituloEspecializacion && (
                  <Typography
                    variant="h6"
                    sx={{ color: '#94a3b8', fontWeight: 600, textAlign: { xs: 'center', md: 'left' } }}
                  >
                    {tituloEspecializacion}
                  </Typography>
                )}
                <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BookOpen size={18} color="#94a3b8" />
                    <Typography sx={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>
                      {docente!.cursos_dictados.length} curso{docente!.cursos_dictados.length !== 1 ? 's' : ''} publicado{docente!.cursos_dictados.length !== 1 ? 's' : ''}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>

          {/* Columna izquierda: Biografía */}
          <Grid item xs={12} md={7}>
            {docente!.biografia && (
              <ScrollReveal>
                <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', mb: 4 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                    <Award size={22} color="var(--web-primary, #25927F)" />
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      Sobre el docente
                    </Typography>
                  </Stack>
                  <Box
                    sx={{
                      color: '#475569',
                      fontSize: '1rem',
                      lineHeight: 1.75,
                      '& h2': {
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        mt: 4,
                        mb: 1.5,
                        color: '#1e293b',
                        textTransform: 'uppercase',
                        letterSpacing: '0.025em',
                        borderLeft: '4px solid var(--web-primary, #25927F)',
                        pl: 2
                      },
                      '& p': { mb: 2 },
                      '& strong': { color: '#1e293b' }
                    }}
                  >
                    {bioDataStrucutred ? (
                      <>
                        {/* Descripción Profesional */}
                        {bioDataStrucutred.descripcion && (
                          <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h2">
                              Descripción Profesional
                            </Typography>
                            <Typography sx={{ color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                              {bioDataStrucutred.descripcion}
                            </Typography>
                          </Box>
                        )}

                        {/* Formación Académica */}
                        {bioDataStrucutred.especificaciones && (
                          <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" component="h2">
                              Formación Académica
                            </Typography>
                            <Typography sx={{ color: '#475569', whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                              {bioDataStrucutred.especificaciones}
                            </Typography>
                          </Box>
                        )}

                        {/* Formación Complementaria */}
                        {bioDataStrucutred.formacion_complementaria && bioDataStrucutred.formacion_complementaria.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" component="h2">
                              Formación Complementaria
                            </Typography>
                            <Box component="ul" sx={{ pl: 3, m: 0 }}>
                              {bioDataStrucutred.formacion_complementaria.map((f: any, i: number) => (
                                <Box component="li" key={i} sx={{ mb: 1 }}>
                                  <Typography component="span" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                    {f.titulo}
                                  </Typography>
                                  {f.institucion && ` | ${f.institucion}`}
                                  {f.anio && ` | ${f.anio}`}
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        )}
                      </>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: docente!.biografia }} />
                    )}
                  </Box>
                </Paper>
              </ScrollReveal>
            )}

            {!docente!.biografia && (
              <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: 'none', border: '1px dashed #e2e8f0' }}>
                <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Biografía no disponible aún.
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Columna derecha: Cursos del docente */}
          <Grid item xs={12} md={5}>
            <ScrollReveal>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                Cursos de {docente!.nombre}
              </Typography>
              <Stack spacing={3}>
                {docente!.cursos_dictados.length > 0 ? (
                  docente!.cursos_dictados.map((curso) => (
                    <CursoCard key={curso.id} curso={curso as any} />
                  ))
                ) : (
                  <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', boxShadow: 'none', border: '1px dashed #e2e8f0' }}>
                    <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Este docente aún no tiene cursos publicados.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </ScrollReveal>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}
