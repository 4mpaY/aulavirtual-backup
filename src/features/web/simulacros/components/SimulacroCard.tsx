'use client'

import Link from 'next/link'

import type { Simulacro } from '@/features/admin/simulacros/entity/Simulacro'

const nivelLabel: Record<string, string> = { BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado' }

const nivelColor: Record<string, string> = {
  BASICO: 'rgba(34,197,94,0.12)',
  INTERMEDIO: 'rgba(251,191,36,0.14)',
  AVANZADO: 'rgba(239,68,68,0.12)',
}

const nivelText: Record<string, string> = {
  BASICO: 'rgb(21,128,61)',
  INTERMEDIO: 'rgb(180,83,9)',
  AVANZADO: 'rgb(185,28,28)',
}

export default function SimulacroCard({ simulacro }: { simulacro: Simulacro }) {
  return (
    <Link href={`/simulacros/${simulacro.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        borderRadius: '16px',
        border: '1px solid hsl(214,20%,91%)',
        background: '#ffffff',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement

          el.style.transform = 'translateY(-6px)'
          el.style.boxShadow = '0 12px 28px rgba(var(--web-primary-rgb,37,146,127),0.18)'
          el.style.borderColor = 'rgba(var(--web-primary-rgb,37,146,127),0.3)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement

          el.style.transform = 'translateY(0)'
          el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'
          el.style.borderColor = 'hsl(214,20%,91%)'
        }}
      >
        {/* Imagen */}
        <div style={{ height: '160px', overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
          {simulacro.miniatura
            ? <img src={simulacro.miniatura} alt={simulacro.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-clipboard-list' style={{ fontSize: '3rem', color: '#cbd5e1' }} />
              </div>}
          {/* Badge nivel */}
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
            background: nivelColor[simulacro.nivel], color: nivelText[simulacro.nivel],
            border: `1px solid ${nivelText[simulacro.nivel]}33`,
          }}>
            {nivelLabel[simulacro.nivel]}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '1.25rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.3 }}>
            {simulacro.titulo}
          </p>
          {simulacro.area_tematica && (
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
              {simulacro.area_tematica}
            </p>
          )}

          {/* Meta */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {simulacro.numero_preguntas > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <i className='tabler-help-circle' style={{ fontSize: '0.875rem' }} />
                {simulacro.numero_preguntas} preguntas
              </span>
            )}
            {simulacro.duracion && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <i className='tabler-clock' style={{ fontSize: '0.875rem' }} />
                {simulacro.duracion}
              </span>
            )}
          </div>

          {/* Precio + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.25rem', fontWeight: 800, color: 'var(--web-primary, #25927F)' }}>
              {simulacro.es_gratis ? 'Gratis' : `${simulacro.moneda} ${Number(simulacro.precio).toFixed(2)}`}
            </span>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, padding: '0.375rem 0.875rem',
              borderRadius: '999px', border: '1px solid rgba(var(--web-primary-rgb,37,146,127),0.35)',
              color: 'var(--web-primary, #25927F)', background: 'rgba(var(--web-primary-rgb,37,146,127),0.08)',
            }}>
              Ver simulacro →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
