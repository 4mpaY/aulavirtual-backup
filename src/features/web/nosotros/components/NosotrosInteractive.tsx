'use client'

import { Heart, Lightbulb, Users, TrendingUp, ShieldCheck } from 'lucide-react'

import { eyebrow, sectionH2, sectionDesc, cardTitle, cardBody } from '@/features/web/home/components/typography'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'

const valores = [
  {
    icon: ShieldCheck,
    title: 'Integridad',
    desc: 'Actuamos con transparencia y honestidad en cada programa educativo, garantizando contenidos actualizados y docentes calificados.',
  },
  {
    icon: Lightbulb,
    title: 'Excelencia',
    desc: 'Buscamos los más altos estándares académicos, actualizando permanentemente nuestros contenidos según las necesidades del mercado educativo.',
  },
  {
    icon: Users,
    title: 'Compromiso',
    desc: 'Nos dedicamos plenamente a cada participante, acompañándolos en su crecimiento profesional con soporte continuo.',
  },
  {
    icon: TrendingUp,
    title: 'Innovación',
    desc: 'Aplicamos metodologías modernas y tecnología educativa para hacer la formación más accesible, práctica y efectiva.',
  },
  {
    icon: Heart,
    title: 'Vocación de Servicio',
    desc: 'Creemos en la educación como motor de transformación; por eso cada programa está diseñado con dedicación y enfoque en el éxito del participante.',
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
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.50)), url("https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
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
          <span style={{ fontSize: '2.5rem' }}>⚖️</span>
        </div>
      </div>
      <div style={{ padding: '1.75rem 2rem 2rem' }}>
        <h3 style={{ ...cardTitle, fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--web-dark, #025E44)' }}>
          Nuestra Misión
        </h3>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9375rem', color: '#334155', lineHeight: 1.75 }}>
          Brindar programas de capacitación, actualización y especialización de alta calidad, orientados al desarrollo profesional y académico de docentes y profesionales del Perú, mediante una enseñanza innovadora, accesible y práctica, apoyada en herramientas virtuales, docentes especializados y metodologías enfocadas en resultados reales.
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
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.50)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
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
          <span style={{ fontSize: '2.5rem' }}>🌟</span>
        </div>
      </div>
      <div style={{ padding: '1.75rem 2rem 2rem' }}>
        <h3 style={{ ...cardTitle, fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--web-dark, #025E44)' }}>
          Nuestra Visión
        </h3>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9375rem', color: '#334155', lineHeight: 1.75 }}>
          Ser una institución educativa líder a nivel nacional en formación y capacitación profesional, reconocida por su excelencia académica, innovación educativa y compromiso con el crecimiento de miles de estudiantes y docentes, contribuyendo al fortalecimiento de la educación y el desarrollo profesional en el Perú.
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
      <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', fontWeight: 700, color: '#0A0A0A', marginBottom: '0.625rem' }}>
        {v.title}
      </h3>
      <p style={{ ...cardBody, textAlign: 'center' }}>{v.desc}</p>
    </div>
  )
}
