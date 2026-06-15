import { notFound } from 'next/navigation'

import CompaniesSection from '@/features/web/home/components/CompaniesSection'
import EnterpriseCTASection from '@/features/web/home/components/EnterpriseCTASection'
import { getConfig } from '@/utils/libs/config'

export const metadata = {
  title: 'Soluciones Corporativas - Abeja Smart',
  description: 'Descubre nuestros planes corporativos y capacita a tu equipo en marketing digital, TikTok Ads, Meta Ads e Inteligencia Artificial.',
}

export default async function EmpresasPage() {
  const habilitado = await getConfig('WEB_EMPRESAS_HABILITADO', 'true')

  if (habilitado !== 'true') notFound()

  return (
    <>
      {/* ── 1. HERO EMPRESAS ─────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)',
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
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '1.5rem',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.12)',
                border: '1px solid rgba(var(--web-light-rgb, 189, 217, 98),0.25)',
                borderRadius: '999px',
                padding: '0.375rem 1rem',
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--web-light, #BDD962)', boxShadow: '0 0 6px var(--web-light, #BDD962)' }} />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'var(--web-light, #BDD962)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Para Empresas
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
              }}
            >
              Lleva a tu equipo al <span style={{ color: 'var(--web-light, #BDD962)' }}>siguiente nivel</span>
            </h1>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.125rem',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.75,
                marginBottom: '1rem',
              }}
            >
              Descubre nuestras soluciones corporativas diseñadas para potenciar las habilidades de tus colaboradores y aumentar la competitividad técnica de tu empresa en el mercado actual.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. SECCIONES CORRESPONDIENTES ─────────────── */}
      <CompaniesSection />

      <EnterpriseCTASection />
    </>
  )
}
