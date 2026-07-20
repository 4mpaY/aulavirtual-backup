import React from 'react'

import { Box, Container, Typography, Divider } from '@mui/material'

export interface LegalSeccion {
  titulo: string
  contenido: string
}

interface LegalPageContentProps {
  titulo: string
  subtitulo?: string
  intro?: string
  secciones: LegalSeccion[]
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// Convierte texto plano (separado por líneas en blanco) en párrafos HTML,
// enlazando automáticamente cualquier mención a "Libro de Reclamaciones".
function toParagraphsHtml(text: string) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => {
      const escaped = escapeHtml(p).replace(/\n/g, '<br/>')
      const linked = escaped.replace(
        /Libro de Reclamaciones/g,
        '<a href="/libro-de-reclamaciones" style="color: var(--web-dark, #025E44); text-decoration: underline;">Libro de Reclamaciones</a>'
      )

      return `<p>${linked}</p>`
    })
    .join('')
}

export default function LegalPageContent({ titulo, subtitulo, intro, secciones }: LegalPageContentProps) {
  return (
    <Box sx={{ bgcolor: 'white', py: { xs: 6, md: 10 }, color: '#333' }}>
      <Container maxWidth="md">
        <Typography variant="h3" fontWeight={900} sx={{ color: 'var(--web-dark, #025E44)' }} mb={2} textAlign="center">
          {titulo}
        </Typography>
        {subtitulo && (
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={6}>
            {subtitulo}
          </Typography>
        )}

        <Box sx={{ '& h4': { color: 'var(--web-dark, #025E44)', fontWeight: 800, mt: 5, mb: 2 }, '& p': { mb: 2, lineHeight: 1.8 } }}>
          {intro && (
            <div dangerouslySetInnerHTML={{ __html: toParagraphsHtml(intro) }} />
          )}

          {intro && secciones.length > 0 && <Divider sx={{ my: 4 }} />}

          {secciones.map((seccion, i) => (
            <React.Fragment key={i}>
              <Typography variant="h4">{seccion.titulo}</Typography>
              <div dangerouslySetInnerHTML={{ __html: toParagraphsHtml(seccion.contenido) }} />
            </React.Fragment>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
