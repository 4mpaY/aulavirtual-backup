'use client'

import { Heart, Lightbulb, Users, TrendingUp, ShieldCheck } from 'lucide-react'

import { eyebrow, sectionH2, sectionDesc, cardTitle, cardBody } from '@/features/web/home/components/typography'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'

const valores = [
  {
    icon: TrendingUp,
    title: 'Resultados Reales',
    desc: 'Cada estrategia que enseñamos está diseñada para generar ventas y crecimiento tangible en tu negocio desde el primer día.',
  },
  {
    icon: Lightbulb,
    title: 'Innovación Constante',
    desc: 'Nos mantenemos a la vanguardia de TikTok Ads, Meta Ads e Inteligencia Artificial para ofrecerte siempre lo más actual y efectivo.',
  },
  {
    icon: Users,
    title: 'Comunidad',
    desc: 'Creemos en el poder de los emprendedores conectados. Juntos aprendemos, crecemos y nos impulsamos mutuamente hacia el éxito.',
  },
  {
    icon: Heart,
    title: 'Educación Práctica',
    desc: 'No teoría vacía: cada curso y asesoría está enfocado en aplicar, ejecutar y obtener resultados concretos en tu negocio.',
  },
  {
    icon: ShieldCheck,
    title: 'Acompañamiento',
    desc: 'Estamos contigo en cada paso, desde el aprendizaje hasta la implementación de tu estrategia digital con soporte personalizado.',
  },
]

/* ── Misión / Visión ────────────────────────────────────── */
export function MisionVisionSection() {
  return (
    <section style={{ backgroundColor: '#f8fafc', padding: '5rem 1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ ...eyebrow, display: 'block', textAlign: 'center' }}>Quiénes somos</p>
            <h2 style={{ ...sectionH2, textAlign: 'center' }}>Misión y Visión</h2>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Misión */}
          <ScrollReveal direction="left" delay={0.05}>
            <MisionCard />
          </ScrollReveal>

          {/* Visión */}
          <ScrollReveal direction="right" delay={0.1}>
            <VisionCard />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

function MisionCard() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1.5px solid hsl(214,20%,91%)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 16px 40px rgba(var(--web-primary-rgb, 37, 146, 127),0.14)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'
      }}
    >
      <div
        style={{
          height: '200px',
          background: 'linear-gradient(135deg, var(--web-dark, #025E44) 0%, var(--web-primary, #25927F) 60%, #3AB079 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div
          style={{
            width: '80px', height: '80px', borderRadius: '24px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.2)',
            position: 'relative', zIndex: 1,
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>🎯</span>
        </div>
      </div>
      <div style={{ padding: '1.75rem 2rem 2rem' }}>
        <h3 style={{ ...cardTitle, fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--web-dark, #025E44)' }}>
          Nuestra Misión
        </h3>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#334155', lineHeight: 1.75, fontStyle: 'italic' }}>
          &quot;Ayudar a emprendedores y dueños de negocios a crecer mediante capacitación práctica,
          asesorías personalizadas y estrategias digitales efectivas, utilizando herramientas como
          TikTok Ads, Meta Ads, inteligencia artificial y ventas digitales para generar resultados reales.&quot;
        </p>
      </div>
    </div>
  )
}

function VisionCard() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        border: '1.5px solid hsl(214,20%,91%)',
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 16px 40px rgba(var(--web-light-rgb, 189, 217, 98),0.18)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(0)'
        el.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'
      }}
    >
      <div
        style={{
          height: '200px',
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1a2e20 60%, var(--web-dark, #025E44) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(var(--web-light-rgb, 189, 217, 98),0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div
          style={{
            width: '80px', height: '80px', borderRadius: '24px',
            backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(var(--web-light-rgb, 189, 217, 98),0.25)',
            position: 'relative', zIndex: 1,
          }}
        >
          <span style={{ fontSize: '2.5rem' }}>🔭</span>
        </div>
      </div>
      <div style={{ padding: '1.75rem 2rem 2rem' }}>
        <h3 style={{ ...cardTitle, fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--web-dark, #025E44)' }}>
          Nuestra Visión
        </h3>
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', color: '#334155', lineHeight: 1.75, fontStyle: 'italic' }}>
          &quot;Ser la empresa líder en capacitación y consultoría de marketing digital en Perú y
          Latinoamérica, reconocida por transformar emprendedores en negocios rentables mediante
          la innovación, la educación práctica y el uso estratégico de la tecnología.&quot;
        </p>
      </div>
    </div>
  )
}

/* ── Valores ─────────────────────────────────────────────── */
export function ValoresSection() {
  return (
    <section style={{ backgroundColor: '#ffffff', padding: '5rem 1.5rem', borderTop: '1px solid hsl(214,20%,92%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 3.5rem' }}>
            <p style={{ ...eyebrow, display: 'block', textAlign: 'center' }}>Lo que nos define</p>
            <h2 style={{ ...sectionH2, textAlign: 'center' }}>Valores que nos identifican</h2>
            <p style={{ ...sectionDesc, textAlign: 'center', marginTop: '0.75rem' }}>
              &quot;La excelencia no es un acto, sino un hábito. Cada valor que practicamos a diario define quiénes somos y hacia dónde vamos.&quot;
            </p>
          </div>
        </ScrollReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {valores.map((v, i) => (
            <ScrollReveal key={i} delay={i * 0.06}>
              <ValorCard v={v} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ValorCard({ v }: { v: typeof valores[number] }) {
  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        border: '1.5px solid hsl(214,20%,92%)',
        textAlign: 'center',
        cursor: 'default',
        transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s, background-color 0.3s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 12px 36px rgba(var(--web-primary-rgb, 37, 146, 127),0.12)'
        el.style.borderColor = 'var(--web-primary, #25927F)'
        el.style.backgroundColor = '#ffffff'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'hsl(214,20%,92%)'
        el.style.backgroundColor = '#f8fafc'
      }}
    >
      <div
        style={{
          width: '60px', height: '60px', borderRadius: '18px',
          backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.25rem',
          border: '1.5px solid rgba(var(--web-primary-rgb, 37, 146, 127),0.2)',
        }}
      >
        <v.icon size={28} color="var(--web-primary, #25927F)" />
      </div>
      <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '0.625rem' }}>
        {v.title}
      </h3>
      <p style={{ ...cardBody, textAlign: 'center' }}>{v.desc}</p>
    </div>
  )
}

/* ── Historia ─────────────────────────────────────────────── */
export function HistoriaSection() {
  const hitos = [
    { emoji: '🎓', title: 'Raíces Académicas', desc: 'Nació del conocimiento y la visión compartida de un grupo de profesionales con formación MBA.' },
    { emoji: '🚀', title: 'Evolución a Agencia', desc: 'De la idea al siguiente nivel: de reuniones entre amigos a una agencia con impacto real en negocios.' },
    { emoji: '🤝', title: 'Compromiso con el Emprendedor', desc: 'Cada servicio está diseñado para generar resultados reales para emprendedores y dueños de negocios.' },
  ]

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '5rem 1.5rem', borderTop: '1px solid hsl(214,20%,92%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          <ScrollReveal direction="left">
            <div>
              <p style={{ ...eyebrow, display: 'block' }}>Nuestra historia</p>
              <h2 style={{ ...sectionH2, marginBottom: '1.25rem' }}>¿Cómo nació Abeja Smart?</h2>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#334155', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Abeja Smart nació de una conversación entre amigos durante una maestría MBA. Entre ideas, visiones y la pasión compartida por el marketing digital, un miembro del equipo tomó la decisión de dar el siguiente paso: llevar ese conocimiento al siguiente nivel como agencia.
              </p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#334155', lineHeight: 1.75 }}>
                Hoy, esa conversación se ha convertido en una plataforma que capacita y acompaña a cientos de emprendedores y dueños de negocios en su camino hacia el éxito digital.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {hitos.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '16px',
                    padding: '1.25rem 1.5rem',
                    border: '1.5px solid hsl(214,20%,91%)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#0A0A0A', marginBottom: '0.25rem' }}>{item.title}</div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
