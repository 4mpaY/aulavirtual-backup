import React from 'react'

import Link from 'next/link'
import Image from 'next/image'

import { MessageCircle, Mail, MapPin, Instagram, Linkedin, Sparkles } from 'lucide-react'

import HydratedDate from '@/utils/components/HydratedDate'
import { getConfigs } from '@/utils/libs/config'

interface WebFooterProps {
  platformName?: string
  rutasHabilitado?: boolean
}

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
)

const WebFooter = async ({ platformName = 'Aula Virtual', rutasHabilitado = true }: WebFooterProps) => {
  const configs = await getConfigs()
  const waNumber = configs.WHATSAPP_NUMERO || '51959436827'
  const phone = configs.TELEFONO || '+51 928 510 125'
  const email = configs.EMAIL_CONTACTO || 'contacto@agendaperu.com'
  const address = configs.DIRECCION || 'Lima, Perú'

  return (
    <footer style={{ backgroundColor: '#1A1A1A', color: '#ffffff', position: 'relative', overflow: 'hidden' }}>
      {/* Top gradient line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,111,101,0.4), transparent)' }} />

      <div className="container-page" style={{ paddingTop: '5rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem' }}>

          {/* Logo + descripción */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Image
              src="/images/agenda/logo-sin-fondo.png"
              alt={platformName}
              width={120}
              height={40}
              style={{ objectFit: 'contain', height: '40px', width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.9 }}
            />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '260px' }}>
              Formación tecnológica con criterio profesional, diseñada para impulsar la empleabilidad en la era digital.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { href: '#', icon: <Instagram size={18} />, label: 'Instagram' },
                { href: '#', icon: <Linkedin size={18} />, label: 'LinkedIn' },
                { href: '#', icon: <TikTokIcon size={18} />, label: 'TikTok' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.6)', transition: 'background 0.2s, color 0.2s', textDecoration: 'none' }}
                  className="hover:bg-[var(--agenda-primary)] hover:!text-white hover:border-transparent"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '2rem' }}>
              Contacto Oficial
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { icon: <MessageCircle size={16} />, text: phone },
                { icon: <Mail size={16} />, text: email },
                { icon: <MapPin size={16} />, text: address },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--agenda-primary)', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Menú */}
          <div>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '2rem' }}>
              Menú
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Capacitaciones', href: '/cursos' },
                { label: 'Empleabilidad', href: '/empleabilidad' },
                { label: 'Certificación', href: '/certificacion' },
                { label: 'Nosotros', href: '/nosotros' },
                { label: 'Contacto', href: '/contacto' },
                ...(rutasHabilitado ? [{ label: 'Rutas', href: '/rutas' }] : []),
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.2s' }}
                    className="hover:text-[var(--agenda-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Misión */}
          <div>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ffffff', marginBottom: '2rem' }}>
              Nuestra Misión
            </h4>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1.5rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
                "La educación abre caminos. La tecnología los multiplica. Nuestra misión es darte las llaves de ese futuro."
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--agenda-primary)', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                <Sparkles size={14} /> AGENDA
              </div>
            </div>

            {/* WhatsApp button */}
            <a
              href={`https://wa.me/${waNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-agenda"
              style={{ marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.65rem 1.25rem' }}
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container-page flex flex-col sm:flex-row items-center justify-between gap-3" style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
            © <HydratedDate date={new Date()} format="year" /> {platformName}. Todos los derechos reservados.
          </p>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { label: 'Términos', href: '/terminos-y-condiciones' },
              { label: 'Privacidad', href: '/politica-de-cambios-y-devoluciones' },
              { label: 'Certificado', href: '/verificar-certificado' },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                className="hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default WebFooter
