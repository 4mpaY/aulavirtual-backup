import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import { eyebrow, sectionDesc } from '@/features/web/home/components/typography'

import { ContactList, ContactActions } from './components/ContactoClient'

export const metadata = {
  title: 'Contacto - CEGAE RIBEYRO',
  description: 'Ponte en contacto con nosotros para mayor información',
}

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          backgroundColor: 'var(--web-primary, #1D71CA)',
          padding: '6rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <ScrollReveal>
            <p style={{ ...eyebrow, display: 'block', textAlign: 'center', color: '#ffffff', marginBottom: '1rem' }}>
              Estamos aquí para asesorarte
            </p>
            <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Consultas y Soporte
            </h1>
            <p style={{ ...sectionDesc, color: 'rgba(255,255,255,0.75)', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
              Nuestro equipo de coordinadores y asesores académicos está disponible para atender tus dudas e inscripciones. Escríbenos y te responderemos a la brevedad.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Cards + CTA */}
      <section style={{ backgroundColor: '#f8fafc', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          <ContactList />

          <ContactActions />
        </div>
      </section>
    </>
  )
}
