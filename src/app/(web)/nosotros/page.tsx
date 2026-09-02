import Image from 'next/image'
import Link from 'next/link'

import { Mail, Globe, Award, Sparkles, MapPin, Phone, CheckCircle2, Zap, Target, BrainCircuit, Compass, TrendingUp, Calendar, Laptop, ShieldCheck, Quote, Rocket } from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import TeachersSection from '@/features/web/home/components/TeachersSection'

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function parseBioSections(html: string): { title: string; content: string }[] {
  const sections: { title: string; content: string }[] = []
  const parts = html.split(/<h[1-3][^>]*>/i)

  for (const part of parts) {
    const closeMatch = part.match(/^(.*?)<\/h[1-3]>([\s\S]*)/i)

    if (closeMatch) {
      const title = stripHtml(closeMatch[1])
      const content = stripHtml(closeMatch[2])

      if (content) sections.push({ title, content })
    }
  }

  if (sections.length === 0) {
    const text = stripHtml(html)

    if (text) sections.push({ title: '', content: text })
  }

  return sections
}

export const metadata = {
  title: 'Nosotros — Dirección Académica',
  description: 'Conoce a nuestro equipo directivo, nuestra misión, visión y los valores que guían nuestra plataforma educativa.',
}

async function getTeachers() {
  try {
    return await prisma.usuario.findMany({
      where: { rol: 'PROFESOR' },
      select: { id: true, nombre: true, apellido: true, slug: true, avatar: true, cargo: true, biografia: true, _count: { select: { cursos_dictados: true } } },
      orderBy: { cursos_dictados: { _count: 'desc' } },
      take: 8,
    })
  } catch {
    return []
  }
}

export default async function NosotrosPage() {
  const [teachers, configs] = await Promise.all([getTeachers(), getConfigs()])
  const waNumber = configs.WHATSAPP_NUMERO || '51994356180'

  return (
    <main>
      {/* Encabezado */}
      <section style={{
        background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)',
        padding: '6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <span style={{ display: 'inline-block', fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#BDD962', marginBottom: '1.5rem' }}>
            Trayectoria institucional desde 2017
          </span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            AGENDA 2050 <span style={{ color: '#BDD962' }}>PERÚ</span>
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.75)', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Fortalecemos competencias, impulsamos la innovación y promovemos el aprendizaje permanente para afrontar los desafíos del presente y construir oportunidades hacia el año 2050.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/cursos" className="btn-primary-agenda" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem' }}>
              Explorar capacitaciones
            </Link>
            <Link href="/login" className="btn-outline-agenda" style={{ padding: '0.875rem 2rem', fontSize: '0.95rem', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}>
              Ingresar al Aula Virtual
            </Link>
          </div>
        </div>
      </section>

      {/* ¿Quiénes somos? */}
      <section style={{ padding: '6rem 0', background: '#ffffff', position: 'relative' }}>
        <div className="container-page">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div data-animate="fade-right">
              <span className="eyebrow-agenda">Nuestra Identidad</span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', letterSpacing: '-0.03em', marginTop: '1.25rem', marginBottom: '1.5rem', color: '#1A1A1A', lineHeight: 1.15 }}>
                ¿Quiénes <span style={{ color: 'var(--agenda-primary)' }}>somos?</span>
              </h2>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#444', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                <strong>AGENDA 2050 PERÚ</strong> es una consultora especializada en capacitación, innovación y desarrollo profesional aplicado, orientada al fortalecimiento de competencias y al aprendizaje permanente de personas, empresas y organizaciones.
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.98rem', color: '#666', lineHeight: 1.7, marginBottom: '2rem' }}>
                Nuestra propuesta integra tecnología, inteligencia artificial, empleabilidad, gestión social, desarrollo sostenible y transformación empresarial, combinando metodologías activas y una plataforma propia para afrontar los desafíos de un entorno laboral y social en permanente evolución.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8faf9', padding: '0.85rem 1.25rem', borderRadius: '1rem', border: '1px solid #e2ebe6' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--agenda-accent)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.92rem', color: '#1A1A1A', margin: 0 }}>Aprendizaje Permanente</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#777', margin: 0 }}>Actualización continua y modular</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8faf9', padding: '0.85rem 1.25rem', borderRadius: '1rem', border: '1px solid #e2ebe6' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--agenda-accent)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.92rem', color: '#1A1A1A', margin: 0 }}>Enfoque Práctico</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', color: '#777', margin: 0 }}>Conexión con el mercado real</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Tarjetas de Pilares */}
            <div data-animate="fade-left" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                { icon: Target, title: 'Formación Aplicada', desc: 'Cursos y programas diseñados para personas (B2C) y organizaciones (B2B) con aplicación directa.' },
                { icon: BrainCircuit, title: 'IA & Tecnología', desc: 'Herramientas digitales e inteligencia artificial incorporadas transversalmente en cada programa.' },
                { icon: Compass, title: 'Gestión Sostenible', desc: 'Capacitación integral en desarrollo territorial, relaciones comunitarias y gestión social.' },
                { icon: TrendingUp, title: 'Visión 2050', desc: 'Promovemos el aprendizaje permanente para multiplicar oportunidades profesionales a largo plazo.' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fafafa',
                    borderRadius: '1.5rem',
                    padding: '1.75rem',
                    border: '1px solid #eee',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', border: '1px solid #e8e8e8', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', boxShadow: '0 4px 10px rgba(0,111,101,0.08)' }}>
                    <item.icon size={22} />
                  </div>
                  <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1A1A1A', marginBottom: '0.5rem', lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.86rem', color: '#666', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Historia de Agenda 2050 Perú */}
      <section className="bg-circuit" style={{ padding: '6rem 0', background: '#fafafa', borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <div className="container-page">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto', marginBottom: '4rem' }} data-animate="fade-up">
            <span className="eyebrow-agenda">Nuestra Trayectoria</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '1rem', marginBottom: '1.25rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              Formamos con criterio, <br />
              <span style={{ color: 'var(--agenda-primary)' }}>lideramos con tecnología</span>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.05rem', color: '#666', lineHeight: 1.7 }}>
              Desde nuestros inicios en 2017 hasta la consolidación del PLAN AGENDA 2050, nuestra historia refleja evolución constante, innovación y compromiso con el desarrollo del país.
            </p>
          </div>

          {/* Timeline Evolutivo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4.5rem' }} className="stagger-container">
            {[
              {
                year: '2017',
                tag: 'Fundación',
                title: 'Nacimiento de Agenda 2030 SAC',
                desc: 'Nace bajo el liderazgo del Ing. Roberto Tello Yuen, consolidando consultoría de gestión, proyectos de ingeniería, educación y desarrollo profesional conectado a minería, educación superior y sostenibilidad.',
                icon: Calendar
              },
              {
                year: 'Evolución',
                tag: 'Innovación',
                title: 'Transformación Digital & IA',
                desc: 'Frente a las demandas del mercado y la inteligencia artificial, se incorporan metodologías activas, aula virtual propia y certificación verificable por código QR.',
                icon: Sparkles
              },
              {
                year: 'Hacia el 2050',
                tag: 'Consolidación',
                title: 'Agenda 2050 Perú',
                desc: 'Nueva etapa institucional de formación aplicada B2C y B2B, articulando dos grandes líneas formativas: Tecnología & Empleabilidad y Gerencia & Gestión Social.',
                icon: Rocket
              }
            ].map((step, idx) => (
              <div
                key={idx}
                data-animate="zoom-in-sm"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '1.75rem',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: 'var(--agenda-primary)' }}>
                    {step.year}
                  </span>
                  <span style={{ background: 'var(--agenda-accent)', color: 'var(--agenda-primary-dark)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>
                    {step.tag}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.15rem', color: '#1A1A1A', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>


          {/* Cita institucional */}
          <div
            data-animate="fade-up"
            style={{
              background: 'linear-gradient(135deg, rgba(0,111,101,0.06) 0%, rgba(189,217,98,0.12) 100%)',
              border: '1px solid rgba(0,111,101,0.15)',
              borderRadius: '2rem',
              padding: '2.5rem',
              textAlign: 'center',
              maxWidth: '840px',
              margin: '0 auto 4.5rem auto',
              position: 'relative'
            }}
          >
            <Quote size={32} style={{ color: 'var(--agenda-primary)', opacity: 0.4, margin: '0 auto 1rem auto' }} />
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.15rem, 2vw, 1.4rem)', color: '#1A1A1A', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              “La educación abre caminos. La tecnología los multiplica.”
            </p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'var(--agenda-primary-dark)', fontWeight: 600, margin: 0 }}>
              Ing. Roberto Tello Yuen — Gerente General
            </p>
          </div>

          {/* Misión, Visión y Valores */}
          <div style={{ marginTop: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }} data-animate="fade-up">
              <span className="eyebrow-agenda">Pilares Institucionales</span>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', letterSpacing: '-0.02em', marginTop: '0.75rem', color: '#1A1A1A' }}>
                Misión, Visión y Valores
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }} className="stagger-container">
              {[
                {
                  number: '01',
                  tag: 'Propósito',
                  icon: Globe,
                  title: 'Misión Institucional',
                  summary: 'Capacitación especializada, accesible y con impacto real',
                  text: 'Brindar capacitación especializada, práctica y accesible a personas naturales (B2C) y organizaciones (B2B), mediante programas de formación tecnológica, empleabilidad, gestión social y desarrollo sostenible, combinando experiencia profesional, herramientas digitales e innovación educativa para generar valor tangible.',
                  points: ['Formación B2C y B2B adaptada', 'Herramientas digitales e innovación', 'Docentes con experiencia en campo']
                },
                {
                  number: '02',
                  tag: 'Horizonte 2050',
                  icon: Sparkles,
                  title: 'Visión de Futuro',
                  summary: 'Referente latinoamericano en formación continua aplicada',
                  text: 'Ser una organización referente en Latinoamérica en formación tecnológica, empleabilidad y desarrollo profesional aplicado, integrando educación, innovación, inteligencia artificial y gestión sostenible para contribuir al crecimiento y competitividad de personas y organizaciones.',
                  points: ['Liderazgo en formación tecnológica', 'Integración de IA transversal', 'Impacto en el crecimiento regional']
                },
                {
                  number: '03',
                  tag: 'Principios',
                  icon: Award,
                  title: 'Nuestros Valores',
                  summary: 'Compromiso inquebrantable con la excelencia y la ética',
                  text: 'Nuestras acciones y programas se rigen por la excelencia académica, la ética profesional, el pensamiento crítico, la innovación constante y el compromiso genuino con el éxito y la empleabilidad de cada uno de nuestros estudiantes.',
                  points: ['Excelencia & Ética profesional', 'Innovación & Pensamiento crítico', 'Compromiso con el éxito del alumno']
                }
              ].map((item) => (
                <div
                  key={item.title}
                  data-animate="zoom-in-sm"
                  style={{
                    padding: '2.5rem 2rem',
                    borderRadius: '2.25rem',
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    transition: 'all 0.35s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--agenda-gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 6px 15px rgba(0,111,101,0.2)' }}>
                      <item.icon size={26} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.1rem', color: 'var(--agenda-primary)' }}>{item.number}</span>
                      <span style={{ background: '#f8faf9', border: '1px solid #e2ebe6', color: '#555', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, textTransform: 'uppercase' }}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.3rem', marginBottom: '0.4rem', color: '#1A1A1A', lineHeight: 1.25 }}>{item.title}</h4>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: 'var(--agenda-primary-dark)', marginBottom: '1rem' }}>{item.summary}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', lineHeight: 1.65, marginBottom: '1.5rem' }}>{item.text}</p>

                  <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {item.points.map((p, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--agenda-primary)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#444', fontWeight: 500 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mensaje del Gerente General */}
      <section style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #012d22 0%, #025E44 100%)', color: '#fff', overflow: 'hidden' }}>
        <div className="container-page relative">
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1, pointerEvents: 'none' }}>
            <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
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
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)' }}>
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

      {/* Docentes */}
      {teachers.length > 0 && (
        <TeachersSection teachers={teachers} />
      )}

      {/* Contacto Institucional */}
      <section style={{ padding: '6rem 0', background: '#fafafa' }}>
        <div className="container-page">
          <div style={{ background: '#ffffff', borderRadius: '3rem', padding: 'clamp(3rem, 6vw, 5rem)', border: '1px solid #e5e5e5', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', position: 'relative', zIndex: 1 }}>
              <div data-animate="fade-right">
                <span className="eyebrow-agenda">Contacto Institucional</span>
                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.03em', marginTop: '1.5rem', marginBottom: '1.5rem', color: '#1A1A1A', lineHeight: 1.1 }}>
                  ¿Listo para potenciar tu <span style={{ color: 'var(--agenda-primary)' }}>desarrollo profesional?</span>
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  Nuestro equipo está disponible para brindar información sobre cursos, rutas de aprendizaje, seminarios, programas corporativos, convenios y alianzas estratégicas.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="btn-primary-agenda" style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}>
                    Escríbenos por WhatsApp
                  </a>
                  <Link href="/cursos" className="btn-outline-agenda" style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}>
                    Explorar capacitaciones
                  </Link>
                  <Link href="/login" className="btn-outline-agenda" style={{ padding: '0.875rem 1.5rem', fontSize: '0.95rem' }}>
                    Ingresar al Aula Virtual
                  </Link>
                </div>
              </div>

              <div data-animate="fade-left" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Portales Web</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>Oficial: www.agenda2050.pe</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>Complementario: www.agenda2050peru.com</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'var(--agenda-primary)', fontWeight: 600, marginTop: '0.25rem' }}>Aula Virtual integrada</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Central Telefónica / WhatsApp</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>+51 994 356 180</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Correo Institucional</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>agenda2050peru@gmail.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,111,101,0.08)', color: 'var(--agenda-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>Ubicación</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666' }}>Santiago de Surco, Lima, Perú</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
