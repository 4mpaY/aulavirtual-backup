import { Repeat2 } from 'lucide-react'

import { PlanesPublicos } from '@/features/web/suscripciones/components/PlanesPublicos'
import type { PlanPublico } from '@/features/estudiante/suscripciones/entity/Suscripcion'

export const metadata = {
  title: 'Planes de Suscripción',
  description: 'Accede a todos nuestros cursos con un plan de suscripción mensual, trimestral, semestral o anual.'
}

async function getPlanes(): Promise<PlanPublico[]> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/planes-suscripcion`, { cache: 'no-store' })

    if (!res.ok) return []
    const data = await res.json()

    return data?.result?.planes ?? []
  } catch {
    return []
  }
}

export default async function SuscripcionesPage() {
  const planes = await getPlanes()

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8fafc', paddingBottom: '4rem' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--web-dark, #025E44) 0%, var(--web-primary, #25927F) 100%)',
        padding: '4rem 1rem 5rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '20px',
          padding: '6px 16px',
          marginBottom: '1.25rem'
        }}>
          <Repeat2 size={16} color="#BDD962" />
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', fontWeight: 600, color: '#BDD962' }}>
            Acceso ilimitado
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'clamp(1.75rem, 4vw, 3rem)',
          fontWeight: 800,
          color: '#ffffff',
          margin: '0 0 1rem',
          lineHeight: 1.2
        }}>
          Planes de Suscripción
        </h1>

        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: 'clamp(0.9rem, 2vw, 1.125rem)',
          color: 'rgba(255,255,255,0.8)',
          maxWidth: '560px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Accede a múltiples cursos por un precio fijo mensual. Cancela cuando quieras.
        </p>
      </div>

      {/* Cards */}
      <div style={{ marginTop: '-2rem', padding: '0 1rem' }}>
        <PlanesPublicos planes={planes} />
      </div>

      {/* FAQ mínimo */}
      {planes.length > 0 && (
        <div style={{ maxWidth: '640px', margin: '4rem auto 0', padding: '0 1rem' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.25rem', fontWeight: 700, textAlign: 'center', color: '#0f172a', marginBottom: '1.5rem' }}>
            Preguntas frecuentes
          </h2>
          {[
            { q: '¿Puedo cancelar en cualquier momento?', r: 'Sí. Puedes cancelar tu suscripción desde tu panel de estudiante y no se realizarán más cobros.' },
            { q: '¿Qué pasa si vence mi suscripción?', r: 'Perderás el acceso a los cursos del plan, pero tu progreso se guarda. Puedes reactivar cuando quieras.' },
            { q: '¿Puedo suscribirme a varios planes?', r: 'Actualmente cada cuenta admite un plan activo a la vez.' },
          ].map(({ q, r }) => (
            <div key={q} style={{ borderBottom: '1px solid #e2e8f0', padding: '1.25rem 0' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.5rem' }}>{q}</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>{r}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
