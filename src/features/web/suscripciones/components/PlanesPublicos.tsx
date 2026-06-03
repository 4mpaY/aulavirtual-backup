'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import { Check, Repeat2, BookOpen } from 'lucide-react'

import { useAuthModal } from '@/contexts/AuthModalContext'
import type { PlanPublico } from '@/features/estudiante/suscripciones/entity/Suscripcion'
import { INTERVALO_LABELS } from '@/features/estudiante/suscripciones/entity/Suscripcion'

interface PlanesPublicosProps {
  planes: PlanPublico[]
}

export function PlanesPublicos({ planes }: PlanesPublicosProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { openLogin } = useAuthModal()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleSuscribirse = (plan: PlanPublico) => {
    if (!session?.user) {
      openLogin(`/suscripciones/checkout/${plan.id}`)

      return
    }

    router.push(`/suscripciones/checkout/${plan.id}`)
  }

  if (planes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
        <Repeat2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem' }}>
          No hay planes disponibles en este momento.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      maxWidth: '1100px',
      margin: '0 auto',
      padding: '0 1rem'
    }}>
      {planes.map(plan => {
        const isHovered = hoveredId === plan.id
        const beneficios: string[] = Array.isArray(plan.beneficios) ? plan.beneficios : []
        const tieneBeneficios = beneficios.length > 0

        return (
          <div
            key={plan.id}
            onMouseEnter={() => setHoveredId(plan.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              border: isHovered ? '2px solid var(--web-primary, #25927F)' : '2px solid #e2e8f0',
              boxShadow: isHovered ? '0 20px 40px rgba(37,146,127,0.15)' : '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              transform: isHovered ? 'translateY(-4px)' : 'none'
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(37,146,127,0.08)',
                borderRadius: '20px',
                padding: '4px 12px',
                marginBottom: '0.75rem'
              }}>
                <Repeat2 size={14} color="var(--web-primary, #25927F)" />
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: 'var(--web-primary, #25927F)' }}>
                  {INTERVALO_LABELS[plan.intervalo]}
                </span>
              </div>

              <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                {plan.nombre}
              </h3>

              {plan.descripcion && (
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {plan.descripcion}
                </p>
              )}
            </div>

            {/* Precio */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>
                  {plan.moneda === 'PEN' ? 'S/' : '$'}
                </span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                  {Number(plan.precio).toFixed(2)}
                </span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#94a3b8' }}>
                  /{INTERVALO_LABELS[plan.intervalo]?.toLowerCase()}
                </span>
              </div>

              {plan.dias_prueba > 0 && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  backgroundColor: '#f0fdf4',
                  color: '#16a34a',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Poppins, sans-serif',
                  padding: '3px 10px',
                  borderRadius: '20px'
                }}>
                  {plan.dias_prueba} días gratis
                </span>
              )}
            </div>

            {/* Beneficios o Cursos */}
            <div style={{ flex: 1, marginBottom: '1.5rem' }}>
              {tieneBeneficios ? (
                <>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ¿Qué incluye?
                  </p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {beneficios.map((beneficio, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <Check size={15} color="var(--web-primary, #25927F)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#334155', lineHeight: 1.4 }}>
                          {beneficio}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Resumen de cursos debajo de los beneficios */}
                  {plan.cursos.length > 0 && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '1rem',
                      padding: '8px 12px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '8px'
                    }}>
                      <BookOpen size={14} color="#64748b" />
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#475569', fontWeight: 500 }}>
                        {plan.cursos.length} curso{plan.cursos.length !== 1 ? 's' : ''} incluido{plan.cursos.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Incluye {plan.cursos.length} curso{plan.cursos.length !== 1 ? 's' : ''}
                  </p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {plan.cursos.slice(0, 5).map(c => (
                      <li key={c.curso_id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Check size={15} color="var(--web-primary, #25927F)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: '#334155' }}>
                          {c.curso.titulo}
                        </span>
                      </li>
                    ))}
                    {plan.cursos.length > 5 && (
                      <li style={{ paddingLeft: '23px' }}>
                        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem', color: '#94a3b8' }}>
                          +{plan.cursos.length - 5} cursos más
                        </span>
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleSuscribirse(plan)}
              style={{
                width: '100%',
                padding: '0.875rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 700,
                backgroundColor: isHovered ? 'var(--web-primary, #25927F)' : '#0f172a',
                color: '#ffffff',
                transition: 'background-color 0.2s ease'
              }}
            >
              Suscribirse ahora
            </button>
          </div>
        )
      })}
    </div>
  )
}

