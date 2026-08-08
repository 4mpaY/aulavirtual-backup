import { notFound } from 'next/navigation'

import Link from 'next/link'

import { Container, Box, Grid, Typography, Chip } from '@mui/material'

import prisma from '@/utils/libs/prisma'
import RutasCatalog from '@/features/web/rutas/components/RutasCatalog'

async function getEscuelaWithRutas(slug: string) {
  try {
    const escuela = await prisma.escuela.findUnique({
      where: { slug },
      include: {
        rutas: {
          where: { esta_activo: true },
          include: {
            cursos: {
              orderBy: { orden: 'asc' },
              include: {
                curso: {
                  select: {
                    id: true,
                    titulo: true,
                    miniatura: true,
                    slug: true,
                    precio: true,
                    moneda: true,
                    es_gratis: true
                  }
                }
              }
            },
            _count: {
              select: { cursos: true }
            }
          }
        }
      }
    })

    if (!escuela) return null

    const formattedRutas = escuela.rutas.map(ruta => ({
      ...ruta,
      total_cursos: ruta._count.cursos,
      cursos: ruta.cursos.map(rc => rc.curso)
    }))

    return {
      ...escuela,
      rutas: formattedRutas
    }
  } catch (err) {
    console.error('Error fetching escuela:', err)
    
return null
  }
}

export default async function EscuelaDetailPage({ params }: { params: { slug: string } }) {
  const escuela = await getEscuelaWithRutas(params.slug)

  if (!escuela) notFound()

  const isDisponible = escuela.estado === 'DISPONIBLE'

  const ESTADO_LABELS: Record<string, string> = {
    DISPONIBLE: 'Disponible',
    PROXIMAMENTE: 'Próximamente',
    MEDIANTE_ALIANZAS: 'Mediante alianzas',
    EN_DESARROLLO: 'En desarrollo'
  }

  const ESTADO_COLORS: Record<string, string> = {
    DISPONIBLE: '#10B981',
    PROXIMAMENTE: '#F59E0B',
    MEDIANTE_ALIANZAS: '#3B82F6',
    EN_DESARROLLO: '#8B5CF6'
  }

  const estadoColor = ESTADO_COLORS[escuela.estado] || '#64748B'
  const estadoLabel = ESTADO_LABELS[escuela.estado] || escuela.estado

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', pb: 12 }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)',
          padding: '6rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '4rem'
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--web-primary-rgb, 37, 146, 127),0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '999px',
                padding: '0.375rem 1rem',
                marginBottom: '0.5rem',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: estadoColor, display: 'inline-block' }} />
              <span style={{ color: '#ffffff', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {estadoLabel}
              </span>
            </div>

            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 900,
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
                color: '#ffffff',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Escuela de {escuela.nombre}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
                fontWeight: 400,
                maxWidth: '650px',
              }}
            >
              {escuela.descripcion || 'Formación especializada diseñada para impulsar tus habilidades profesionales y prepararte para el futuro.'}
            </Typography>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <Container maxWidth="lg">
        {isDisponible ? (
          <Box>
            <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 6, color: '#1A1A1A' }}>
              Rutas de Aprendizaje Disponibles
            </Typography>
            <RutasCatalog initialRutas={escuela.rutas} />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              py: 12,
              px: 6,
              borderRadius: '24px',
              border: '1.5px dashed rgba(0, 111, 101, 0.15)',
              backgroundColor: 'rgba(0, 111, 101, 0.02)',
              maxWidth: 700,
              margin: '0 auto'
            }}
          >
            <i className="tabler-school text-5xl text-primary" style={{ fontSize: '4.5rem', color: 'var(--agenda-primary)', marginBottom: '1.5rem' }} />
            <Typography variant="h4" sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, mb: 3, color: '#1A1A1A' }}>
              Contenido en Preparación
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'Inter, sans-serif', lineHeight: 1.6, mb: 6, maxWidth: 500 }}>
              Estamos diseñando las mejores rutas de aprendizaje y cursos prácticos para esta escuela. Pronto estarán disponibles para impulsar tu carrera.
            </Typography>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  background: 'var(--agenda-gradient-brand)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Volver al Inicio
              </button>
            </Link>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const escuela = await prisma.escuela.findUnique({
    where: { slug: params.slug },
    select: { nombre: true, descripcion: true }
  })

  if (!escuela) return { title: 'Escuela no encontrada' }

  return {
    title: `Escuela de ${escuela.nombre} | Agenda 2050`,
    description: escuela.descripcion || 'Escuelas de formación especializada de Agenda 2050.'
  }
}
