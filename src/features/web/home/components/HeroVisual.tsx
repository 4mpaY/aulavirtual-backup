'use client'

/* ─────────────────────────────────────────────
   HeroVisual — panel derecho del hero
   Dashboard de clase GRABADA: player con
   progreso, módulos y comentarios de estudiantes.
   ───────────────────────────────────────────── */

import { useEffect, useState } from 'react'

import { Play, CheckCircle, Lock, Clock } from 'lucide-react'

const MODULES = [
  { title: 'Introducción al Derecho Corporativo', duration: '12:40', done: true },
  { title: 'Marco Legal y Normativa', duration: '28:15', done: true },
  { title: 'Análisis de Jurisprudencia', duration: '35:08', done: false, active: true },
  { title: 'Redacción de Contratos', duration: '22:50', done: false },
  { title: 'Resolución de Conflictos', duration: '18:00', done: false, locked: true },
]

const COMMENTS = [
  { name: 'Dr. Silva', msg: 'Excelente análisis de la jurisprudencia ⚖️', avatar: 'AS', color: 'var(--web-primary, #25927F)' },
  { name: 'Carlos R.', msg: 'El material sobre contratos es muy completo.', avatar: 'CR', color: '#3AB079' },
  { name: 'Luis M.', msg: 'Las plantillas legales ahorran mucho tiempo.', avatar: 'LM', color: 'var(--web-dark, #025E44)' },
  { name: 'Valeria P.', msg: 'Muy clara la explicación sobre compliance.', avatar: 'VP', color: 'var(--web-light, #BDD962)' },
]

export default function HeroVisual() {
  const [progress, setProgress] = useState(42)
  const [currentTime, setCurrentTime] = useState(14 * 60 + 52) // 14:52
  const TOTAL = 35 * 60 + 8 // 35:08

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentTime(t => {
        const next = t + 1 > TOTAL ? t : t + 1

        setProgress(Math.round((next / TOTAL) * 100))

        return next
      })
    }, 400)

    return () => clearInterval(iv)
  }, [TOTAL])

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '500px' }}>

      {/* Glow ambient */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 60% at 60% 50%, rgba(var(--web-primary-rgb, 37, 146, 127),0.15) 0%, transparent 70%)' }} />

      {/* ── Tarjeta principal ── */}
      <div style={{
        width: '100%', maxWidth: '420px',
        borderRadius: '20px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 2,
      }}>

        {/* Cabecera */}
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg,var(--web-dark, #025E44),var(--web-primary, #25927F))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1rem' }}>⚖️</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>Asesoría Legal Corporativa</div>
              <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.625rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>Módulo 3 · Análisis de Jurisprudencia</div>
            </div>
          </div>
          {/* Badge GRABADO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.12)', border: '1px solid rgba(var(--web-light-rgb, 189, 217, 98),0.3)', borderRadius: '999px', padding: '4px 10px' }}>
            <Play size={9} color="var(--web-light, #BDD962)" fill="var(--web-light, #BDD962)" />
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5625rem', color: 'var(--web-light, #BDD962)', fontWeight: 800, letterSpacing: '0.06em' }}>GRABADO</span>
          </div>
        </div>

        {/* Pantalla del video */}
        <div style={{ position: 'relative', background: 'linear-gradient(160deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 40%, var(--web-primary, #25927F) 100%)', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

          {/* Botón play central */}
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', cursor: 'default', position: 'relative', zIndex: 1 }}>
            <Play size={22} color="#ffffff" fill="#ffffff" style={{ marginLeft: '3px' }} />
          </div>

          {/* Barra de progreso */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 14px 10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{fmt(currentTime)}</span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5rem', color: 'rgba(255,255,255,0.35)' }}>35:08</span>
            </div>
            <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--web-light, #BDD962)', borderRadius: '999px', transition: 'width 0.4s linear' }} />
            </div>
          </div>
        </div>

        {/* Lista de módulos */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {MODULES.map((m, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '7px 18px',
                backgroundColor: m.active ? 'rgba(var(--web-primary-rgb, 37, 146, 127),0.12)' : 'transparent',
                borderLeft: m.active ? '3px solid var(--web-primary, #25927F)' : '3px solid transparent',
              }}
            >
              <div style={{ flexShrink: 0 }}>
                {m.done
                  ? <CheckCircle size={14} color="var(--web-light, #BDD962)" />
                  : m.locked
                    ? <Lock size={14} color="rgba(255,255,255,0.2)" />
                    : <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {m.active && <Play size={6} color="var(--web-primary, #25927F)" fill="var(--web-primary, #25927F)" />}
                      </div>
                }
              </div>
              <span style={{
                fontFamily: 'Montserrat, sans-serif', fontSize: '0.6875rem', flex: 1,
                color: m.done ? 'rgba(255,255,255,0.5)' : m.locked ? 'rgba(255,255,255,0.2)' : m.active ? '#ffffff' : 'rgba(255,255,255,0.65)',
                fontWeight: m.active ? 700 : 400,
                textDecoration: m.done ? 'line-through' : 'none',
              }}>
                {m.title}
              </span>
              <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5625rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                <Clock size={9} />
                {m.duration}
              </span>
            </div>
          ))}
        </div>

        {/* Comentarios */}
        <div style={{ padding: '10px 18px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.625rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
            Comentarios del módulo
          </div>
          {COMMENTS.slice(0, 2).map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: c.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.4375rem', fontWeight: 800, color: c.color === 'var(--web-light, #BDD962)' ? '#0A0A0A' : '#fff' }}>{c.avatar}</span>
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '5px 9px', flex: 1 }}>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5625rem', color: c.color, fontWeight: 700 }}>{c.name} </span>
                <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5625rem', color: 'rgba(255,255,255,0.4)' }}>{c.msg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating card: progreso del curso */}
      <div style={{
        position: 'absolute', top: '6%', right: '2%', zIndex: 5,
        backgroundColor: '#ffffff', borderRadius: '14px', padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        animation: 'heroFloat 4s ease-in-out infinite',
        minWidth: '152px',
      }}>
        <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.625rem', color: '#64748b', marginBottom: '6px' }}>Tu progreso</div>
        <div style={{ height: '5px', backgroundColor: '#f1f5f9', borderRadius: '999px', overflow: 'hidden', marginBottom: '5px' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--web-primary, #25927F)', borderRadius: '999px', transition: 'width 0.4s linear' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', fontWeight: 800, color: '#0A0A0A' }}>{progress}%</span>
          <span style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5625rem', color: 'var(--web-primary, #25927F)', fontWeight: 600 }}>2 / 5 módulos</span>
        </div>
      </div>

      {/* Floating card: certificado */}
      <div style={{
        position: 'absolute', bottom: '8%', left: '0%', zIndex: 5,
        backgroundColor: '#ffffff', borderRadius: '14px', padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        animation: 'heroFloat 5s ease-in-out infinite reverse',
        minWidth: '158px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.125rem', flexShrink: 0 }}>📜</div>
          <div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8125rem', fontWeight: 800, color: '#0A0A0A', lineHeight: 1 }}>Certificación Legal</div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.5625rem', color: '#64748b', marginTop: '2px' }}>Al completar el curso</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
