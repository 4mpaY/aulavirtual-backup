import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import ProfessorsCarousel from '@/features/web/nosotros/components/ProfessorsCarousel'
import { MisionVisionSection, ValoresSection } from '@/features/web/nosotros/components/NosotrosInteractive'

export const metadata = {
  title: 'Nosotros - CEGAE Ribeyro',
  description: 'Conoce quiénes somos, nuestra misión, visión y los valores que guían nuestra institución educativa.',
}

async function getTeachers() {
  try {
    return await prisma.usuario.findMany({
      where: { rol: 'PROFESOR' },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        slug: true,
        avatar: true,
        cargo: true,
        biografia: true,
        _count: { select: { cursos_dictados: true } },
      },
      orderBy: { cursos_dictados: { _count: 'desc' } },
      take: 12,
    })
  } catch {
    return []
  }
}

export default async function NosotrosPage() {
  const teachers = await getTeachers()

  return (
    <>
      {/* ── 1. HERO SOBRE NOSOTROS ─────────────────────── */}
      <section
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.42) 100%), url("https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '6rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid pattern */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow */}
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--web-primary-rgb, 37, 146, 127),0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left: stats visual */}
            <ScrollReveal direction="left">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Card principal */}
                <div
                  style={{
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(16px)',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,var(--web-dark, #025E44),var(--web-primary, #25927F))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.75rem' }}>
                    📚
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Programas académicos</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>CEGAE Ribeyro</div>
                    <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.8125rem', color: 'var(--web-light, #BDD962)', fontWeight: 600 }}>Especialización y capacitación profesional</div>
                  </div>
                </div>

                {/* Stats 2×2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[
                    { emoji: '📚', value: '+10', label: 'Programas activos' },
                    { emoji: '🏫', value: 'Área', label: 'Educación docente' },
                    { emoji: '💻', value: 'Vivo', label: 'y grabado' },
                    { emoji: '🏆', value: '100%', label: 'Comprometidos' },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: '16px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1.5px solid rgba(255,255,255,0.09)',
                        backdropFilter: 'blur(12px)',
                        padding: '1.125rem 1.25rem',
                      }}
                    >
                      <span style={{ fontSize: '1.375rem' }}>{s.emoji}</span>
                      <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.375rem', fontWeight: 800, color: 'var(--web-light, #BDD962)', lineHeight: 1, marginTop: '0.5rem' }}>{s.value}</div>
                      <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px', lineHeight: 1.3 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Certificado badge */}
                <div
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(var(--web-light-rgb, 189, 217, 98),0.12) 0%, rgba(var(--web-primary-rgb, 37, 146, 127),0.12) 100%)',
                    border: '1.5px solid rgba(var(--web-light-rgb, 189, 217, 98),0.25)',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                  }}
                >
                  <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>🎓</div>
                  <div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: 700, color: 'var(--web-light, #BDD962)', lineHeight: 1 }}>Certificados oficiales por programa</div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>Reconocidos para nombramiento, ascenso y cargos directivos</div>
                  </div>
                </div>

              </div>
            </ScrollReveal>

            {/* Right: text */}
            <ScrollReveal direction="right" delay={0.1}>
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.12)',
                    border: '1px solid rgba(var(--web-light-rgb, 189, 217, 98),0.25)',
                    borderRadius: '999px',
                    padding: '0.375rem 1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--web-light, #BDD962)', boxShadow: '0 0 6px var(--web-light, #BDD962)' }} />
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'var(--web-light, #BDD962)', fontWeight: 600 }}>
                    Sobre nosotros
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
                    fontWeight: 800,
                    color: '#ffffff',
                    letterSpacing: '-0.025em',
                    lineHeight: 1.15,
                    marginBottom: '1.25rem',
                  }}
                >
                  Formación profesional{' '}
                  <span style={{ color: 'var(--web-light, #BDD962)' }}>que transforma</span>{' '}
                  vidas
                </h1>

                <p
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.75,
                    maxWidth: '480px',
                    marginBottom: '2.5rem',
                  }}
                >
                  Somos CEGAE Ribeyro, una institución dedicada al desarrollo de programas educativos de especialización,
                  capacitaciones, actualizaciones y diplomados en distintas áreas profesionales. Nuestros programas son diseñados
                  por especialistas comprometidos con la excelencia y el desarrollo docente.
                </p>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link
                    href="/cursos"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.875rem 1.75rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--web-light, #BDD962)',
                      color: '#0A0A0A',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(var(--web-light-rgb, 189, 217, 98),0.35)',
                    }}
                  >
                    Ver cursos <ArrowRight size={18} />
                  </Link>
                  <Link
                    href="/contacto"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.875rem 1.75rem',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      color: '#ffffff',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      textDecoration: 'none',
                      border: '1.5px solid rgba(255,255,255,0.18)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Contáctanos
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── 2. BANNER ISO ─────────────────────────────── */}
      {/* <section
        style={{
          backgroundColor: '#0A0A0A',
          padding: '2.5rem 1.5rem',
          borderTop: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127),0.2)',
          borderBottom: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127),0.2)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '52px', height: '52px', borderRadius: '14px',
              backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid rgba(var(--web-primary-rgb, 37, 146, 127),0.3)', flexShrink: 0,
            }}
          >
            <Award size={28} color="var(--web-primary, #25927F)" />
          </div>
          <div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
              Calidad certificada:{' '}
              <span style={{ color: 'var(--web-light, #BDD962)' }}>ISO 9001:2015</span> e{' '}
              <span style={{ color: 'var(--web-light, #BDD962)' }}>ISO 21001:2018</span>
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
              Comprometidos con los más altos estándares de calidad educativa y de gestión
            </div>
          </div>
        </div>
      </section> */}

      {/* ── HISTORIA ───────────────────────────────────── */}
      <section style={{ backgroundColor: '#f8fafc', padding: '6rem 1.5rem', borderTop: '1px solid hsl(214,20%,92%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.08)',
                border: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127),0.2)',
                borderRadius: '999px',
                padding: '0.375rem 1rem',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'var(--web-primary, #25927F)', fontWeight: 600 }}>
                Nuestra Trayectoria
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                marginBottom: '1rem',
              }}
            >
              Nuestra Historia
            </h2>
            <p
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1rem',
                color: '#64748B',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Conoce cómo nacimos en el 2020 para democratizar la educación y acompañar a miles de profesionales peruanos en su crecimiento.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'start' }}>
            {/* Left side: text blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--web-primary, #25927F)' }}>2020:</span> El Inicio en Pandemia
                </h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9375rem', color: '#334155', lineHeight: 1.7 }}>
                  La historia de CEGAE Ribeyro comenzó en el año 2020, en uno de los momentos más difíciles para la educación en el Perú. Mientras muchas instituciones cerraban sus puertas por la pandemia, nació una idea diferente: crear un espacio educativo accesible, humano y realmente útil para quienes querían seguir creciendo profesionalmente desde casa.
                </p>
              </div>

              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  El Propósito
                </h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9375rem', color: '#334155', lineHeight: 1.7 }}>
                  Todo empezó con un pequeño grupo de docentes y profesionales jóvenes que compartían una misma preocupación: miles de maestros no tenían acceso a capacitaciones actualizadas, clases de calidad ni acompañamiento real para prepararse para concursos del MINEDU. Las academias tradicionales eran costosas, poco dinámicas y muchas veces alejadas de la realidad de los docentes peruanos.
                </p>
              </div>

              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Metodología y Crecimiento
                </h3>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.9375rem', color: '#334155', lineHeight: 1.7 }}>
                  Fue entonces cuando nació CEGAE Ribeyro, inicialmente como un proyecto virtual que brindaba asesorías y clases en línea a través de videollamadas y grupos de WhatsApp. Las primeras clases se realizaban desde una pequeña oficina improvisada, con una laptop, una pizarra y el objetivo claro de ayudar a más docentes a lograr sus metas.
                </p>
              </div>
            </div>

            {/* Right side: programs and features card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '1px solid hsl(214,20%,91%)',
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
              }}
            >
              <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                Nuestros Primeros Programas
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  'Nombramiento Docente',
                  'Ascenso Magisterial',
                  'Acceso Cargos Directivos',
                  'Auxiliar de Educación',
                ].map((program) => (
                  <div
                    key={program}
                    style={{
                      backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.05)',
                      border: '1px solid rgba(var(--web-primary-rgb, 37, 146, 127),0.12)',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      fontFamily: 'Montserrat, sans-serif',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--web-dark, #025E44)',
                    }}
                  >
                    📖 {program}
                  </div>
                ))}
              </div>

              <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                ¿Por qué destaca nuestra propuesta?
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { title: 'Clases EN VIVO y Grabadas', desc: 'Acceso total y flexible desde cualquier dispositivo.' },
                  { title: 'Material Actualizado', desc: 'Simulacros y casuística alineada a las evaluaciones.' },
                  { title: 'Docentes Especializados', desc: 'Expertos de primer nivel en cada área.' },
                  { title: 'Soporte Personalizado', desc: 'Acompañamiento a través de comunidades virtuales.' },
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'start' }}>
                    <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>✅</span>
                    <div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', fontWeight: 700, color: '#1E293B' }}>
                        {item.title}
                      </div>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        {item.desc}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div style={{ borderTop: '1px solid hsl(214,20%,92%)', marginTop: '2rem', paddingTop: '1.5rem' }}>
                <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  Hoy en día, <strong>CEGAE Ribeyro</strong> continúa expandiendo sus programas académicos y fortaleciendo su misión: democratizar la educación y brindar oportunidades de crecimiento profesional en todo el Perú.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MISIÓN / VISIÓN (client component) ─────── */}
      <MisionVisionSection />

      {/* ── 4. VALORES (client component) ─────────────── */}
      <ValoresSection />

      {/* ── 5. PROFESORES ─────────────────────────────── */}
      <ProfessorsCarousel teachers={JSON.parse(JSON.stringify(teachers))} />
    </>
  )
}
