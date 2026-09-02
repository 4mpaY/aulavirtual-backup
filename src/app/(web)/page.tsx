'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { GraduationCap, Video, Monitor, PlayCircle, BadgeCheck, Briefcase, ArrowRight, BookOpen, Clock, Tag, Laptop, Globe, Leaf, Building2, Cpu, Layers, Award, Rocket, Sparkles, CheckCircle2, Compass, ShieldCheck, TrendingUp, ChevronLeft, ChevronRight, Play, Pause, Check } from 'lucide-react'

import TeachersSection from '@/features/web/home/components/TeachersSection'

export default function HomePage() {
  return (
    <main style={{ background: '#ffffff' }}>
      <Hero />
      <CapacitacionesSection />
      <NuestrasEscuelas />
      <MensajeInstitucional />
      <Metodologia />
      <DocentesHomeSection />
      {/* <Benefits /> */}
      {/* <Stats /> */}
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
    subtitle: '2050 PERÚ',
    description: 'Formación práctica e integral en Tecnología, Gerencia, Gestión Social y Desarrollo Sostenible, y visión empresarial orientado a mejorar y fortalecer la empleabilidad.',
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
              top: '46%',
              transform: `translateY(-50%) translateX(${current === idx ? 0 : 32}px)`,
              opacity: current === idx ? 1 : 0,
              transition: 'opacity 1s ease, transform 1s ease',
              maxWidth: '640px',
              pointerEvents: current === idx ? 'auto' : 'none',
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
            }}
          >
            <span style={{ display: 'inline-block', fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', padding: '0.4rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.2)', marginBottom: 'clamp(0.75rem, 2vh, 1.5rem)' }}>
              {slide.eyebrow}
            </span>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 0.9, display: 'flex', flexDirection: 'column', marginBottom: 'clamp(0.75rem, 2vh, 1.5rem)' }}>
              <span style={{ fontSize: 'clamp(2rem, 8vw, 5.5rem)' }}>{slide.title}</span>
              <span style={{ fontSize: 'clamp(1.2rem, 5vw, 3rem)', opacity: 0.8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{slide.subtitle}</span>
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.85rem, 2vw, 1.15rem)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 'clamp(1.25rem, 4vh, 3rem)' }}>
              {slide.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(0.75rem, 2vw, 1.25rem)' }}>
              <Link href="/cursos" className="btn-primary-agenda" style={{ fontSize: '0.9rem', padding: '0.75rem clamp(1.5rem, 4vw, 2.5rem)', color: '#fff' }}>
                Comenzar ahora <ArrowRight size={20} />
              </Link>
              <Link href="/nosotros" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem clamp(1.5rem, 4vw, 2.5rem)', borderRadius: '9999px', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#ffffff', border: '2px solid rgba(255,255,255,0.6)', background: 'transparent', textDecoration: 'none' }}>
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
            <div className="hidden sm:flex">
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

function CapacitacionesSection() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/web/catalogo')
      .then(r => r.json())
      .then(data => {
        const list = (data?.result?.courses || data?.courses || [])
          .filter((c: any) => c.tipo !== 'DIPLOMADO')
          .slice(0, 6)

        setCourses(list)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section style={{ padding: '7rem 0', background: '#ffffff' }}>
      <div className="container-page">
        {/* Header */}
        <div data-animate="fade-up" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3.5rem' }}>
          <div>
            <span className="eyebrow-agenda">Capacitaciones</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '1rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              Programas diseñados para{' '}
              <span style={{ color: 'var(--agenda-primary)' }}>tu crecimiento</span>
            </h2>
          </div>
          <Link
            href="/cursos"
            className="btn-outline-agenda"
            style={{ fontSize: '0.9rem', padding: '0.75rem 1.75rem', whiteSpace: 'nowrap' }}
          >
            Ver todas <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ borderRadius: '2rem', background: '#f5f5f5', height: '360px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#999', fontFamily: 'Inter, sans-serif' }}>
            <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p>No hay capacitaciones disponibles por el momento.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }} className="stagger-container">
            {courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/cursos/${course.slug}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', borderRadius: '2rem', overflow: 'hidden', background: '#ffffff', border: '1px solid #e5e5e5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', transition: 'all 0.35s ease', color: 'inherit' }}
                data-animate="zoom-in-sm"
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement

                  el.style.transform = 'translateY(-6px)'
                  el.style.boxShadow = '0 20px 40px rgba(0,111,101,0.12)'
                  el.style.borderColor = 'var(--agenda-primary)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement

                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)'
                  el.style.borderColor = '#e5e5e5'
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', height: '180px', background: 'var(--agenda-accent)', overflow: 'hidden', flexShrink: 0 }}>
                  {course.miniatura ? (
                    <Image src={course.miniatura} alt={course.titulo} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={48} style={{ color: 'var(--agenda-primary)', opacity: 0.4 }} />
                    </div>
                  )}
                  {/* Categoría badge */}
                  {course.categoria?.nombre && (
                    <span style={{
                      position: 'absolute', top: '1rem', left: '1rem',
                      background: 'var(--agenda-primary)', color: '#fff',
                      fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 700,
                      padding: '0.25rem 0.75rem', borderRadius: '9999px', letterSpacing: '0.05em',
                    }}>
                      {course.categoria.nombre}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{
                    fontFamily: 'Outfit, sans-serif', fontWeight: 900,
                    fontSize: '1.1rem', color: '#1A1A1A', lineHeight: 1.3,
                    marginBottom: '0.75rem',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {course.titulo}
                  </h3>

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    {course.duracion && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#888' }}>
                        <Clock size={13} /> {course.duracion}
                      </span>
                    )}
                    {course.nivel && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#888' }}>
                        <Tag size={13} /> {course.nivel.charAt(0) + course.nivel.slice(1).toLowerCase()}
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      {course.es_gratis ? (
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: 'var(--agenda-primary)' }}>Gratis</span>
                      ) : (
                        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#1A1A1A' }}>
                          S/ {Number(course.precio).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      background: 'var(--agenda-accent)', color: 'var(--agenda-primary-dark)',
                      fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.8rem',
                      padding: '0.5rem 1rem', borderRadius: '9999px',
                    }}>
                      Ver más <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
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

const SCHOOLS = [
  {
    number: '01',
    title: 'Escuela de Tecnología e Innovación',
    slug: 'tecnologia-e-innovacion',
    image: '/images/escuelas/escuela-tecnologia.jpg',
    state: 'Disponible',
    isAvailable: true,
    stateColor: '#10b981',
    stateBg: 'rgba(16, 185, 129, 0.15)',
    stateBorder: 'rgba(16, 185, 129, 0.35)',
    desc: 'Fortalece competencias en programación, bases de datos, análisis de datos, inteligencia artificial y automatización para la industria moderna.',
    topics: ['Algoritmos', 'Python', 'POO', 'Bases de datos SQL', 'Power BI', 'Inteligencia Artificial', 'Automatización'],
    btnText: 'Explorar Escuela',
    href: '/escuelas/tecnologia-e-innovacion'
  },
  {
    number: '02',
    title: 'Escuela Ciudadano Digital 2050',
    slug: 'ciudadano-digital-2050',
    image: '/images/escuelas/ciudadano-digital.jpg',
    state: 'Disponible',
    isAvailable: true,
    stateColor: '#10b981',
    stateBg: 'rgba(16, 185, 129, 0.15)',
    stateBorder: 'rgba(16, 185, 129, 0.35)',
    desc: 'Acerca la inteligencia artificial y las herramientas digitales a profesionales, técnicos y ciudadanos de diferentes niveles de experiencia.',
    topics: ['IA para la vida y el trabajo', 'Prompt Engineering', 'Productividad con IA', 'Emprendimiento Digital', 'Python para no programadores'],
    btnText: 'Explorar Escuela',
    href: '/escuelas/ciudadano-digital-2050'
  },
  {
    number: '03',
    title: 'Escuela de Gestión Social y Desarrollo Sostenible',
    slug: 'gestion-social-desarrollo-sostenible',
    image: '/images/escuelas/gestion-social.jpg',
    state: 'Próximamente',
    isAvailable: false,
    stateColor: '#f59e0b',
    stateBg: 'rgba(245, 158, 11, 0.15)',
    stateBorder: 'rgba(245, 158, 11, 0.35)',
    desc: 'Capacidades de vanguardia para la gestión de relaciones comunitarias, responsabilidad social, prevención de conflictos socioambientales e inversión de impacto.',
    topics: ['Relaciones Comunitarias', 'Responsabilidad Social', 'Gestión de Conflictos', 'Desarrollo Territorial', 'Inversión Social', 'Proyectos de Inversión'],
    btnText: 'Próximamente'
  },
  {
    number: '04',
    title: 'Escuela ERP y Transformación Empresarial',
    slug: 'erp-transformacion-empresarial',
    image: '/images/escuelas/transformacion-empresarial.jpg',
    state: 'Mediante alianzas',
    isAvailable: false,
    stateColor: '#3b82f6',
    stateBg: 'rgba(59, 130, 246, 0.15)',
    stateBorder: 'rgba(59, 130, 246, 0.35)',
    desc: 'Especialización en sistemas integrados de gestión empresarial y transformación organizacional mediante alianzas estratégicas.',
    topics: ['Fundamentos ERP', 'SAP S/4HANA', 'SAP MM & SD', 'SAP Analytics', 'Gestión de Procesos'],
    btnText: 'Mediante alianzas'
  },
  {
    number: '05',
    title: 'Escuela de Gestión, Industria 5.0 e Innovación',
    slug: 'gestion-industria-5-0-innovacion',
    image: '/images/escuelas/gestion-proyectos.jpg',
    state: 'En desarrollo',
    isAvailable: false,
    stateColor: '#8b5cf6',
    stateBg: 'rgba(139, 92, 246, 0.15)',
    stateBorder: 'rgba(139, 92, 246, 0.35)',
    desc: 'Gestión ágil de proyectos, innovación tecnológica, gemelos digitales e industria 5.0 aplicada a operaciones de alta complejidad.',
    topics: ['Gestión de Proyectos', 'Industria 5.0', 'Gemelos Digitales', 'Liderazgo & Innovación', 'Transformación Digital'],
    btnText: 'En desarrollo'
  },
]

function NuestrasEscuelas() {
  return (
    <section style={{ padding: '7rem 0', background: 'linear-gradient(180deg, #f8faf9 0%, #ffffff 100%)', position: 'relative' }}>
      <div className="container-page">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', marginBottom: '4.5rem' }} data-animate="fade-up">
          <span className="eyebrow-agenda">PLAN AGENDA 2050</span>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)', letterSpacing: '-0.03em', marginTop: '1rem', marginBottom: '1.25rem', color: '#1A1A1A', lineHeight: 1.15 }}>
            Nuestras <span style={{ color: 'var(--agenda-primary)' }}>Escuelas de Formación</span>
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#555', lineHeight: 1.75 }}>
            El PLAN AGENDA 2050 articula progresivamente su oferta académica en cinco escuelas estratégicas que responden a los desafíos del mercado profesional, tecnológico y social.
          </p>
        </div>

        {/* Grid de Tarjetas Horizontales (2 por fila) */}
        <div className="schools-grid-2col stagger-container">
          {SCHOOLS.map((school, i) => (
            <div
              key={i}
              data-animate="zoom-in-sm"
              className="school-card-horizontal"
            >
              {/* Columna Izquierda: Imagen + Badges */}
              <div className="school-card-image-col">
                <Image
                  src={school.image}
                  alt={school.title}
                  fill
                  className="school-card-img"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
                {/* Degradado envolvente */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(1, 45, 34, 0.2) 0%, rgba(1, 45, 34, 0.85) 100%)'
                  }}
                />

                {/* Badges Flotantes sobre la Imagen */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    right: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.4rem',
                    zIndex: 2
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      color: '#ffffff',
                      background: 'rgba(255, 255, 255, 0.18)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(255, 255, 255, 0.25)'
                    }}
                  >
                    ESCUELA {school.number}
                  </span>

                  <span
                    style={{
                      background: school.stateBg,
                      color: school.stateColor,
                      border: `1px solid ${school.stateBorder}`,
                      backdropFilter: 'blur(8px)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      fontFamily: 'Outfit, sans-serif',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: school.stateColor, display: 'inline-block' }} />
                    {school.state}
                  </span>
                </div>
              </div>

              {/* Columna Derecha: Contenido, Temas y Acción */}
              <div className="school-card-content-col">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Título de la Escuela */}
                  <h3
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      color: '#012d22',
                      lineHeight: 1.25,
                      margin: 0
                    }}
                  >
                    {school.title}
                  </h3>

                  {/* Descripción */}
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', color: '#555', lineHeight: 1.6, margin: 0 }}>
                    {school.desc}
                  </p>

                  {/* Áreas de Especialización */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--agenda-primary)' }} />
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                        Áreas de Especialización:
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {school.topics.map((t, j) => (
                        <span
                          key={j}
                          style={{
                            background: '#f4f8f6',
                            border: '1px solid #dce8e2',
                            padding: '0.28rem 0.65rem',
                            borderRadius: '0.55rem',
                            fontSize: '0.76rem',
                            fontFamily: 'Inter, sans-serif',
                            color: '#2d3748',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botón CTA alineado al fondo */}
                <div style={{ marginTop: '1.25rem', paddingTop: '0.5rem' }}>
                  {school.isAvailable && school.href ? (
                    <Link
                      href={school.href}
                      className="btn-primary-agenda"
                      style={{
                        padding: '0.75rem 1.25rem',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        width: '100%',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg, #012d22 0%, #025E44 100%)',
                        color: '#ffffff',
                        boxShadow: '0 6px 16px rgba(2, 94, 68, 0.25)',
                        border: 'none',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {school.btnText} <ArrowRight size={16} color="#BDD962" />
                    </Link>
                  ) : (
                    <div
                      style={{
                        padding: '0.75rem 1.25rem',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.84rem',
                        fontWeight: 800,
                        fontFamily: 'Outfit, sans-serif',
                        width: '100%',
                        borderRadius: '999px',
                        background: 'rgba(2, 94, 68, 0.05)',
                        border: '1.5px solid #d8e5df',
                        color: '#025E44',
                        cursor: 'default',
                        userSelect: 'none'
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: school.stateColor,
                          display: 'inline-block'
                        }}
                      />
                      <span>{school.btnText}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MensajeInstitucional() {
  return (
    <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #012d22 0%, #025E44 100%)', color: '#fff', overflow: 'hidden' }}>
      <div className="container-page relative">
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, pointerEvents: 'none' }}>
          <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div data-animate="fade-right">
            <span style={{ display: 'inline-block', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#BDD962', marginBottom: '1.5rem' }}>
              Mensaje Institucional
            </span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.03em', marginBottom: '2rem', lineHeight: 1.1 }}>
              El futuro se construye con <span style={{ color: '#BDD962' }}>conocimiento e innovación</span>
            </h2>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p>
                En AGENDA 2050 PERÚ creemos que el aprendizaje permanente es una de las principales herramientas para afrontar los cambios tecnológicos, profesionales y sociales de nuestro tiempo.
              </p>
              <p>
                Nuestra trayectoria institucional comenzó en 2017 y continúa evolucionando a través de nuevas propuestas de capacitación, una plataforma propia de aprendizaje y una visión estratégica orientada al año 2050.
              </p>
              <p>
                Nuestro compromiso es ofrecer experiencias de aprendizaje prácticas, accesibles y conectadas con la realidad, que permitan a ciudadanos, técnicos, profesionales y organizaciones fortalecer sus capacidades y generar nuevas oportunidades.
              </p>
              <p style={{ fontStyle: 'italic', color: '#BDD962', fontWeight: 600 }}>
                El futuro se construye con conocimiento, innovación y personas dispuestas a seguir aprendiendo.
              </p>
            </div>
            <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)', position: 'relative' }}>
                <Image src="/images/agenda/fondo5050.png" alt="Ing. Roberto Tello Yuen" width={80} height={80} style={{ objectFit: 'cover', objectPosition: 'top center' }} />
              </div>
              <div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.2rem', color: '#fff' }}>Ing. Roberto Tello Yuen</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Gerente General, AGENDA 2050 PERÚ</p>
              </div>
            </div>
          </div>
          <div data-animate="fade-left" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '450px', aspectRatio: '1/1' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', borderRadius: '3rem', transform: 'rotate(-5deg)' }} />
              <div style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: '3rem', overflow: 'hidden' }}>
                <Image src="/images/agenda/fondo5050.png" alt="Ing. Roberto Tello Yuen" fill style={{ objectFit: 'cover', objectPosition: 'top center' }} priority />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Metodologia() {
  const [activeStep, setActiveStep] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)

  const steps = [
    {
      number: '01',
      tag: 'Fase Inicial',
      title: 'Curso Independiente',
      desc: 'Capacitación puntual y altamente especializada para resolver una necesidad inmediata de actualización profesional o técnica.',
      benefit: 'Acceso directo a habilidades de alta demanda sin requisitos previos.',
      icon: BookOpen,
      color: '#25927F',
      deliverable: 'Certificado Individual',
      milestone: 'Adquisición de Habilidades Específicas',
      highlights: [
        'Enfoque 100% práctico y de aplicación inmediata',
        'Contenido actualizado con metodologías vigentes',
        'Evaluación continua y constancia de aprobación',
      ],
    },
    {
      number: '02',
      tag: 'Articulación',
      title: 'Ruta de Aprendizaje',
      desc: 'Conjunto estructurado de cursos complementarios organizados en una secuencia pedagógica articulada de creciente complejidad.',
      benefit: 'Visión integral del área de especialización y sinergia entre módulos.',
      icon: Layers,
      color: '#025E44',
      deliverable: 'Módulos Integrados',
      milestone: 'Dominio de Especialidad Integral',
      highlights: [
        'Secuencia modular lógica y progresiva',
        'Casos reales y proyectos formativos aplicados',
        'Acompañamiento docente especializado',
      ],
    },
    {
      number: '03',
      tag: 'Acreditación',
      title: 'Certificación Integral',
      desc: 'Valida tu dominio recibiendo certificados por cada curso individual y un diploma acreditado por la ruta completa aprobada.',
      benefit: 'Doble respaldo verificable con código QR institucional oficial.',
      icon: Award,
      color: '#25927F',
      deliverable: 'Diploma con Código QR',
      milestone: 'Respaldo Institucional Oficial',
      highlights: [
        'Certificaciones modulares independientes',
        'Diploma integral de programa especializado',
        'Verificación digital inmediata y segura',
      ],
    },
    {
      number: '04',
      tag: 'Impacto Real',
      title: 'Competencias Laborales',
      desc: 'Aplicación directa de lo aprendido a través de proyectos prácticos, estudios de caso y metodologías del mercado actual.',
      benefit: 'Mayor competitividad y preparación para liderar desafíos profesionales.',
      icon: Briefcase,
      color: '#025E44',
      deliverable: 'Portafolio de Aplicación',
      milestone: 'Competitividad & Empleabilidad',
      highlights: [
        'Resolución de casos del sector productivo',
        'Herramientas y estándares de la industria',
        'Habilidades para liderar equipos técnicos',
      ],
    },
    {
      number: '05',
      tag: 'Visión 2050',
      title: 'Aprendizaje Permanente',
      desc: 'Evolución continua para mantenerte a la vanguardia de la transformación digital, la sostenibilidad y la gestión estratégica del futuro.',
      benefit: 'Comunidad activa, networking y actualización constante a largo plazo.',
      icon: Rocket,
      color: '#BDD962',
      deliverable: 'Comunidad & Lifelong Learning',
      milestone: 'Actualización y Liderazgo Futuro',
      highlights: [
        'Acceso a masterclasses y eventos exclusivos',
        'Red de networking con profesionales del sector',
        'Programas de actualización hacia la Agenda 2050',
      ],
    },
  ]

  const pillars = [
    {
      icon: CheckCircle2,
      title: 'Flexibilidad Inmediata',
      desc: 'Inicia con el curso que necesitas hoy y avanza según tu propia disponibilidad de tiempo.',
    },
    {
      icon: Compass,
      title: 'Rutas Estratégicas',
      desc: 'Conecta materias afines en programas modulares proyectados hacia el mercado del 2050.',
    },
    {
      icon: ShieldCheck,
      title: 'Certificación Dual',
      desc: 'Obtén acreditaciones individuales y diplomas integrales con validación institucional.',
    },
  ]

  const DURATION = 6000 // 6 seconds per step

  // Autoplay Timer Effect
  useEffect(() => {
    if (!isPlaying) return

    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, (elapsed / DURATION) * 100)

      setProgress(pct)

      if (elapsed >= DURATION) {
        clearInterval(interval)
        setActiveStep(curr => (curr + 1) % steps.length)
        setProgress(0)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [isPlaying, activeStep, steps.length])

  const handleStepSelect = (idx: number) => {
    setActiveStep(idx)
    setProgress(0)
  }

  const handlePrev = () => {
    setActiveStep(curr => (curr === 0 ? steps.length - 1 : curr - 1))
    setProgress(0)
  }

  const handleNext = () => {
    setActiveStep(curr => (curr + 1) % steps.length)
    setProgress(0)
  }

  const current = steps[activeStep]
  const CurrentIcon = current.icon

  return (
    <section style={{ padding: '7rem 0', background: 'linear-gradient(180deg, #ffffff 0%, #f4f9f7 50%, #ffffff 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Elementos decorativos de fondo */}
      <div style={{ position: 'absolute', top: '5%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(37,146,127,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(189,217,98,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container-page" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Principal */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 3.5rem' }} data-animate="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eef8f5', border: '1px solid #d3eee7', padding: '0.4rem 1rem', borderRadius: '999px', marginBottom: '1.25rem' }}>
            <Sparkles size={16} color="var(--agenda-primary)" />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.82rem', fontWeight: 800, color: 'var(--agenda-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Modelo Educativo & Metodología
            </span>
          </div>

          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 3.6vw, 3rem)', letterSpacing: '-0.03em', color: '#1A1A1A', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            Nuestro Modelo de <span style={{ color: 'var(--agenda-primary)' }}>Formación Progresiva</span>
          </h2>

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#555', lineHeight: 1.75, maxWidth: '780px', margin: '0 auto' }}>
            En <strong style={{ color: '#1A1A1A' }}>AGENDA 2050 PERÚ</strong> estructuramos tu crecimiento en 5 etapas continuas y articuladas, diseñadas para transformar tus competencias desde el primer día.
          </p>
        </div>

        {/* 3 Pilares Destacados */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
          {pillars.map((p, i) => (
            <div
              key={i}
              data-animate="fade-up"
              style={{
                background: '#ffffff',
                border: '1px solid #e7efe9',
                borderRadius: '1.5rem',
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget

                el.style.transform = 'translateY(-4px)'
                el.style.borderColor = 'var(--agenda-primary)'
                el.style.boxShadow = '0 12px 30px rgba(37,146,127,0.08)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget

                el.style.transform = 'translateY(0)'
                el.style.borderColor = '#e7efe9'
                el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #eaf6f2 0%, #d8f1e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--agenda-primary)', flexShrink: 0 }}>
                <p.icon size={24} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1A1A1A', marginBottom: '0.35rem' }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', lineHeight: 1.5, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CONTENEDOR PRINCIPAL: LÍNEA DE TIEMPO & CARRUSEL INTERACTIVO */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '2.5rem',
            padding: 'clamp(2rem, 4vw, 3.5rem)',
            border: '1px solid #e2ebe6',
            boxShadow: '0 24px 60px rgba(1,45,34,0.06)',
            position: 'relative',
          }}
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Header de la Trayectoria */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--agenda-primary)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 800, color: 'var(--agenda-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Trayectoria del Estudiante
                </span>
              </div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.6rem, 2.8vw, 2.25rem)', color: '#1A1A1A', letterSpacing: '-0.02em', margin: 0 }}>
                5 Etapas de tu Evolución Académica
              </h3>
            </div>

            {/* Controles del Carrusel (Play/Pause, Anterior, Siguiente) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#f4f8f6', padding: '0.4rem 0.6rem', borderRadius: '999px', border: '1px solid #e3ede8' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pausar avance automático' : 'Reanudar avance automático'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isPlaying ? 'var(--agenda-primary)' : '#ffffff',
                  color: isPlaying ? '#ffffff' : '#012d22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
              </button>

              <div style={{ width: '1px', height: '20px', background: '#d6e4de' }} />

              <button
                onClick={handlePrev}
                title="Etapa anterior"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#ffffff',
                  color: '#012d22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--agenda-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = '#012d22')}
              >
                <ChevronLeft size={18} />
              </button>

              <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.85rem', color: '#012d22', padding: '0 0.4rem', minWidth: '42px', textAlign: 'center' }}>
                {activeStep + 1} / {steps.length}
              </span>

              <button
                onClick={handleNext}
                title="Siguiente etapa"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#ffffff',
                  color: '#012d22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--agenda-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = '#012d22')}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* LÍNEA DE TIEMPO INTERACTIVA (STEPPER HORIZONTAL CONECTADO) */}
          <div style={{ position: 'relative', marginBottom: '2.5rem', padding: '1rem 0.5rem 0' }}>
            {/* Barra base conectora */}
            <div
              style={{
                position: 'absolute',
                top: 'calc(1rem + 20px)',
                left: '4%',
                right: '4%',
                height: '4px',
                background: '#e9f1ed',
                borderRadius: '999px',
                zIndex: 0,
              }}
            >
              {/* Barra de progreso animada */}
              <div
                style={{
                  height: '100%',
                  width: `${(activeStep / (steps.length - 1)) * 100}%`,
                  background: 'linear-gradient(90deg, #025E44 0%, #25927F 60%, #BDD962 100%)',
                  borderRadius: '999px',
                  transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>

            {/* Nodos de la línea de tiempo */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', position: 'relative', zIndex: 1 }}>
              {steps.map((s, idx) => {
                const isActive = activeStep === idx
                const isPast = activeStep > idx
                const StepIcon = s.icon

                return (
                  <div
                    key={idx}
                    onClick={() => handleStepSelect(idx)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    {/* Botón Circular del Nodo */}
                    <div
                      style={{
                        width: isActive ? '46px' : '40px',
                        height: isActive ? '46px' : '40px',
                        borderRadius: '50%',
                        background: isActive
                          ? 'linear-gradient(135deg, #012d22 0%, #025E44 100%)'
                          : isPast
                            ? '#25927F'
                            : '#ffffff',
                        border: isActive
                          ? '3px solid #BDD962'
                          : isPast
                            ? '3px solid #25927F'
                            : '3px solid #dbe6e0',
                        color: isActive ? '#BDD962' : isPast ? '#ffffff' : '#888888',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: isActive ? '0.95rem' : '0.85rem',
                        fontFamily: 'Outfit, sans-serif',
                        boxShadow: isActive
                          ? '0 0 0 5px rgba(37,146,127,0.18), 0 8px 20px rgba(1,45,34,0.2)'
                          : '0 2px 6px rgba(0,0,0,0.04)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {isPast ? <Check size={16} strokeWidth={3} /> : s.number}
                    </div>

                    {/* Texto debajo del nodo (oculto en pantallas muy pequeñas vía mediaquery o visualmente compacto) */}
                    <div style={{ marginTop: '0.65rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'block',
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: isActive ? 'var(--agenda-primary)' : isPast ? '#025E44' : '#8a9a92',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {s.tag}
                      </span>
                      <span
                        className="hidden sm:block"
                        style={{
                          fontFamily: 'Outfit, sans-serif',
                          fontSize: '0.82rem',
                          fontWeight: isActive ? 800 : 600,
                          color: isActive ? '#1A1A1A' : '#6b7a72',
                          lineHeight: 1.2,
                          marginTop: '0.15rem',
                          maxWidth: '130px',
                        }}
                      >
                        {s.title}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* TARJETA SPOTLIGHT DE LA ETAPA ACTIVA */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f8fbf9 0%, #f0f7f4 100%)',
              border: '1.5px solid #dbe8e1',
              borderRadius: '2rem',
              padding: 'clamp(1.75rem, 3.5vw, 2.75rem)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(1,45,34,0.04)',
            }}
          >
            {/* Barra de progreso de tiempo del paso actual */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #025E44 0%, #25927F 100%)',
                  transition: 'width 0.06s linear',
                }}
              />
            </div>

            {/* Número gigante decorativo en marca de agua */}
            <span
              style={{
                position: 'absolute',
                right: '2rem',
                top: '0.5rem',
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(5rem, 12vw, 9.5rem)',
                color: 'rgba(37,146,127,0.06)',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {current.number}
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
              {/* Lado Izquierdo: Descripción y Puntos Clave */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--agenda-primary)',
                      background: 'rgba(37,146,127,0.12)',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '999px',
                    }}
                  >
                    Etapa {current.number} • {current.tag}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#6a7d74', fontWeight: 600 }}>
                    {current.milestone}
                  </span>
                </div>

                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 2.5vw, 2.1rem)', color: '#1A1A1A', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '0.9rem' }}>
                  {current.title}
                </h4>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#555', lineHeight: 1.65, marginBottom: '1.5rem', maxWidth: '580px' }}>
                  {current.desc}
                </p>

                {/* Lista de características / Puntos clave */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem' }}>
                  {current.highlights.map((point, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(37,146,127,0.15)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={13} strokeWidth={3} />
                      </div>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#2a3b34', fontWeight: 500 }}>
                        {point}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Micro-beneficio destacado */}
                <div style={{ background: '#ffffff', border: '1px solid #dce8e1', borderRadius: '1rem', padding: '0.85rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <TrendingUp size={16} color="var(--agenda-primary)" style={{ flexShrink: 0 }} />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#025E44', fontWeight: 700 }}>
                    {current.benefit}
                  </span>
                </div>
              </div>

              {/* Lado Derecho: Tarjeta Visual de Credencial / Hito Alcanzado */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '360px',
                    background: 'linear-gradient(145deg, #012d22 0%, #025E44 100%)',
                    borderRadius: '1.75rem',
                    padding: '2rem',
                    color: '#ffffff',
                    boxShadow: '0 20px 40px rgba(1,45,34,0.22)',
                    border: '1px solid rgba(189,217,98,0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glow decorativo de fondo */}
                  <div style={{ position: 'absolute', top: '-30%', right: '-30%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(189,217,98,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

                  {/* Icono central de la etapa */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BDD962', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <CurrentIcon size={28} />
                    </div>
                    <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '-0.02em' }}>
                      {current.number}
                    </span>
                  </div>

                  {/* Hito y Entregable */}
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#BDD962' }}>
                    Entregable / Reconocimiento
                  </span>
                  <h5 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#ffffff', margin: '0.35rem 0 1rem', lineHeight: 1.25 }}>
                    {current.deliverable}
                  </h5>

                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)', margin: '1rem 0' }} />

                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: 0 }}>
                    {activeStep < 4
                      ? `Completa esta etapa para desbloquear la etapa 0${activeStep + 2}: "${steps[activeStep + 1].title}".`
                      : '¡Culminación de ciclo! Te proyectas como un líder técnico y estratégico preparado para la Agenda 2050.'}
                  </p>

                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                    {activeStep < 4 ? (
                      <button
                        onClick={handleNext}
                        style={{
                          width: '100%',
                          background: '#BDD962',
                          color: '#012d22',
                          border: 'none',
                          borderRadius: '0.85rem',
                          padding: '0.75rem 1rem',
                          fontFamily: 'Outfit, sans-serif',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          transition: 'transform 0.2s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                      >
                        Siguiente Etapa <ChevronRight size={16} />
                      </button>
                    ) : (
                      <Link
                        href="/cursos"
                        style={{
                          width: '100%',
                          background: '#BDD962',
                          color: '#012d22',
                          border: 'none',
                          borderRadius: '0.85rem',
                          padding: '0.75rem 1rem',
                          fontFamily: 'Outfit, sans-serif',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          textDecoration: 'none',
                          textAlign: 'center',
                        }}
                      >
                        Comenzar tu Trayectoria <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SELECTOR MINI DE LAS 5 ETAPAS (MINI CARDS RAIL) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem', marginTop: '1.5rem' }}>
            {steps.map((step, idx) => {
              const isSelected = activeStep === idx
              const StepIcon = step.icon

              return (
                <div
                  key={idx}
                  onClick={() => handleStepSelect(idx)}
                  style={{
                    background: isSelected ? '#ffffff' : '#f8faf9',
                    border: isSelected ? '2px solid var(--agenda-primary)' : '1px solid #e7efe9',
                    borderRadius: '1.25rem',
                    padding: '1rem 0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: isSelected ? '0 8px 20px rgba(37,146,127,0.12)' : 'none',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#ffffff'
                      e.currentTarget.style.borderColor = '#c6ded4'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f8faf9'
                      e.currentTarget.style.borderColor = '#e7efe9'
                    }
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isSelected ? 'var(--agenda-primary)' : 'rgba(37,146,127,0.08)',
                      color: isSelected ? '#ffffff' : 'var(--agenda-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <StepIcon size={18} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 800, color: isSelected ? 'var(--agenda-primary)' : '#8a9a92' }}>
                        {step.number}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.82rem', color: isSelected ? '#1A1A1A' : '#555', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {step.title}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Estadísticas / Proyecciones Destacadas */}
          <div style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid #edf2ee', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1.25rem' }}>
            {[
              { title: '5', subtitle: 'Escuelas de Formación Continua', icon: GraduationCap },
              { title: '21', subtitle: 'Rutas de Aprendizaje Proyectadas', icon: Compass },
              { title: '+30', subtitle: 'Cursos de Alta Especialización', icon: BookOpen },
              { title: '100%', subtitle: 'Certificados Individuales e Integrales', icon: Award },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: '#f8faf9',
                  border: '1px solid #e6eee9',
                  borderRadius: '1.25rem',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                  e.currentTarget.style.borderColor = 'var(--agenda-primary)'
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(37,146,127,0.06)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#f8faf9'
                  e.currentTarget.style.borderColor = '#e6eee9'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(37,146,127,0.1)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <stat.icon size={22} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.65rem', color: 'var(--agenda-primary)', lineHeight: 1, margin: '0 0 0.25rem 0' }}>
                    {stat.title}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#555', lineHeight: 1.3, margin: 0, fontWeight: 500 }}>
                    {stat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA inferior de la sección */}
          <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link
              href="/cursos"
              className="btn-primary-agenda"
              style={{ fontSize: '0.92rem', padding: '0.85rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Explorar Capacitaciones <ArrowRight size={18} />
            </Link>
            <Link
              href="/nosotros"
              className="btn-outline-agenda"
              style={{ fontSize: '0.92rem', padding: '0.85rem 2rem' }}
            >
              Conocer Propuesta Académica
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function DocentesHomeSection() {
  const [teachers, setTeachers] = useState<any[]>([])
  const [mostrar, setMostrar] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/web/docentes')
      .then(r => r.json())
      .then(data => {
        const payload = data?.result || data || {}

        setTeachers(payload.teachers || [])
        setMostrar(payload.mostrar_en_inicio !== false)
      })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !mostrar || teachers.length === 0) return null

  return <TeachersSection teachers={teachers} />
}




