'use client'

import { Heart, Lightbulb, Users, TrendingUp, ShieldCheck } from 'lucide-react'

import { eyebrow, sectionH2, sectionDesc, cardTitle, cardBody } from '@/features/web/home/components/typography'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'

const valores = [
  {
    icon: Heart,
    title: 'Compromiso',
    desc: 'Nos dedicamos plenamente a la formación de cada estudiante, acompañándolos en cada etapa de su aprendizaje.',
  },
  {
    icon: Lightbulb,
    title: 'Innovación',
    desc: 'Buscamos constantemente nuevas formas de enseñar y de acercar el conocimiento de manera más efectiva.',
  },
  {
    icon: Users,
    title: 'Trabajo en Equipo',
    desc: 'Creemos en la colaboración como motor del aprendizaje y el crecimiento colectivo.',
  },
  {
    icon: TrendingUp,
    title: 'Mejora Continua',
    desc: 'Actualizamos nuestros contenidos y metodologías para mantenernos a la vanguardia del sector.',
  },
  {
    icon: ShieldCheck,
    title: 'Integridad',
    desc: 'Actuamos con transparencia y honestidad, generando confianza en cada relación con nuestros estudiantes y empresas.',
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
          "Brindar formación profesional de alta calidad, accesible y orientada al sector industrial,
          impulsando el desarrollo de competencias que generan valor real en las organizaciones y en
          la carrera de nuestros estudiantes."
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
          "Ser la plataforma de referencia en formación profesional especializada en Latinoamérica,
          reconocida por la excelencia de sus contenidos, la solidez de sus certificaciones y su
          compromiso con la transformación del sector industrial."
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
              "La excelencia no es un acto, sino un hábito. Cada valor que practicamos a diario define quiénes somos y hacia dónde vamos."
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
