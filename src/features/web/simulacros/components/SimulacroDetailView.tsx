'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Simulacro } from '@/features/admin/simulacros/entity/Simulacro'
import SimulacroPlayer from './SimulacroPlayer'
import { useAuthModal } from '@/contexts/AuthModalContext'

const nivelLabel: Record<string, string> = { BASICO: 'Básico', INTERMEDIO: 'Intermedio', AVANZADO: 'Avanzado' }

interface Opcion { id: string; texto: string; es_correcta: boolean; orden: number }
interface Pregunta { id: string; enunciado: string; tema: string | null; fundamento: string | null; orden: number; opciones: Opcion[] }

interface Props {
  simulacro: Simulacro
  preguntas: Pregunta[]
  tieneAcceso: boolean
  estaAutenticado: boolean
}

export default function SimulacroDetailView({ simulacro, preguntas, tieneAcceso, estaAutenticado }: Props) {
  const [playing, setPlaying] = useState(false)
  const { openLogin } = useAuthModal()
  const duracionMin = simulacro.duracion ? Number(simulacro.duracion) : 60

  if (playing && tieneAcceso) {
    return <SimulacroPlayer preguntas={preguntas} duracionMin={duracionMin} titulo={simulacro.titulo} />
  }

  const precio = `${simulacro.moneda} ${Number(simulacro.precio).toFixed(2)}`

  // ── Botón CTA según estado ────────────────────────────────────────────
  const CtaButton = () => {
    // 1. Tiene acceso (gratis o comprado)
    if (tieneAcceso) {
      return (
        <button
          onClick={() => setPlaying(true)}
          style={btnStyle('#dc2626')}
        >
          Comenzar simulacro →
        </button>
      )
    }

    // 2. No autenticado
    if (!estaAutenticado) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
          <button onClick={() => openLogin()} style={btnStyle('#dc2626')}>
            Iniciar sesión para acceder
          </button>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
            ¿No tienes cuenta?{' '}
            <Link href='/registro' style={{ color: 'rgba(220,38,38,0.7)', textDecoration: 'underline' }}>
              Regístrate
            </Link>
          </span>
        </div>
      )
    }

    // 3. Autenticado pero no comprado
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
        <button style={btnStyle('#dc2626')}>
          Comprar acceso — {precio}
        </button>
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
          Acceso de por vida · Sin mensualidades
        </span>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08080e', color: 'rgba(255,255,255,0.9)' }}>
      {/* Hero */}
      <section style={{ position: 'relative', padding: '5rem 1.5rem 4rem', overflow: 'hidden' }}>
        {simulacro.miniatura && (
          <>
            <img src={simulacro.miniatura} alt='' aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,14,0.6), #08080e)' }} />
          </>
        )}
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link href='/simulacros' style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1.5rem' }}>
            ← Volver a simulacros
          </Link>

          {/* Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={badgeStyle('rgba(220,38,38,0.12)', 'rgba(220,38,38,0.3)', 'hsl(343,84%,62%)')}>
              {nivelLabel[simulacro.nivel]}
            </span>
            {simulacro.area_tematica && (
              <span style={badgeStyle('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.6)')}>
                {simulacro.area_tematica}
              </span>
            )}
            {simulacro.es_gratis && (
              <span style={badgeStyle('rgba(34,197,94,0.12)', 'rgba(34,197,94,0.3)', 'rgb(34,197,94)')}>
                Gratis
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, lineHeight: 1.15, margin: '0 0 1rem' }}>
            {simulacro.titulo}
          </h1>

          {simulacro.descripcion && (
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '620px', margin: '0 0 2rem' }}>
              {simulacro.descripcion}
            </p>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
            {simulacro.numero_preguntas > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>❓</span>
                <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                  <strong>{simulacro.numero_preguntas}</strong> preguntas
                </span>
              </div>
            )}
            {simulacro.duracion && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⏱</span>
                <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                  {simulacro.duracion} minutos
                </span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📊</span>
              <span style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>
                Mínimo 60% para aprobar
              </span>
            </div>
          </div>

          {/* CTA: precio + botón */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {!simulacro.es_gratis && (
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'hsl(343,84%,62%)' }}>
                {precio}
              </span>
            )}
            <CtaButton />
          </div>

          {/* Aviso de acceso restringido */}
          {!tieneAcceso && estaAutenticado && (
            <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: '0.5rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                🔒 Necesitas adquirir este simulacro para acceder al examen.
              </p>
            </div>
          )}

          {!tieneAcceso && !estaAutenticado && (
            <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                🔒 Inicia sesión para {simulacro.es_gratis ? 'acceder a este simulacro gratuito' : 'comprar y acceder al examen'}.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// ── Helpers de estilos ────────────────────────────────────────────────────
function btnStyle(bg: string): React.CSSProperties {
  return {
    padding: '0.875rem 2.25rem',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '1.05rem',
    cursor: 'pointer',
    background: bg,
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 24px rgba(220,38,38,0.35)',
    whiteSpace: 'nowrap',
  }
}

function badgeStyle(bg: string, border: string, color: string): React.CSSProperties {
  return {
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.7rem',
    fontWeight: 700,
    background: bg,
    border: `1px solid ${border}`,
    color,
  }
}
