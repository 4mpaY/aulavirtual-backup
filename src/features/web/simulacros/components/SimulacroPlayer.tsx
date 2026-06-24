'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

interface Opcion { id: string; texto: string; es_correcta: boolean; orden: number }
interface Pregunta { id: string; enunciado: string; tema: string | null; fundamento: string | null; audio_url?: string | null; imagen_url?: string | null; orden: number; opciones: Opcion[] }

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F']

const T = {
  bg:        '#f8fafc',
  surface:   '#ffffff',
  border:    'hsl(214,20%,91%)',
  text:      '#1e293b',
  muted:     '#64748b',
  primary:   'var(--web-primary, #25927F)',
  primaryLt: 'rgba(var(--web-primary-rgb,37,146,127),0.1)',
  primaryBd: 'rgba(var(--web-primary-rgb,37,146,127),0.4)',
  green:     '#16a34a',
  greenBg:   'rgba(34,197,94,0.1)',
  greenBd:   'rgba(34,197,94,0.35)',
  red:       '#dc2626',
  redBg:     'rgba(239,68,68,0.1)',
  redBd:     'rgba(239,68,68,0.35)',
}

// ── Botón de audio ────────────────────────────────────────────────────────
function AudioBtn({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
      audioRef.current.onended = () => setPlaying(false)
    }
    if (playing) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <button
      onClick={toggle}
      title={playing ? 'Pausar audio' : 'Escuchar audio de sustento'}
      style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer',
        background: playing ? T.primary : 'rgba(0,0,0,0.08)',
        color: '#fff', fontSize: '0.75rem', transition: 'background 0.2s',
      }}
    >
      {playing ? '⏸' : '🔊'}
    </button>
  )
}

// ── Timer ──────────────────────────────────────────────────────────────────
function Timer({ totalSeconds, onExpire }: { totalSeconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const expired = useRef(false)

  useEffect(() => {
    if (totalSeconds <= 0) return
    const id = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(id)
          if (!expired.current) { expired.current = true; onExpire() }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [totalSeconds, onExpire])

  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  const fmt = (n: number) => String(n).padStart(2, '0')
  const pct = totalSeconds > 0 ? remaining / totalSeconds : 1
  const urgent = pct < 0.2
  const timerColor = urgent ? T.red : T.primary

  return (
    <div style={{ textAlign: 'center', padding: '14px 24px 10px', background: T.surface, borderBottom: `1px solid ${T.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <p style={{ margin: 0, fontSize: '1.5rem', color: timerColor, letterSpacing: '0.5px', fontFamily: 'Poppins, sans-serif' }}>
        <span style={{ fontWeight: 700 }}>Tiempo Restante: </span>
        <span style={{ fontFamily: 'monospace', fontWeight: 900 }}>
          {h > 0 ? `${fmt(h)}:` : ''}{fmt(m)}:{fmt(s)}
        </span>
      </p>
      <div style={{ marginTop: 8, height: 3, background: T.border, borderRadius: 2, maxWidth: 360, marginInline: 'auto' }}>
        <div style={{ height: '100%', width: `${pct * 100}%`, background: timerColor, transition: 'width 1s linear, background 0.5s', borderRadius: 2 }} />
      </div>
    </div>
  )
}

// ── Resumen final ──────────────────────────────────────────────────────────
function ResumenFinal({ preguntas, respuestas, titulo, onReintentar }: {
  preguntas: Pregunta[]; respuestas: Record<string, string>; titulo: string; onReintentar: () => void
}) {
  const correctas = preguntas.filter(p => p.opciones.find(o => o.id === respuestas[p.id])?.es_correcta).length
  const total = preguntas.length
  const pct = total > 0 ? Math.round((correctas / total) * 100) : 0
  const aprobado = pct >= 60

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, maxWidth: 460, width: '100%', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
        <div style={{ padding: '2rem', textAlign: 'center', background: aprobado ? T.greenBg : T.redBg, borderBottom: `2px solid ${aprobado ? T.greenBd : T.redBd}` }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '3rem' }}>{aprobado ? '🎉' : '📋'}</p>
          <h2 style={{ margin: 0, color: aprobado ? T.green : T.red, fontSize: '1.6rem', fontWeight: 900 }}>
            {aprobado ? '¡Aprobado!' : 'Sigue practicando'}
          </h2>
          <p style={{ margin: '6px 0 0', color: T.muted, fontSize: '0.9rem' }}>{titulo}</p>
        </div>

        <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: 8, background: T.greenBg, border: `1px solid ${T.greenBd}` }}>
            <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: T.green }}>{correctas}</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: T.green, fontWeight: 700 }}>Correctas ✓</p>
          </div>
          <div style={{ textAlign: 'center', padding: '1rem', borderRadius: 8, background: T.redBg, border: `1px solid ${T.redBd}` }}>
            <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 900, color: T.red }}>{total - correctas}</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: T.red, fontWeight: 700 }}>Incorrectas ✗</p>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '0 1.5rem 0.5rem' }}>
          <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: aprobado ? T.green : T.red }}>{pct}%</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: T.muted }}>Mínimo para aprobar: 60%</p>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={onReintentar} style={{ padding: '0.875rem', borderRadius: 8, border: 'none', background: T.primary, color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
            Reintentar simulacro
          </button>
          <Link href='/simulacros' style={{ display: 'block', textAlign: 'center', padding: '0.875rem', borderRadius: 8, border: `1px solid ${T.border}`, color: T.muted, fontSize: '0.9rem', textDecoration: 'none' }}>
            Volver a simulacros
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── Player principal ───────────────────────────────────────────────────────
export default function SimulacroPlayer({ preguntas, duracionMin, titulo, stickyTop = 'var(--navbar-height, 0px)' }: {
  preguntas: Pregunta[]; duracionMin: number; titulo: string; stickyTop?: string | number
}) {
  const [idx, setIdx] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, string>>({})
  const [seleccionPendiente, setSeleccionPendiente] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)

  // Aviso al recargar/cerrar mientras el simulacro está en progreso
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])

  const pregunta = preguntas[idx]
  const opcionElegidaId = pregunta ? respuestas[pregunta.id] : undefined
  const opcionElegida = pregunta?.opciones.find(o => o.id === opcionElegidaId)
  const correcta = pregunta?.opciones.find(o => o.es_correcta)
  const esCorrecta = opcionElegida?.es_correcta ?? false

  const handleExpire = useCallback(() => setFinished(true), [])

  const handleSeleccionar = (opcionId: string) => {
    if (revealed) return
    setSeleccionPendiente(opcionId)
  }

  const handleConfirmar = () => {
    if (!seleccionPendiente || revealed) return
    setRespuestas(prev => ({ ...prev, [pregunta.id]: seleccionPendiente }))
    setRevealed(true)
    setSeleccionPendiente(null)
  }

  const handleSiguiente = () => {
    if (idx + 1 >= preguntas.length) { setFinished(true); return }
    setIdx(i => i + 1)
    setRevealed(false)
    setSeleccionPendiente(null)
  }

  if (preguntas.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', color: T.muted, background: T.bg, fontFamily: 'Poppins, sans-serif' }}>
      <p>Este simulacro aún no tiene preguntas.</p>
      <Link href='/simulacros' style={{ color: T.primary }}>← Volver</Link>
    </div>
  )

  if (finished) return (
    <ResumenFinal preguntas={preguntas} respuestas={respuestas} titulo={titulo}
      onReintentar={() => { setIdx(0); setRespuestas({}); setRevealed(false); setFinished(false) }} />
  )

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .reveal-anim { animation: fadeSlide 0.25s ease; }
        .opcion-row { transition: background 0.15s, border-color 0.15s; }
        .opcion-row:hover:not(:disabled) { background: ${T.primaryLt} !important; border-color: ${T.primaryBd} !important; }
      `}</style>

      {/* Timer sticky — se ancla al contenedor con scroll que lo envuelva (página pública o modal de vista previa) */}
      <div style={{ position: 'sticky', top: stickyTop, zIndex: 40 }}>
        <Timer totalSeconds={duracionMin * 60} onExpire={handleExpire} />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 16px 80px' }}>

        {/* Título + progreso */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ margin: '0 0 12px', fontSize: '1rem', color: T.muted, lineHeight: 1.6, maxWidth: 640, marginInline: 'auto' }}>
            {titulo}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ flex: 1, maxWidth: 280, height: 4, background: T.border, borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${((idx + 1) / preguntas.length) * 100}%`, background: T.primary, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: '0.78rem', color: T.muted, whiteSpace: 'nowrap' }}>
              {idx + 1} / {preguntas.length}
            </span>
          </div>
        </div>

        {/* Tarjeta de pregunta */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: '24px 28px', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

          {/* Tema */}
          {pregunta.tema && (
            <p style={{ margin: '0 0 16px', fontSize: '0.85rem', fontWeight: 700, color: T.primary }}>
              Tema : {pregunta.tema}
            </p>
          )}

          {/* Enunciado */}
          <p style={{ margin: '0 0 16px', fontSize: '0.92rem', color: T.text, lineHeight: 1.6 }}>
            <strong>{idx + 1}.-</strong> {pregunta.enunciado}
          </p>

          {/* Imagen de la pregunta */}
          {pregunta.imagen_url && (
            <div style={{ marginBottom: 20, borderRadius: 8, overflow: 'hidden', border: `1px solid ${T.border}`, maxWidth: 560 }}>
              <img src={pregunta.imagen_url} alt='Imagen de la pregunta'
                style={{ width: '100%', maxHeight: 280, objectFit: 'contain', display: 'block', background: '#f1f5f9' }} />
            </div>
          )}

          {/* Opciones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pregunta.opciones.map((op, i) => {
              const esPendiente = !revealed && seleccionPendiente === op.id
              const elegida = opcionElegidaId === op.id
              const bg = !revealed
                ? (esPendiente ? T.primaryLt : 'transparent')
                : op.es_correcta ? T.greenBg
                : elegida ? T.redBg
                : 'transparent'
              const borderCol = !revealed
                ? (esPendiente ? T.primary : T.border)
                : op.es_correcta ? T.greenBd
                : elegida ? T.redBd
                : T.border

              return (
                <button
                  key={op.id}
                  className='opcion-row'
                  onClick={() => handleSeleccionar(op.id)}
                  disabled={revealed}
                  style={{
                    width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center',
                    gap: 12, padding: '12px 16px', borderRadius: 8,
                    cursor: revealed ? 'default' : 'pointer',
                    background: bg, border: `1px solid ${borderCol}`,
                    fontSize: '0.9rem', color: T.text,
                  }}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${borderCol}`,
                    background: esPendiente || elegida || (revealed && op.es_correcta) ? borderCol : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {(esPendiente || elegida || (revealed && op.es_correcta)) && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'block' }} />
                    )}
                  </span>

                  <span style={{ flex: 1 }}>
                    <strong>{LETRAS[i]})</strong> {op.texto}
                  </span>

                  {revealed && op.es_correcta && <span style={{ color: T.green, fontWeight: 800, fontSize: '1rem' }}>✓</span>}
                  {revealed && elegida && !op.es_correcta && <span style={{ color: T.red, fontWeight: 800, fontSize: '1rem' }}>✗</span>}
                </button>
              )
            })}
          </div>

          {/* Botón confirmar respuesta */}
          {!revealed && (
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleConfirmar}
                disabled={!seleccionPendiente}
                style={{
                  padding: '10px 28px', borderRadius: 8, border: 'none',
                  background: seleccionPendiente ? T.primary : '#e2e8f0',
                  color: seleccionPendiente ? '#fff' : '#94a3b8',
                  fontSize: '0.9rem', fontWeight: 700,
                  cursor: seleccionPendiente ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: seleccionPendiente ? '0 4px 14px rgba(var(--web-primary-rgb,37,146,127),0.3)' : 'none',
                }}
              >
                Confirmar respuesta
              </button>
            </div>
          )}
        </div>

        {/* Reveal: resultado + fundamento */}
        {revealed && (
          <div className='reveal-anim' style={{ marginBottom: 16 }}>
            <div style={{
              padding: '14px 18px', borderRadius: '8px 8px 0 0',
              background: esCorrecta ? T.green : T.red,
              color: '#fff', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{esCorrecta ? '✓' : '✗'}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>
                  {esCorrecta ? '¡Respuesta correcta!' : 'Respuesta incorrecta'}
                </p>
                {!esCorrecta && correcta && (
                  <p style={{ margin: '3px 0 0', fontSize: '0.82rem', opacity: 0.92 }}>
                    Respuesta correcta: <strong>{LETRAS[pregunta.opciones.findIndex(o => o.es_correcta)]}. {correcta.texto}</strong>
                  </p>
                )}
              </div>
            </div>

            {(pregunta.fundamento || pregunta.audio_url) && (
              <div style={{
                padding: '14px 18px', borderRadius: '0 0 8px 8px',
                background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.25)',
                borderTop: 'none',
              }}>
                <p style={{ margin: '0 0 8px', fontSize: '0.72rem', fontWeight: 800, color: 'rgb(180,83,9)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  📖 Fundamento
                </p>
                {pregunta.fundamento && (
                  <p style={{ margin: '0 0 10px', fontSize: '0.88rem', color: 'rgb(120,53,15)', lineHeight: 1.7 }}>
                    {pregunta.fundamento}
                  </p>
                )}
                {pregunta.audio_url && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.75rem', color: 'rgb(180,83,9)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      🔊 Audio:
                    </span>
                    <AudioBtn url={pregunta.audio_url} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Botón siguiente */}
        {revealed && (
          <button
            onClick={handleSiguiente}
            className='reveal-anim'
            style={{
              display: 'block', margin: '0 auto', padding: '12px 40px',
              borderRadius: 8, border: 'none', background: T.primary,
              color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(var(--web-primary-rgb,37,146,127),0.35)',
            }}
          >
            {idx + 1 >= preguntas.length ? 'Ver resultados →' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  )
}
