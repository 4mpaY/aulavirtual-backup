import prisma from '@/utils/libs/prisma'
import ProfessorsCarousel from '@/features/web/nosotros/components/ProfessorsCarousel'
import { MisionVisionSection, ValoresSection } from '@/features/web/nosotros/components/NosotrosInteractive'
import PageHeader from '@/utils/components/layout/web/PageHeader'

export const metadata = {
  title: 'Nosotros - SSMAT',
  description: 'Conoce quiénes somos, nuestra misión, visión y los valores que guían a SSMAT en salud ocupacional, seguridad y medio ambiente.',
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
      <PageHeader
        label="Quiénes Somos"
        title="Por una empresa saludable, segura y productiva"
        imageSrc="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80"
      />

      {/* ── Descripción + Stats ─────────────────────────────── */}
      <section style={{ backgroundColor: 'var(--web-bg, #eef7f4)', borderBottom: '1px solid hsl(214,20%,92%)', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>

          {/* Descripción + CTA */}
          <div style={{ maxWidth: '480px' }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: '#475569', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              Somos especialistas en salud ocupacional, seguridad y medio ambiente. Brindamos servicios integrales con calidad, compromiso y responsabilidad, contribuyendo al bienestar de los trabajadores y al desarrollo sostenible de las empresas.
            </p>
            <a
              href="/contacto"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.625rem 1.25rem', borderRadius: '8px',
                backgroundColor: 'var(--web-primary, #25927F)', color: '#ffffff',
                fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Contáctanos →
            </a>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
            {[
              { emoji: '🏢', value: '+500', label: 'Empresas atendidas' },
              { emoji: '👷', value: '+10K', label: 'Trabajadores evaluados' },
              { emoji: '🩺', value: '+15', label: 'Años de experiencia' },
              { emoji: '🏆', value: '98%', label: 'Satisfacción' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--web-dark, #025E44)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: '#64748b', marginTop: '3px' }}>{s.label}</div>
              </div>
            ))}
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

      {/* ── 3. MISIÓN / VISIÓN (client component) ─────── */}
      <MisionVisionSection />

      {/* ── 4. VALORES (client component) ─────────────── */}
      <ValoresSection />

      {/* ── 5. PROFESORES ─────────────────────────────── */}
      <ProfessorsCarousel teachers={JSON.parse(JSON.stringify(teachers))} />
    </>
  )
}
