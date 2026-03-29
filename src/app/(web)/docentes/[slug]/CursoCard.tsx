'use client'

import Link from 'next/link'

import { Box, Typography, Stack, Paper } from '@mui/material'

import CourseThumbnail from '@/utils/components/CourseThumbnail'

interface Curso {
  id: string
  titulo: string
  slug: string
  miniatura: string | null
  precio: any
  moneda: string
  es_gratis: boolean
  nivel: string
  tipo_emision: string
  categoria: { nombre: string } | null
}

const nivelLabel: Record<string, string> = {
  BASICO: 'Básico',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado'
}

export default function CursoCard({ curso }: { curso: Curso }) {
  return (
    <Link href={`/cursos/${curso.slug}`} style={{ textDecoration: 'none' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          borderRadius: 3,
          border: '1px solid #f1f5f9',
          backgroundColor: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
            transform: 'translateY(-2px)',
            borderColor: '#10b981'
          }
        }}
      >
        <Box sx={{ width: 100, flexShrink: 0 }}>
          <CourseThumbnail
            src={curso.miniatura}
            title={curso.titulo}
            aspectRatio="4/3"
            sx={{ borderRadius: 2 }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              lineHeight: 1.3,
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.9rem'
            }}
          >
            {curso.titulo}
          </Typography>

          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1, gap: 0.5 }}>
            {curso.categoria && (
              <Box component="span" sx={{ fontSize: '0.65rem', fontWeight: 700, px: 1, py: 0.25, borderRadius: 1, bgcolor: '#f1f5f9', color: '#475569', textTransform: 'uppercase' }}>
                {curso.categoria.nombre}
              </Box>
            )}
            <Box component="span" sx={{ fontSize: '0.65rem', fontWeight: 700, px: 1, py: 0.25, borderRadius: 1, bgcolor: '#eff6ff', color: '#3b82f6', textTransform: 'uppercase' }}>
              {nivelLabel[curso.nivel] ?? curso.nivel}
            </Box>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              fontWeight: 800,
              color: '#10b981',
              fontSize: '0.9rem'
            }}
          >
            {curso.es_gratis ? 'Gratuito' : `${curso.moneda} ${Number(curso.precio).toFixed(2)}`}
          </Typography>
        </Box>
      </Paper>
    </Link>
  )
}
