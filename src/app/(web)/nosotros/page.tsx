import Image from 'next/image'
import Link from 'next/link'

import { Linkedin, Mail, Globe, Award, Briefcase, GraduationCap, Sparkles } from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'

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
  const waNumber = configs.WHATSAPP_NUMERO || '51959436827'

  return (
    <main>
      {/* Encabezado */}
      <section style={{
        background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)',
        padding: '4rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem' }}>Inicio</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#BDD962', fontWeight: 600 }}>Nosotros</span>
          </div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
            Conoce quiénes <span style={{ color: '#BDD962' }}>somos</span>
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.7 }}>
            Más de 10 años formando profesionales con excelencia, innovación y compromiso con el desarrollo del país.
          </p>
        </div>
      </section>

      {/* Hero: Dirección */}
      <section className="bg-circuit" style={{ paddingTop: '3rem', paddingBottom: '3rem', background: '#fafafa' }}>
        <div className="container-page">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div data-animate="fade-right" style={{ position: 'relative', maxWidth: '300px', margin: '0 auto' }}>
              <div style={{ position: 'absolute', inset: '-1rem', background: 'rgba(0,111,101,0.15)', borderRadius: '2rem', filter: 'blur(30px)', zIndex: -1 }} />
              <div style={{ borderRadius: '2rem', overflow: 'hidden', boxShadow: 'var(--agenda-shadow-premium)', border: '4px solid #ffffff' }}>
                <Image
                  src="/images/agenda/roberto.jpg"
                  alt="Dirección Académica"
                  width={300}
                  height={400}
                  style={{ objectFit: 'cover', width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            </div>

            <div data-animate="fade-left" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div>
                <span className="eyebrow-agenda">Dirección Académica</span>
                <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em', marginTop: '2rem', color: '#1A1A1A', lineHeight: 1.1 }}>
                  Ing. Roberto{' '}
                  <span style={{ color: 'var(--agenda-primary)' }}>Tello Yuen</span>
                </h1>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666', lineHeight: 1.75, marginTop: '1.5rem' }}>
                  Ingeniero Industrial, docente universitario y consultor de proyectos con más de 20 años de experiencia transformando organizaciones a través de la tecnología y la educación superior.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {[
                  { icon: Briefcase, title: 'Gerente General', sub: 'AGENDA' },
                  { icon: GraduationCap, title: 'Docente Univ.', sub: 'Más de 20 años' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--agenda-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--agenda-primary-dark)', flexShrink: 0 }}>
                      <item.icon size={22} />
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '0.95rem', color: '#1A1A1A' }}>{item.title}</p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#888' }}>{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                <a
                  href="https://www.linkedin.com/company/agenda2050"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-agenda"
                  style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
                >
                  <Linkedin size={18} /> Perfil LinkedIn
                </a>
                <a
                  href={`https://wa.me/${waNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-agenda"
                  style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}
                >
                  <Mail size={18} /> Contactar
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Propósito */}
      <section className="bg-circuit" style={{ padding: '6rem 0' }}>
        <div className="container-page">
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }} data-animate="fade-up">
            <span className="eyebrow-agenda">Nuestro Propósito</span>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', letterSpacing: '-0.03em', marginTop: '2rem', marginBottom: '2rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              Formamos con criterio,{' '}
              <span style={{ color: 'var(--agenda-primary)' }}>lideramos con tecnología</span>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666', lineHeight: 1.75 }}>
              AGENDA nace de la necesidad de cerrar la brecha entre la educación académica tradicional y las demandas reales del mercado tecnológico actual. No solo enseñamos herramientas; forjamos profesionales con capacidad analítica y visión estratégica.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginTop: '5rem' }} className="stagger-container">
            {[
              { icon: Globe, title: 'Misión', text: 'Brindar formación tecnológica de alto nivel que empodere a nuestros alumnos, permitiéndoles competir y destacar en un entorno global altamente digitalizado.' },
              { icon: Sparkles, title: 'Visión', text: 'Ser el centro de referencia en formación tecnológica en la región, reconocidos por nuestra calidad académica y la empleabilidad de nuestros egresados.' },
              { icon: Award, title: 'Valores', text: 'Excelencia, Ética, Innovación constante y Compromiso con el éxito profesional de cada uno de nuestros estudiantes.' },
            ].map((item) => (
              <div
                key={item.title}
                data-animate="zoom-in-sm"
                style={{ padding: '2.5rem', borderRadius: '3rem', background: '#ffffff', border: '1px solid #e5e5e5', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', transition: 'all 0.3s' }}
              >
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--agenda-gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', marginBottom: '2rem' }}>
                  <item.icon size={28} />
                </div>
                <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.3rem', marginBottom: '1rem', color: '#1A1A1A' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', color: '#666', lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profesores (si hay) */}
      {teachers.length > 0 && (
        <section style={{ padding: '5rem 0', background: '#fafafa', borderTop: '1px solid #e5e5e5' }}>
          <div className="container-page">
            <div data-animate="fade-up" style={{ marginBottom: '3rem' }}>
              <span className="eyebrow-agenda">Nuestro Equipo</span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '-0.03em', marginTop: '1rem', color: '#1A1A1A' }}>
                Equipo de <span style={{ color: 'var(--agenda-primary)' }}>Docentes</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.75rem' }} className="stagger-container">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  data-animate="zoom-in-sm"
                  style={{ display: 'flex', flexDirection: 'column', borderRadius: '2rem', background: '#ffffff', border: '1px solid #e5e5e5', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                >
                  {/* Header con avatar */}
                  <div style={{ background: 'linear-gradient(135deg, #012d22 0%, #025E44 100%)', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0, position: 'relative' }}>
                      {t.avatar ? (
                        <Image src={t.avatar} alt={`${t.nombre} ${t.apellido}`} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BDD962', fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.75rem' }}>
                          {t.nombre[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1rem', color: '#ffffff', lineHeight: 1.2 }}>{t.nombre} {t.apellido}</p>
                      {t.cargo && (
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#BDD962', marginTop: '0.375rem', fontWeight: 500 }}>{t.cargo}</p>
                      )}
                    </div>
                  </div>

                  {/* Cuerpo */}
                  <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.75rem' }}>

                    {/* Stat: capacitaciones */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,111,101,0.07)', borderRadius: '999px', padding: '0.3rem 0.85rem', alignSelf: 'flex-start' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--agenda-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                      <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem', fontWeight: 700, color: 'var(--agenda-primary)' }}>
                        {t._count.cursos_dictados} {t._count.cursos_dictados === 1 ? 'capacitación' : 'capacitaciones'}
                      </span>
                    </div>

                    {/* Secciones de la biografía */}
                    {t.biografia && parseBioSections(t.biografia).map((sec, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {sec.title && (
                          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 700, color: '#025E44', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                            {sec.title}
                          </p>
                        )}
                        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', color: '#555', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {sec.content}
                        </p>
                      </div>
                    ))}

                    {/* Link */}
                    <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f0f0f0' }}>
                      <Link
                        href={`/docentes/${t.slug || t.id}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.83rem', color: 'var(--agenda-primary)', textDecoration: 'none' }}
                      >
                        Ver perfil completo →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Frase de cierre */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container-page">
          <div style={{ borderRadius: '5rem', overflow: 'hidden', background: '#1A1A1A', padding: 'clamp(3rem, 8vw, 6rem)', textAlign: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'rgba(0,111,101,0.15)', filter: 'blur(80px)' }} />
            <div style={{ position: 'relative' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 4vw, 3rem)', letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1.15 }}>
                &ldquo;La tecnología sin criterio es solo ruido; nosotros te damos el{' '}
                <span style={{ color: 'var(--agenda-primary)' }}>conocimiento para liderar</span>&rdquo;
              </h2>
              <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                  Ing. Roberto Tello Yuen · Fundador
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
