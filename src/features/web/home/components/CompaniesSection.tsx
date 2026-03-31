'use client'

/* ─────────────────────────────────────────────
   CompaniesSection — B2B informativo
   • Stats destacadas
   • Lista de beneficios
   • Botón WhatsApp
   ───────────────────────────────────────────── */

import { CheckCircle, Users, Building2, TrendingUp, MessageCircle } from 'lucide-react'

import ScrollReveal from './ScrollReveal'
import { eyebrow, sectionH2, sectionDesc, cardTitle, cardBody, smallText } from './typography'

const WHATSAPP_NUMBER = '51900000000' // ← Reemplaza con el número real
const WHATSAPP_MSG = encodeURIComponent('Hola, me interesa conocer las soluciones de capacitación para mi empresa.')

const stats = [
  { icon: Building2, value: '+20', label: 'Empresas capacitadas' },
  { icon: Users, value: '+500', label: 'Profesionales formados' },
  { icon: TrendingUp, value: '98%', label: 'Tasa de satisfacción' },
]

const benefits = [
  'Planes corporativos con acceso ilimitado para tu equipo',
  'Estadísticas de progreso por colaborador y área',
  'Certificados con logo de tu empresa',
  'Soporte prioritario y gestor de cuenta dedicado',
  'Cursos personalizados según tus necesidades',
]

export default function CompaniesSection() {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`

  return (
    <section style={{ backgroundColor: 'hsl(167, 30%, 96%)', padding: '5rem 1rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '4rem',
            alignItems: 'center',
          }}
        >
          {/* ── Izquierda ── */}
          <ScrollReveal direction="left">
            <div>
              <p style={eyebrow}>Soluciones corporativas</p>
              <h2 style={sectionH2}>
                Capacita a tu equipo<br />
                <span style={{ color: '#25927F' }}>sin complicaciones</span>
              </h2>
              <p style={{ ...sectionDesc, marginBottom: '2rem' }}>
                Ofrecemos planes especiales para empresas que quieren mantener a sus colaboradores actualizados y certificados en las últimas tendencias del sector.
              </p>

              {/* Beneficios */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                {benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle size={18} style={{ color: '#25927F', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ ...cardBody, color: '#334155' }}>{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA WhatsApp */}
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.875rem 2rem',
                  borderRadius: '14px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement

                  el.style.backgroundColor = '#1ebe5d'
                  el.style.transform = 'scale(1.03)'
                  el.style.boxShadow = '0 6px 25px rgba(37,211,102,0.4)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement

                  el.style.backgroundColor = '#25D366'
                  el.style.transform = 'scale(1)'
                  el.style.boxShadow = '0 4px 20px rgba(37,211,102,0.3)'
                }}
              >
                <MessageCircle size={20} />
                Consultar por WhatsApp
              </a>
            </div>
          </ScrollReveal>

          {/* ── Derecha: stats ── */}
          <ScrollReveal direction="right" delay={0.15}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                    border: '1.5px solid hsl(167, 30%, 89%)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'default',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement

                    el.style.transform = 'translateX(8px)'
                    el.style.boxShadow = '0 8px 32px rgba(37,146,127,0.12)'
                    el.style.borderColor = '#25927F'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement

                    el.style.transform = 'translateX(0)'
                    el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'
                    el.style.borderColor = 'hsl(167, 30%, 89%)'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      backgroundColor: 'rgba(37,146,127,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <stat.icon size={28} color="#25927F" />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#0A0A0A', lineHeight: 1, letterSpacing: '-0.03em' }}>
                      {stat.value}
                    </div>
                    <div style={{ ...smallText, color: '#64748b', marginTop: '0.25rem' }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}

              {/* Card decorativa */}
              <div
                style={{
                  borderRadius: '20px',
                  padding: '1.5rem 2rem',
                  background: 'linear-gradient(135deg, #025E44 0%, #25927F 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span style={{ fontSize: '2rem' }}>🏆</span>
                <div>
                  <div style={{ ...cardTitle, color: '#ffffff', marginBottom: '0.25rem' }}>
                    Certificados con validez empresarial
                  </div>
                  <div style={{ ...smallText, color: 'rgba(255,255,255,0.65)' }}>
                    Reconocidos por las principales empresas del sector
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
