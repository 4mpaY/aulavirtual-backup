import Link from 'next/link'

import { ArrowRight, CheckCircle } from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import HomeCoursesSection from '@/features/web/home/components/HomeCoursesSection'
import SearchCertificateSection from '@/features/web/home/components/SearchCertificateSection'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import ClientLogosMarquee from '@/features/web/home/components/ClientLogosMarquee'
import HeroVisual from '@/features/web/home/components/HeroVisual'
import ClassFeaturesSection from '@/features/web/home/components/ClassFeaturesSection'
import ProfessorsCarousel from '@/features/web/nosotros/components/ProfessorsCarousel'
import CompaniesSection from '@/features/web/home/components/CompaniesSection'
import EnterpriseCTASection from '@/features/web/home/components/EnterpriseCTASection'

export const metadata = {
  title: 'SSMAT - Salud Ocupacional, Seguridad y Medio Ambiente',
  description: 'Servicios integrales de salud ocupacional, seguridad y medio ambiente para empresas. Exámenes médicos, SST, capacitación, monitoreo ambiental y más.',
}

async function getHomeData() {
  try {
    const [coursesRaw, teachersRaw, configs] = await Promise.all([
      // Cursos
      prisma.curso.findMany({
        where: { estado: 'PUBLICADO' },
        include: {
          profesor: { select: { nombre: true, apellido: true, avatar: true } },
          categoria: { select: { id: true, nombre: true } },
          _count: { select: { modulos: true, inscripciones: true } },
        },
        orderBy: { creado_en: 'desc' },
        take: 6,
      }),

      // Profesores
      prisma.usuario.findMany({
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
        take: 8,
      }),
      getConfigs(),
    ])

    const courses = await Promise.all(
      coursesRaw.map(async course => {
        const leccionesCount = await prisma.leccion.count({ where: { modulo: { curso_id: course.id } } })

        return { ...course, _count: { ...course._count, lecciones: leccionesCount } }
      })
    )

    const heroTitle = configs.HOME_HERO_TITLE || 'Por una empresa saludable,\nsegura y productiva'
    const heroDescription = configs.HOME_HERO_DESCRIPTION || 'Brindamos servicios integrales de salud ocupacional, seguridad y medio ambiente. Exámenes médicos, vigilancia, SST, capacitación y más — para el bienestar de tus trabajadores.'
    let logos: { label: string; url: string }[] = []

    try { logos = configs.HOME_LOGOS ? JSON.parse(configs.HOME_LOGOS) : [] } catch { logos = [] }

    return {
      courses: JSON.parse(JSON.stringify(courses)),
      teachers: JSON.parse(JSON.stringify(teachersRaw)),
      heroTitle,
      heroDescription,
      logos,
    }
  } catch {
    return {
      courses: [], teachers: [],
      heroTitle: 'Por una empresa saludable,\nsegura y productiva',
      heroDescription: 'Brindamos servicios integrales de salud ocupacional, seguridad y medio ambiente. Exámenes médicos, vigilancia, SST, capacitación y más — para el bienestar de tus trabajadores.',
      logos: [],
    }
  }
}

export default async function HomePage() {
  const { courses, teachers, heroTitle, heroDescription, logos } = await getHomeData()

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────── */}
      <section
        className="web-hero"
        style={{
          background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Patrón de grid decorativo */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow derecho */}
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--web-primary-rgb, 37, 146, 127),0.25) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>

            {/* ── Izquierda: texto ── */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
                style={{ backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.15)', border: '1px solid rgba(var(--web-light-rgb, 189, 217, 98),0.3)' }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--web-light, #BDD962)' }} />
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'var(--web-light, #BDD962)', fontWeight: 600 }}>
                  Salud Ocupacional · Seguridad · Medio Ambiente
                </span>
              </div>

              {/* H1 */}
              <h1
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.15,
                  marginBottom: '1.25rem',
                }}
              >
                {heroTitle.split('\n')[0]}
                {heroTitle.split('\n')[1] && (
                  <>
                    <br />
                    <span style={{ color: 'var(--web-light, #BDD962)' }}>{heroTitle.split('\n')[1]}</span>
                  </>
                )}
              </h1>

              {/* Descripción */}
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.75,
                  maxWidth: '480px',
                  marginBottom: '2.5rem',
                }}
              >
                {heroDescription}
              </p>

              {/* Botones */}
              <div className="flex flex-wrap gap-4" style={{ marginBottom: '2.5rem' }}>
                <Link
                  href="/cursos"
                  className="inline-flex items-center gap-2 no-underline rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--web-primary, #25927F)', color: '#ffffff', fontSize: '0.9375rem', padding: '0.875rem 1.75rem', boxShadow: '0 4px 20px rgba(var(--web-primary-rgb, 37, 146, 127),0.45)' }}
                >
                  Ver Cursos <ArrowRight size={18} />
                </Link>
                <Link
                  href="/nosotros"
                  className="inline-flex items-center gap-2 no-underline rounded-xl font-semibold transition-all duration-200"
                  style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.9375rem', padding: '0.875rem 1.75rem', border: '1.5px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
                >
                  Saber más
                </Link>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {[
                  { value: '+500', label: 'Empresas' },
                  { value: '+10K', label: 'Trabajadores' },
                  { value: '98%', label: 'Satisfacción' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.375rem', fontWeight: 800, color: 'var(--web-light, #BDD962)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Derecha: visual interactivo ── */}
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── 2. LOGO MARQUEE ─────────────────────────── */}
      <ClientLogosMarquee logos={logos} />

      {/* ── 3. CURSOS DESTACADOS ────────────────────── */}
      <div style={{ backgroundColor: 'var(--web-bg, #eef7f4)' }}>
      <section className="section-container">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h2 className="section-title">Cursos destacados</h2>
            <p className="section-subtitle">Descubre nuestros cursos más recientes</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <HomeCoursesSection courses={courses} />
          <div className="flex justify-center mt-8 sm:hidden">
            <Link
              href="/cursos"
              className="no-underline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm"
              style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--web-primary, #25927F)', color: '#ffffff' }}
            >
              Ver todos los cursos <ArrowRight size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
      </div>

      {/* ── 4. CARACTERÍSTICAS DE CLASES ────────────── */}
      <ClassFeaturesSection />


      {/* ── 6. PROFESORES ───────────────────────────── */}
      <ProfessorsCarousel teachers={teachers} />

      {/* ── 7. EMPRESAS (B2B informativo) ───────────── */}
      <CompaniesSection />

      {/* ── 8. CTA AGENDAR REUNIÓN ──────────────────── */}
      <EnterpriseCTASection />

      {/* ── 9. VERIFICAR CERTIFICADO ────────────────── */}
      <SearchCertificateSection />

      {/* ── 10. CTA INSCRIPCIÓN ─────────────────────── */}
      <section className="py-16 text-center" style={{ backgroundColor: 'var(--web-bg, #eef7f4)', borderTop: '1px solid hsl(214, 20%, 88%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <ScrollReveal>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127),0.08)', color: 'var(--web-dark, #025E44)' }}
            >
              <CheckCircle size={16} />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 600 }}>
                Protege a tu equipo de trabajo
              </span>
            </div>
            <h2
              className="mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, color: '#0A0A0A', letterSpacing: '-0.02em' }}
            >
              ¿Listo para cuidar la salud de tu empresa?
            </h2>
            <p
              className="mb-8 max-w-xl mx-auto"
              style={{ fontFamily: 'Poppins, sans-serif', color: 'hsl(215, 16%, 47%)', lineHeight: 1.7 }}
            >
              Contáctanos hoy y recibe asesoría personalizada en salud ocupacional, SST y bienestar laboral.
            </p>
            <Link
              href="/contacto"
              className="no-underline inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--web-primary, #25927F)', boxShadow: '0 6px 20px rgba(var(--web-primary-rgb, 37, 146, 127),0.35)' }}
            >
              Contáctanos ahora <ArrowRight size={18} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
