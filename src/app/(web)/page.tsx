'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { GraduationCap, Video, Monitor, PlayCircle, BadgeCheck, Briefcase, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main style={{ background: '#ffffff' }}>
      <Hero />
      <Benefits />
      <Stats />
      <section style={{ padding: '6rem 0', textAlign: 'center' }}>
        <div className="container-page">
          <h2
            data-animate="fade-up"
            style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginBottom: '2rem', color: '#1A1A1A' }}
          >
            ¿Listo para empezar?
          </h2>
          <div data-animate="fade-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link href="/cursos" className="btn-primary-agenda" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Explorar Capacitaciones <ArrowRight size={20} />
            </Link>
            <Link href="/contacto" className="btn-outline-agenda" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
              Hablar con un asesor
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

const HERO_SLIDES = [
  {
    image: '/images/agenda/hero.jpg',
    eyebrow: 'Liderazgo & Tecnología',
    title: 'AGENDA',
    subtitle: '2050',
    description: 'Forjando los expertos tecnológicos del mañana con formación práctica y visión empresarial.',
  },
  {
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'Formación Práctica',
    title: 'APRENDE',
    subtitle: 'HACIENDO',
    description: 'Cursos diseñados con un enfoque en el mercado laboral real y proyectos prácticos que te preparan para el éxito.',
  },
  {
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop',
    eyebrow: 'Comunidad Tech',
    title: 'CONECTA',
    subtitle: 'Y CRECE',
    description: 'Únete a más de 500 profesionales y expande tu red de contactos estratégicos en el mundo de la tecnología.',
  },
]

function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ position: 'relative', height: 'calc(100vh - var(--navbar-height))', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {HERO_SLIDES.map((slide, idx) => (
        <div key={idx} style={{ position: 'absolute', inset: 0, opacity: current === idx ? 1 : 0, transition: 'opacity 1s ease' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.58)', zIndex: 1 }} />
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            style={{ objectFit: 'cover', transform: current === idx ? 'scale(1.06)' : 'scale(1)', transition: 'transform 10s linear' }}
            priority={idx === 0}
          />
        </div>
      ))}

      <div style={{ position: 'absolute', inset: 0, zIndex: 2, backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')", opacity: 0.08 }} />

      <div className="container-page" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: `translateY(-50%) translateX(${current === idx ? 0 : 32}px)`,
              opacity: current === idx ? 1 : 0,
              transition: 'opacity 1s ease, transform 1s ease',
              maxWidth: '640px',
              pointerEvents: current === idx ? 'auto' : 'none',
            }}
          >
            <span style={{ display: 'inline-block', fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
              {slide.eyebrow}
            </span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 0.9, display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
              <span style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)' }}>{slide.title}</span>
              <span style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', opacity: 0.8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{slide.subtitle}</span>
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '3rem' }}>
              {slide.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem' }}>
              <Link href="/cursos" className="btn-primary-agenda" style={{ fontSize: '1rem', padding: '1rem 2.5rem', color: '#fff' }}>
                Comenzar ahora <ArrowRight size={20} />
              </Link>
              <Link href="/nosotros" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', borderRadius: '9999px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#ffffff', border: '2px solid rgba(255,255,255,0.6)', background: 'transparent', textDecoration: 'none' }}>
                Conócenos
              </Link>
            </div>
          </div>
        ))}
        <div style={{ height: '400px' }} />
      </div>

      {/* Bottom bar */}
      <div style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0, zIndex: 4 }}>
        <div className="container-page" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', background: 'rgba(0,111,101,0.3)', backdropFilter: 'blur(4px)', overflow: 'hidden', marginLeft: i > 1 ? '-12px' : 0 }}>
                  <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={42} height={42} />
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
              +500 Alumnos inscritos
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {HERO_SLIDES.map((_, idx) => (
              <button key={idx} onClick={() => setCurrent(idx)} style={{ height: '8px', borderRadius: '9999px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', width: current === idx ? '32px' : '8px', background: current === idx ? 'var(--agenda-primary)' : 'rgba(255,255,255,0.35)' }} aria-label={`Diapositiva ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const BENEFITS = [
  { icon: GraduationCap, title: 'Capacitaciones cortas y prácticas', text: 'Programas progresivos, aplicables y enfocados en resultados.' },
  { icon: Video, title: 'Clases en vivo por Zoom PRO', text: 'Sesiones con interacción directa y resolución de consultas.' },
  { icon: Monitor, title: 'Aula virtual', text: 'Materiales, tareas y recursos en una plataforma organizada.' },
  { icon: PlayCircle, title: 'Grabaciones disponibles', text: 'Repasa cada sesión cuando lo necesites.' },
  { icon: BadgeCheck, title: 'Certificación digital con QR', text: 'Certificados verificables emitidos por AGENDA PERÚ.' },
  { icon: Briefcase, title: 'Bono de empleabilidad', text: 'Seminario de LinkedIn, marca profesional y networking.' },
]

function Benefits() {
  return (
    <section className="bg-circuit" style={{ padding: '7rem 0', backgroundColor: '#fafafa' }}>
      <div className="container-page">
        {/* Imagen + texto */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
          <div data-animate="fade-right" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-1.5rem', background: 'rgba(0,111,101,0.08)', borderRadius: '3rem', filter: 'blur(40px)', zIndex: -1 }} />
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
              alt="Colaboración tecnológica"
              width={600}
              height={400}
              style={{ borderRadius: '3rem', boxShadow: '0 30px 60px -20px rgba(0,111,101,0.15)', border: '1px solid rgba(255,255,255,0.5)', width: '100%', height: 'auto' }}
            />
          </div>
          <div data-animate="fade-left">
            <span className="eyebrow-agenda">Nuestra Metodología</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '1.5rem', marginBottom: '1.5rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              Tu carrera merece un <span style={{ color: 'var(--agenda-primary)' }}>impulso real</span>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666666', lineHeight: 1.7 }}>
              Combinamos excelencia académica con herramientas de empleabilidad para asegurar que tu inversión se traduzca en resultados profesionales.
            </p>
          </div>
        </div>

        {/* 6 tarjetas — 3 columnas fijas en desktop */}
        <div className="benefits-grid stagger-container">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              data-animate="zoom-in-sm"
              style={{ borderRadius: '2rem', background: '#ffffff', border: '1px solid #e5e5e5', padding: '2rem', transition: 'all 0.4s ease' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--agenda-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--agenda-primary-dark)', marginBottom: '1.5rem' }}>
                <b.icon size={26} />
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1A1A1A', lineHeight: 1.3 }}>{b.title}</h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666666', lineHeight: 1.6 }}>{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section style={{ padding: '5rem 0', background: 'var(--agenda-primary)', color: '#ffffff' }}>
      <div className="container-page stagger-container stats-grid">
        {[
          { value: '+500', label: 'Alumnos' },
          { value: '100%', label: 'Práctico' },
          { value: '24/7', label: 'Aula Virtual' },
          { value: 'QR', label: 'Certificado' },
        ].map(s => (
          <div key={s.label} data-animate="fade-up">
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>{s.value}</p>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.65 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
