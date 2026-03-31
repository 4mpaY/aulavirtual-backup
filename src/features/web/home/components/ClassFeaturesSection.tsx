'use client'

/* ─────────────────────────────────────────────
   ClassFeaturesSection
   Split layout:
   • Izquierda: lista de características con íconos
   • Derecha:   phone mockup CSS con "clase en vivo"
   ───────────────────────────────────────────── */

import { useState } from 'react'

import { Video, Download, Award, ClipboardList, MessageSquare, CheckCircle } from 'lucide-react'

import ScrollReveal from './ScrollReveal'
import { eyebrowDark, sectionH2Dark, sectionDescDark, cardTitle, cardBody } from './typography'

const features = [
  {
    icon: Video,
    title: 'Clases en vivo y grabadas',
    desc: 'Sesiones sincrónicas con instructor en tiempo real y acceso a grabaciones para repasar cuando quieras.',
  },
  {
    icon: Download,
    title: 'Material descargable',
    desc: 'PDFs, plantillas y recursos de cada clase disponibles para siempre en tu biblioteca personal.',
  },
  {
    icon: ClipboardList,
    title: 'Evaluaciones y seguimiento',
    desc: 'Exámenes por módulo con retroalimentación inmediata y panel de progreso detallado.',
  },
  {
    icon: MessageSquare,
    title: 'Foro de estudiantes',
    desc: 'Comunidad activa donde puedes resolver dudas, compartir experiencias y hacer networking.',
  },
  {
    icon: Award,
    title: 'Certificado verificable',
    desc: 'Al finalizar recibes un certificado con código QR que cualquier empresa puede validar.',
  },
]

// ── Phone Mockup (CSS puro) ──────────────────────────────
function PhoneMockup() {
  const [studentCount] = useState(142)

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: '520px' }}>
      {/* Glow detrás del teléfono */}
      <div
        style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--web-primary-rgb, 37, 146, 127),0.35) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Teléfono */}
      <div
        style={{
          width: '240px',
          height: '480px',
          borderRadius: '36px',
          backgroundColor: '#111827',
          border: '6px solid #374151',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '24px',
            backgroundColor: '#111827',
            borderRadius: '0 0 16px 16px',
            zIndex: 10,
          }}
        />

        {/* Pantalla */}
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '30px',
            overflow: 'hidden',
            backgroundColor: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Status bar */}
          <div style={{ padding: '28px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.625rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>9:41</span>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div style={{ width: '14px', height: '6px', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '2px', position: 'relative' }}>
                <div style={{ position: 'absolute', right: '-3px', top: '50%', transform: 'translateY(-50%)', width: '2px', height: '4px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
                <div style={{ width: '9px', height: '4px', backgroundColor: 'var(--web-primary, #25927F)', borderRadius: '1px', margin: '0px 0.5px' }} />
              </div>
            </div>
          </div>

          {/* Header de la clase */}
          <div style={{ padding: '4px 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.625rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Gestión Ambiental</span>
            {/* Live badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '999px', padding: '2px 7px' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5rem', color: '#ef4444', fontWeight: 800, letterSpacing: '0.08em' }}>EN VIVO</span>
            </div>
          </div>

          {/* Video del instructor */}
          <div
            style={{
              margin: '0 10px',
              borderRadius: '14px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, var(--web-dark, #025E44) 0%, var(--web-primary, #25927F) 100%)',
              height: '130px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Silueta instructor */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.125rem' }}>👨‍🏫</span>
              </div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5625rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>Ing. Carlos Mendoza</span>
            </div>

            {/* Controles video */}
            <div style={{ position: 'absolute', bottom: '8px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ height: '2px', flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '999px', overflow: 'hidden', marginRight: '8px' }}>
                <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--web-light, #BDD962)', borderRadius: '999px' }} />
              </div>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5rem', color: 'rgba(255,255,255,0.5)' }}>24:38</span>
            </div>
          </div>

          {/* Participantes */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Mini avatares */}
              {['var(--web-primary, #25927F)', 'var(--web-light, #BDD962)', 'var(--web-dark, #025E44)'].map((c, i) => (
                <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: c, border: '1.5px solid #0f172a', marginLeft: i > 0 ? '-8px' : 0, zIndex: 3 - i }} />
              ))}
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5625rem', color: 'rgba(255,255,255,0.5)', marginLeft: '4px' }}>
                +{studentCount} conectados
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['🎤', '📷', '💬'].map((emoji, i) => (
                <div key={i} style={{ width: '22px', height: '22px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.625rem' }}>
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '6px', overflow: 'hidden' }}>
            {[
              { name: 'Ana G.', msg: '¿Pueden repetir el último punto?', color: 'var(--web-primary, #25927F)' },
              { name: 'Carlos R.', msg: 'Excelente explicación 👏', color: 'var(--web-light, #BDD962)' },
              { name: 'Luis M.', msg: '¿El material estará disponible?', color: '#3AB079' },
            ].map((chat, i) => (
              <div key={i} style={{ display: 'flex', gap: '5px', alignItems: 'flex-start' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: chat.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.4375rem', color: '#0A0A0A', fontWeight: 800 }}>{chat.name[0]}</span>
                </div>
                <div>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5rem', color: chat.color, fontWeight: 700 }}>{chat.name} </span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5rem', color: 'rgba(255,255,255,0.45)' }}>{chat.msg}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input chat */}
          <div style={{ padding: '8px 10px 16px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '6px 10px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5rem', color: 'rgba(255,255,255,0.25)' }}>Escribe un mensaje…</span>
            </div>
            <div style={{ width: '26px', height: '26px', borderRadius: '10px', backgroundColor: 'var(--web-primary, #25927F)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem' }}>
              ➤
            </div>
          </div>
        </div>
      </div>

      {/* Floating card: estudiantes */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          right: '-8px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          padding: '10px 14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          zIndex: 5,
          animation: 'floatY 4s ease-in-out infinite',
          minWidth: '140px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
            🎓
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: 800, color: '#0A0A0A', lineHeight: 1 }}>142</div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5625rem', color: '#64748b', fontWeight: 500 }}>estudiantes conectados</div>
          </div>
        </div>
      </div>

      {/* Floating card: rating */}
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          left: '-10px',
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          padding: '10px 14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          zIndex: 5,
          animation: 'floatY 5s ease-in-out infinite reverse',
          minWidth: '130px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
            ⭐
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: 800, color: '#0A0A0A', lineHeight: 1 }}>4.9 / 5</div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.5625rem', color: '#64748b', fontWeight: 500 }}>valoración promedio</div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

// ── Componente principal ─────────────────────────────────
export default function ClassFeaturesSection() {
  return (
    <section style={{ backgroundColor: '#0A0A0A', padding: '5rem 1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* ── Izquierda: características ── */}
          <div>
            <ScrollReveal direction="left">
              <div style={{ marginBottom: '2.5rem' }}>
                <p style={eyebrowDark}>Experiencia de aprendizaje</p>
                <h2 style={sectionH2Dark}>
                  Todo lo que necesitas<br />
                  <span style={{ color: 'var(--web-primary, #25927F)' }}>en un solo lugar</span>
                </h2>
                <p style={sectionDescDark}>
                  Una plataforma diseñada para que el aprendizaje sea efectivo, flexible y reconocido por las empresas.
                </p>
              </div>
            </ScrollReveal>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              {features.map((feature, i) => (
                <ScrollReveal key={feature.title} delay={i * 0.08} direction="left">
                  <FeatureRow feature={feature} />
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* ── Derecha: phone mockup ── */}
          <ScrollReveal direction="right" delay={0.2}>
            <PhoneMockup />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

function FeatureRow({ feature }: { feature: typeof features[number] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1rem',
        borderRadius: '12px',
        borderLeft: hovered ? '3px solid var(--web-light, #BDD962)' : '3px solid transparent',
        backgroundColor: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        transition: 'all 0.25s ease',
        cursor: 'default',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          backgroundColor: hovered ? 'rgba(var(--web-primary-rgb, 37, 146, 127),0.25)' : 'rgba(var(--web-primary-rgb, 37, 146, 127),0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.25s',
        }}
      >
        <feature.icon size={20} color={hovered ? 'var(--web-light, #BDD962)' : 'var(--web-primary, #25927F)'} strokeWidth={2} />
      </div>
      <div>
        <div style={{ ...cardTitle, color: hovered ? '#ffffff' : 'rgba(255,255,255,0.85)', transition: 'color 0.25s' }}>
          {feature.title}
        </div>
        <div style={{ ...cardBody, color: 'rgba(255,255,255,0.4)', transition: 'color 0.25s' }}>
          {feature.desc}
        </div>
      </div>
      <CheckCircle
        size={16}
        style={{ marginLeft: 'auto', flexShrink: 0, color: 'var(--web-primary, #25927F)', opacity: hovered ? 1 : 0, transition: 'opacity 0.25s', marginTop: '2px' }}
      />
    </div>
  )
}
