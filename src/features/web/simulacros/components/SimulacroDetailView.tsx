import Link from 'next/link'
import type { Simulacro } from '@/features/admin/simulacros/entity/Simulacro'

const nivelLabel: Record<string, string> = { BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado' }

export default function SimulacroDetailView({ simulacro }: { simulacro: Simulacro }) {
  return (
    <div style={{ minHeight: '100vh', background: '#08080e', color: 'rgba(255,255,255,0.9)' }}>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '5rem 1.5rem', overflow: 'hidden' }}>
        {simulacro.miniatura && (
          <>
            <img src={simulacro.miniatura} alt='' aria-hidden style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15,
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,14,0.6), #08080e)' }} />
          </>
        )}
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link href='/simulacros' style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem' }}>
            ← Volver a simulacros
          </Link>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', color: 'hsl(343,84%,62%)' }}>
              {nivelLabel[simulacro.nivel]}
            </span>
            {simulacro.area_tematica && (
              <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
                {simulacro.area_tematica}
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 1rem' }}>
            {simulacro.titulo}
          </h1>

          {simulacro.descripcion && (
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '650px', margin: '0 0 2rem' }}>
              {simulacro.descripcion}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {simulacro.numero_preguntas > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className='tabler-help-circle' style={{ fontSize: '1.25rem', color: 'hsl(343,84%,62%)' }} />
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}><strong>{simulacro.numero_preguntas}</strong> preguntas</span>
              </div>
            )}
            {simulacro.duracion && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className='tabler-clock' style={{ fontSize: '1.25rem', color: 'hsl(343,84%,62%)' }} />
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{simulacro.duracion}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: 'hsl(343,84%,62%)' }}>
              {simulacro.es_gratis ? 'Gratis' : `${simulacro.moneda} ${Number(simulacro.precio).toFixed(2)}`}
            </span>
            <button style={{
              padding: '0.875rem 2rem', borderRadius: '999px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
              background: 'hsl(343,84%,52%)', color: '#fff', border: 'none',
              boxShadow: '0 4px 24px rgba(220,38,38,0.35)', transition: 'all 0.2s',
            }}>
              {simulacro.es_gratis ? 'Comenzar gratis' : 'Comprar ahora'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
