import Link from 'next/link'

import { Phone, Mail, MapPin } from 'lucide-react'

import ScrollReveal from '@/features/web/home/components/ScrollReveal'
import { eyebrow, sectionH2, sectionDesc } from '@/features/web/home/components/typography'

export const metadata = {
  title: 'Contacto - ARM',
  description: 'Ponte en contacto con nosotros',
}

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 45%, var(--web-dark-mid, #0f4438) 100%)',
          padding: '6rem 1.5rem 5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--web-primary-rgb, 37, 146, 127),0.22) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <ScrollReveal>
            <p style={{ ...eyebrow, display: 'block', textAlign: 'center', color: 'var(--web-light, #BDD962)', marginBottom: '1rem' }}>
              Estamos aquí para ayudarte
            </p>
            <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Ponte en Contacto
            </h1>
            <p style={{ ...sectionDesc, color: 'rgba(255,255,255,0.75)', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
              Contáctanos por cualquiera de estos medios y te responderemos a la brevedad.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Cards + CTA */}
      <section style={{ backgroundColor: '#f8fafc', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            {[
              { icon: MapPin,  title: 'Dirección', info: 'Piura, Av. Sanchez Cerro Mz O\' Lote 10 Urb. Santa Ana', href: null },
              { icon: Phone,   title: 'WhatsApp',  info: '+51 959 436 827', href: 'https://wa.me/51959436827' },
              { icon: Mail,    title: 'Email',     info: 'arm.confiabilidad@gmail.com', href: 'mailto:arm.confiabilidad@gmail.com' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '2rem',
                    textAlign: 'center',
                    border: '1.5px solid hsl(214,20%,91%)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(-4px)'
                    el.style.boxShadow = '0 12px 32px rgba(var(--web-primary-rgb, 37, 146, 127),0.12)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'rgba(var(--web-primary-rgb, 37, 146, 127), 0.1)', marginBottom: '1.25rem' }}>
                    <item.icon style={{ width: '28px', height: '28px', color: 'var(--web-primary, #25927F)' }} />
                  </div>
                  <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', fontWeight: 600, color: 'var(--web-dark, #025E44)', textDecoration: 'none' }}
                    >
                      {item.info}
                    </a>
                  ) : (
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b' }}>
                      {item.info}
                    </p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <a
                href="https://wa.me/51959436827"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 2rem',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--web-primary, #25927F)',
                  color: '#ffffff',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--web-dark, #025E44)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'var(--web-primary, #25927F)' }}
              >
                <Phone size={18} />
                Enviar WhatsApp
              </a>
              <Link
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.875rem 2rem',
                  borderRadius: '9999px',
                  border: '2px solid var(--web-primary, #25927F)',
                  color: 'var(--web-primary, #25927F)',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.backgroundColor = 'var(--web-primary, #25927F)'
                  el.style.color = '#ffffff'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.backgroundColor = 'transparent'
                  el.style.color = 'var(--web-primary, #25927F)'
                }}
              >
                Volver al inicio
              </Link>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </>
  )
}
