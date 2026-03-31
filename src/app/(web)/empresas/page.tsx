import Link from 'next/link'
import { Building2, ArrowRight } from 'lucide-react'

import CompaniesSection from '@/features/web/home/components/CompaniesSection'
import EnterpriseCTASection from '@/features/web/home/components/EnterpriseCTASection'

export const metadata = {
  title: 'Soluciones Corporativas - Aula Virtual',
  description: 'Descubre nuestros planes corporativos y capacita a tu equipo con los mejores profesionales del sector.',
}

export default function EmpresasPage() {
  return (
    <>
      {/* ── 1. HERO EMPRESAS ─────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #012d22 0%, #025E44 45%, #0f4438 100%)',
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
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,146,127,0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

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
                backgroundColor: 'rgba(189,217,98,0.12)',
                border: '1px solid rgba(189,217,98,0.25)',
                borderRadius: '999px',
                padding: '0.375rem 1rem',
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#BDD962', boxShadow: '0 0 6px #BDD962' }} />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: '#BDD962', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
              Lleva a tu equipo al <span style={{ color: '#BDD962' }}>siguiente nivel</span>
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
