import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import { getTipoProgramaConfig } from '@/utils/configs/tipoPrograma'
import { isFeatureEnabled } from '@/utils/configs/projectFeatures'
import HomeCoursesSection from '@/features/web/home/components/HomeCoursesSection'
import HeroInstallButton from '@/features/web/home/components/HeroInstallButton'
import SearchCertificateSection from '@/features/web/home/components/SearchCertificateSection'
import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import HeroVisual from '@/features/web/home/components/HeroVisual'
import HeroImageCarousel from '@/features/web/home/components/HeroImageCarousel'
import ClassFeaturesSection from '@/features/web/home/components/ClassFeaturesSection'
import ProfessorsCarousel from '@/features/web/nosotros/components/ProfessorsCarousel'
import HomeEbooksSection from '@/features/web/home/components/HomeEbooksSection'
import ConveniosSection from '@/features/web/home/components/ConveniosSection'
import WhyChooseUsSection from '@/features/web/home/components/WhyChooseUsSection'

export const metadata = {
  title: 'Aula Virtual - Aprende sin límites',
  description: 'Plataforma de aprendizaje online con cursos especializados y certificados.',
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  // Si no hay descripción, no se muestra ni el título ni la descripción — el admin
  // dejó el campo vacío a propósito, no se rellena con un texto por defecto.
  if (!subtitle?.trim()) return null

  const words = title.trim().split(' ')
  const last = words.pop()
  const rest = words.join(' ')

  return (
    <div className="text-center mb-10 max-w-2xl mx-auto">
      <h2 className="section-title">
        {rest ? `${rest} ` : ''}
        <span style={{ color: 'var(--web-primary, #25927F)' }}>{last}</span>
      </h2>
      <p className="section-subtitle">{subtitle}</p>
    </div>
  )
}

async function getHomeData() {
  try {
    const courseInclude = {
      profesor: { select: { nombre: true, apellido: true, avatar: true } },
      categoria: { select: { id: true, nombre: true } },
      _count: { select: { modulos: true, inscripciones: true } }
    }

    const [coursesRaw, diplomadosRaw, especializacionesRaw, teachersRaw, configs, ebooksRaw] = await Promise.all([
      prisma.curso.findMany({
        where: { estado: 'PUBLICADO', tipo: 'CURSO' },
        include: courseInclude,
        orderBy: { creado_en: 'desc' },
        take: 6
      }),
      prisma.curso.findMany({
        where: { estado: 'PUBLICADO', tipo: 'DIPLOMADO' },
        include: courseInclude,
        orderBy: { creado_en: 'desc' },
        take: 6
      }),
      prisma.curso.findMany({
        where: { estado: 'PUBLICADO', tipo: 'ESPECIALIZACION' },
        include: courseInclude,
        orderBy: { creado_en: 'desc' },
        take: 6
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

      // Ebooks destacados
      isFeatureEnabled('ebooks')
        ? prisma.ebook.findMany({
          where: { estado: 'PUBLICADO' },
          select: {
            id: true, titulo: true, slug: true, miniatura: true,
            autor: true, precio: true, precio_falso: true, moneda: true,
            es_gratis: true, paginas: true, genero: true,
            categoria: { select: { nombre: true } },
          },
          orderBy: { creado_en: 'desc' },
          take: 5,
        })
        : Promise.resolve([]),
    ])

    const courses = await Promise.all(
      coursesRaw.map(async course => {
        const leccionesCount = await prisma.leccion.count({ where: { modulo: { curso_id: course.id } } })

        return { ...course, _count: { ...course._count, lecciones: leccionesCount } }
      })
    )

    const diplomados = await Promise.all(
      diplomadosRaw.map(async course => {
        const leccionesCount = await prisma.leccion.count({ where: { modulo: { curso_id: course.id } } })

        return { ...course, _count: { ...course._count, lecciones: leccionesCount } }
      })
    )

    const especializaciones = await Promise.all(
      especializacionesRaw.map(async course => {
        const leccionesCount = await prisma.leccion.count({ where: { modulo: { curso_id: course.id } } })

        return { ...course, _count: { ...course._count, lecciones: leccionesCount } }
      })
    )

    const heroTitle = configs.HOME_HERO_TITLE || 'Aprende sin límites,\ncrece sin fronteras'
    const heroDescription = configs.HOME_HERO_DESCRIPTION || 'Accede a cursos especializados, rutas de aprendizaje y certificaciones diseñadas para impulsar tu carrera profesional.'

    let heroImages: string[] = []

    try {
      const parsed = configs.HOME_HERO_IMAGES ? JSON.parse(configs.HOME_HERO_IMAGES) : []

      if (Array.isArray(parsed)) heroImages = parsed.filter(Boolean)
    } catch { heroImages = [] }

    if (heroImages.length === 0 && configs.HOME_HERO_IMAGE) heroImages = [configs.HOME_HERO_IMAGE]

    let convenios: { label: string; url: string }[] = []

    try { convenios = configs.HOME_CONVENIOS_LOGOS ? JSON.parse(configs.HOME_CONVENIOS_LOGOS) : [] } catch { convenios = [] }

    let porQueElegirnos: { icono: string; titulo: string; descripcion: string }[] = []

    try { porQueElegirnos = configs.HOME_POR_QUE_ELEGIRNOS ? JSON.parse(configs.HOME_POR_QUE_ELEGIRNOS) : [] } catch { porQueElegirnos = [] }

    const ebooks = ebooksRaw.map(e => ({
      ...e,
      precio: Number(e.precio),
      precio_falso: Number(e.precio_falso),
    }))

    return {
      courses: JSON.parse(JSON.stringify(courses)),
      diplomados: JSON.parse(JSON.stringify(diplomados)),
      especializaciones: JSON.parse(JSON.stringify(especializaciones)),
      teachers: JSON.parse(JSON.stringify(teachersRaw)),
      ebooks: JSON.parse(JSON.stringify(ebooks)),
      heroTitle,
      heroDescription,
      heroImages,

      // Título/descripción de estas secciones vienen únicamente de Configuracion (ver seed
      // para los valores por defecto). Si el admin borra la descripción, la sección oculta
      // tanto el título como la descripción — no hay texto de relleno hardcodeado aquí.
      cursosTitle: configs.HOME_CURSOS_TITLE || '',
      cursosSubtitle: configs.HOME_CURSOS_SUBTITLE || '',
      convenios,
      conveniosHabilitado: configs.HOME_CONVENIOS_HABILITADO !== 'false',
      conveniosTitle: configs.HOME_CONVENIOS_TITLE || '',
      conveniosDescription: configs.HOME_CONVENIOS_DESCRIPTION || '',
      porQueElegirnos,
      porQueElegirnosHabilitado: configs.HOME_POR_QUE_ELEGIRNOS_HABILITADO !== 'false',
      docentesTitle: configs.HOME_DOCENTES_TITLE || '',
      docentesSubtitle: configs.HOME_DOCENTES_SUBTITLE || '',
    }
  } catch {
    return {
      courses: [], diplomados: [], especializaciones: [], teachers: [], ebooks: [],
      heroTitle: 'Aprende sin límites,\ncrece sin fronteras',
      heroDescription: 'Accede a cursos especializados, rutas de aprendizaje y certificaciones diseñadas para impulsar tu carrera profesional.',
      heroImages: [],
      cursosTitle: '',
      cursosSubtitle: '',
      convenios: [],
      conveniosHabilitado: true,
      conveniosTitle: '',
      conveniosDescription: '',
      porQueElegirnos: [],
      porQueElegirnosHabilitado: true,
      docentesTitle: '',
      docentesSubtitle: '',
    }
  }
}

export default async function HomePage() {
  const {
    courses, diplomados, especializaciones, teachers, ebooks,
    heroTitle, heroDescription, heroImages,
    cursosTitle, cursosSubtitle,
    convenios, conveniosHabilitado, conveniosTitle, conveniosDescription,
    porQueElegirnos, porQueElegirnosHabilitado,
    docentesTitle, docentesSubtitle,
  } = await getHomeData()

  const cursosConfig = getTipoProgramaConfig('CURSO')
  const diplomadosConfig = getTipoProgramaConfig('DIPLOMADO')
  const especializacionesConfig = getTipoProgramaConfig('ESPECIALIZACION')

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────── */}
      {heroImages.length > 0 ? (
        <HeroImageCarousel images={heroImages} />
      ) : (
      <section
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

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' }}>
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
                  Plataforma educativa online
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
                <HeroInstallButton />
                <Link
                  href="/cursos"
                  className="inline-flex items-center gap-2 no-underline rounded-xl font-semibold transition-all duration-200"
                  style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.9375rem', padding: '0.875rem 1.75rem', border: '1.5px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
                >
                  Ver Cursos <ArrowRight size={18} />
                </Link>
              </div>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {[
                  { value: '+1,200', label: 'Estudiantes' },
                  { value: '+80', label: 'Cursos' },
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
      )}

      {/* ── 2. CURSOS DESTACADOS ────────────────────── */}
      <section className="section-container" style={{ maxWidth: '1440px' }}>
        <ScrollReveal>
          <SectionHeader title={cursosTitle} subtitle={cursosSubtitle} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <HomeCoursesSection
            courses={courses}
            catalogHref={cursosConfig.webPath}
            emptyMessage={cursosConfig.emptyMessage}
            viewLabel="Ir a matricularse"
          />
          <div className="flex justify-center mt-10">
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

      {/* ── 2b. NUESTROS CONVENIOS ──────────────────── */}
      {conveniosHabilitado && (
        <ConveniosSection title={conveniosTitle} description={conveniosDescription} logos={convenios} />
      )}

      {/* ── 3b. DIPLOMADOS DESTACADOS ───────────────── */}
      {diplomados.length > 0 && (
        <section className="section-container" style={{ borderTop: '1px solid hsl(214, 20%, 92%)' }}>
          <ScrollReveal>
            <SectionHeader title={diplomadosConfig.homeTitle} subtitle={diplomadosConfig.homeSubtitle} />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <HomeCoursesSection
              courses={diplomados}
              catalogHref={diplomadosConfig.webPath}
              emptyMessage={diplomadosConfig.emptyMessage}
              viewLabel="Ir a matricularse"
            />
            <div className="flex justify-center mt-10">
              <Link
                href={diplomadosConfig.webPath}
                className="no-underline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--web-primary, #25927F)', color: '#ffffff' }}
              >
                Ver todos los diplomados <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── 3c. ESPECIALIZACIONES DESTACADAS ────────── */}
      {especializaciones.length > 0 && (
        <section className="section-container" style={{ borderTop: '1px solid hsl(214, 20%, 92%)' }}>
          <ScrollReveal>
            <SectionHeader title={especializacionesConfig.homeTitle} subtitle={especializacionesConfig.homeSubtitle} />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <HomeCoursesSection
              courses={especializaciones}
              catalogHref={especializacionesConfig.webPath}
              emptyMessage={especializacionesConfig.emptyMessage}
              viewLabel="Ir a matricularse"
            />
            <div className="flex justify-center mt-10">
              <Link
                href={especializacionesConfig.webPath}
                className="no-underline inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm"
                style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: 'var(--web-primary, #25927F)', color: '#ffffff' }}
              >
                Ver todas las especializaciones <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* ── 4. EBOOKS DESTACADOS ────────────────────── */}
      {isFeatureEnabled('ebooks') && <HomeEbooksSection ebooks={ebooks} />}

      {/* ── 4c. ¿POR QUÉ ELEGIRNOS? ─────────────────── */}
      {porQueElegirnosHabilitado && <WhyChooseUsSection items={porQueElegirnos} />}

      {/* ── 5. CARACTERÍSTICAS DE CLASES ────────────── */}
      <ClassFeaturesSection />

      {/* ── 6. PROFESORES ───────────────────────────── */}
      <ProfessorsCarousel teachers={teachers} title={docentesTitle} subtitle={docentesSubtitle} />

      {/* ── 7. EMPRESAS (B2B informativo) ───────────── */}
      {/* <CompaniesSection /> */}

      {/* ── 8. VERIFICAR CERTIFICADO ────────────────── */}
      <SearchCertificateSection />
    </>
  )
}
