/**
 * Escala tipográfica única para todas las secciones de la home.
 * Cambiar aquí afecta TODOS los componentes que la importen.
 */

import type { CSSProperties } from 'react'

// ── Eyebrow (label encima del título) ──────────────────────
export const eyebrow: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#25927F',
  display: 'block',
  marginBottom: '0.75rem',
}

export const eyebrowDark: CSSProperties = {
  ...eyebrow,
  color: '#BDD962',
}

// ── H2 de sección ──────────────────────────────────────────
// 1.75 rem en mobile, 2 rem en ≥768 px
// Se aplica via className="section-title" (globals.css) o con este objeto
export const sectionH2: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: 'clamp(1.75rem, 3vw, 2rem)',
  fontWeight: 800,
  color: '#0A0A0A',
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  marginBottom: '0.75rem',
}

export const sectionH2Dark: CSSProperties = {
  ...sectionH2,
  color: '#ffffff',
}

// ── Descripción / subtítulo de sección ─────────────────────
export const sectionDesc: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '1rem',
  fontWeight: 400,
  color: '#64748b',
  lineHeight: 1.7,
}

export const sectionDescDark: CSSProperties = {
  ...sectionDesc,
  color: 'rgba(255, 255, 255, 0.55)',
}

// ── Título de card ──────────────────────────────────────────
export const cardTitle: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '1rem',
  fontWeight: 700,
  color: '#0A0A0A',
  letterSpacing: '-0.01em',
  marginBottom: '0.25rem',
}

export const cardTitleDark: CSSProperties = {
  ...cardTitle,
  color: '#ffffff',
}

// ── Cuerpo de card ──────────────────────────────────────────
export const cardBody: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.875rem',
  fontWeight: 400,
  color: '#64748b',
  lineHeight: 1.6,
}

export const cardBodyDark: CSSProperties = {
  ...cardBody,
  color: 'rgba(255, 255, 255, 0.4)',
}

// ── Texto pequeño / meta ────────────────────────────────────
export const smallText: CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.8125rem',
  fontWeight: 400,
  color: '#94a3b8',
  lineHeight: 1.5,
}
