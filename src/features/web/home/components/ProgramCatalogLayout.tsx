import React from 'react'

import { Box } from '@mui/material'

import CourseCatalog from '@/features/web/home/components/CourseCatalog'
import type { TipoPrograma } from '@/utils/configs/tipoPrograma'
import { getTipoProgramaConfig } from '@/utils/configs/tipoPrograma'

type ProgramCatalogLayoutProps = {
  tipo: TipoPrograma
  courses: any[]
  categories: {
    id: string
    nombre: string
    slug: string
    hijos?: {
      id: string
      nombre: string
      slug: string
      hijos?: { id: string; nombre: string; slug: string }[]
    }[]
  }[]
}

export default function ProgramCatalogLayout({ tipo, courses, categories }: ProgramCatalogLayoutProps) {
  const config = getTipoProgramaConfig(tipo)

  const titlePrefix =
    'catalogTitlePrefix' in config ? config.catalogTitlePrefix : config.catalogTitle

  const titleHighlight =
    'catalogTitleHighlight' in config ? config.catalogTitleHighlight : null

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      <section
        style={{
          background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)',
          padding: '4rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8125rem',
              }}
            >
              Inicio
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</span>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8125rem',
                color: '#BDD962',
                fontWeight: 600,
              }}
            >
              {config.labelPlural}
            </span>
          </div>
          <h1
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              marginBottom: '1rem',
            }}
          >
            {titleHighlight ? (
              <>
                {titlePrefix}{' '}
                <span style={{ color: '#BDD962' }}>{titleHighlight}</span>
              </>
            ) : (
              config.catalogTitle
            )}
          </h1>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.65)',
              maxWidth: '520px',
              lineHeight: 1.7,
            }}
          >
            {config.catalogDescription}
          </p>
        </div>
      </section>

      <CourseCatalog courses={courses} categories={categories} tipo={tipo} />
    </Box>
  )
}
