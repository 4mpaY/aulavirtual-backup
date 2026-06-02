import Link from 'next/link'
import type { Simulacro } from '@/features/admin/simulacros/entity/Simulacro'

const nivelLabel: Record<string, string> = { BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado' }
const nivelColor: Record<string, string> = {
  BASICO: 'rgba(34,197,94,0.15)',
  INTERMEDIO: 'rgba(251,191,36,0.15)',
  AVANZADO: 'rgba(239,68,68,0.15)',
}
const nivelText: Record<string, string> = {
  BASICO: 'rgb(34,197,94)',
  INTERMEDIO: 'rgb(251,191,36)',
  AVANZADO: 'rgb(239,68,68)',
}

export default function SimulacroCard({ simulacro }: { simulacro: Simulacro }) {
  return (
    <Link href={`/simulacros/${simulacro.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        borderRadius: '0.75rem',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(-4px)'
          el.style.boxShadow = '0 12px 40px rgba(220,38,38,0.15)'
          el.style.borderColor = 'rgba(220,38,38,0.3)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
          el.style.borderColor = 'rgba(255,255,255,0.08)'
        }}
      >
        {/* Imagen */}
        <div style={{ height: '160px', overflow: 'hidden', position: 'relative', background: 'rgba(255,255,255,0.03)' }}>
          {simulacro.miniatura
            ? <img src={simulacro.miniatura} alt={simulacro.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-clipboard-list' style={{ fontSize: '3rem', color: 'rgba(255,255,255,0.2)' }} />
              </div>}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
          {/* Badge nivel */}
          <div style={{
            position: 'absolute', top: '0.75rem', left: '0.75rem',
            padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
            background: nivelColor[simulacro.nivel], color: nivelText[simulacro.nivel],
            border: `1px solid ${nivelText[simulacro.nivel]}40`,
          }}>
            {nivelLabel[simulacro.nivel]}
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '1.25rem' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>
            {simulacro.titulo}
          </p>
          {simulacro.area_tematica && (
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              {simulacro.area_tematica}
            </p>
          )}

          {/* Meta */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {simulacro.numero_preguntas > 0 && (
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <i className='tabler-help-circle' style={{ fontSize: '0.875rem' }} />
                {simulacro.numero_preguntas} preguntas
              </span>
            )}
            {simulacro.duracion && (
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <i className='tabler-clock' style={{ fontSize: '0.875rem' }} />
                {simulacro.duracion}
              </span>
            )}
          </div>

          {/* Precio + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'hsl(343,84%,62%)' }}>
              {simulacro.es_gratis ? 'Gratis' : `${simulacro.moneda} ${Number(simulacro.precio).toFixed(2)}`}
            </span>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, padding: '0.375rem 0.875rem',
              borderRadius: '999px', border: '1px solid rgba(220,38,38,0.4)',
              color: 'hsl(343,84%,62%)', background: 'rgba(220,38,38,0.08)',
            }}>
              Ver simulacro →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
