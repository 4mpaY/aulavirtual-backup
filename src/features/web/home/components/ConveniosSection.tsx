'use client'

/* ─────────────────────────────────────────────
   ConveniosSection — grid estático de logos
   de entidades aliadas ("Nuestros convenios"),
   contenido 100% administrable.
   ───────────────────────────────────────────── */

import ScrollReveal from './ScrollReveal'
import { sectionH2, sectionDesc } from './typography'

interface ConvenioLogo {
  label: string
  url: string
}

interface ConveniosSectionProps {
  title: string
  description: string
  logos: ConvenioLogo[]
}

export default function ConveniosSection({ title, description, logos }: ConveniosSectionProps) {
  if (logos.length === 0) return null

  return (
    <section style={{ backgroundColor: '#ffffff', padding: '5rem 1rem', borderTop: '1px solid hsl(214,20%,92%)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {description?.trim() && (
          <ScrollReveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ ...sectionH2, textAlign: 'center', marginBottom: '0.75rem' }}>{title}</h2>
              <p style={{ ...sectionDesc, textAlign: 'center', maxWidth: '100%', margin: '0 auto' }}>{description}</p>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.1}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {logos.map((logo, i) => (
              <ConvenioCard key={i} {...logo} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function ConvenioCard({ label, url }: ConvenioLogo) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '110px',
        padding: '1rem',
        borderRadius: '16px',
        border: '1.5px solid hsl(214,20%,90%)',
        backgroundColor: '#ffffff',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 10px 30px rgba(var(--web-primary-rgb, 37, 146, 127),0.15)'
        el.style.borderColor = 'var(--web-primary, #25927F)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement

        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
        el.style.borderColor = 'hsl(214,20%,90%)'
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
    </div>
  )
}
