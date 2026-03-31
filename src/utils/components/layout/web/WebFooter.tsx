import React from 'react'

import Link from 'next/link'

import { Phone, Mail, MapPin, BookOpenCheck } from 'lucide-react'

import HydratedDate from '@/utils/components/HydratedDate'
import Logo from '@components/layout/shared/Logo'

const WebFooter = () => {
  return (
    <footer style={{ backgroundColor: '#0A0A0A', color: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Contact */}
          <div>
            <h4
              className="mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#ffffff' }}
            >
              Contacto
            </h4>
            <ul className="space-y-3" style={{ opacity: 0.8 }}>
              <li className="flex items-start gap-2" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem' }}>
                <Phone size={16} className="flex-shrink-0 mt-0.5" />
                <span>+51 959 436 827</span>
              </li>
              <li className="flex items-start gap-2" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem' }}>
                <Mail size={16} className="flex-shrink-0 mt-0.5" />
                <span>arm.confiabilidad@gmail.com</span>
              </li>
              <li className="flex items-start gap-2" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem' }}>
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>Piura, Av. Sanchez Cerro Mz O&apos; Lote 10 Urb. Santa Ana</span>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#ffffff' }}
            >
              Formación
            </h4>
            <ul className="space-y-2" style={{ opacity: 0.8 }}>
              {['Cursos virtuales', 'Cursos en vivo', 'Rutas de aprendizaje', 'Certificaciones'].map(s => (
                <li key={s} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem' }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4
              className="mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#ffffff' }}
            >
              Enlaces
            </h4>
            <ul className="space-y-2" style={{ opacity: 0.8 }}>
              {[
                { label: 'Inicio', href: '/' },
                { label: 'Cursos', href: '/cursos' },
                { label: 'Nosotros', href: '/nosotros' },
                { label: 'Rutas de Aprendizaje', href: '/rutas' },
                { label: 'Validar certificado', href: '/verificar-certificado' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="no-underline transition-opacity hover:opacity-100"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4
              className="mb-4"
              style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '1.0625rem', color: '#ffffff' }}
            >
              Información
            </h4>
            <ul className="space-y-2" style={{ opacity: 0.8 }}>
              {[
                { label: 'Facebook', href: 'https://facebook.com' },
                { label: 'YouTube', href: 'https://youtube.com' },
                { label: 'Políticas de privacidad', href: '/terminos-y-condiciones' },
                { label: 'Términos y condiciones', href: '/terminos-y-condiciones' },
                { label: 'Libro de Reclamaciones', href: '/libro-de-reclamaciones' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="no-underline transition-opacity hover:opacity-100 inline-flex items-center gap-1.5"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}
                  >
                    {link.label === 'Libro de Reclamaciones' && <BookOpenCheck size={13} />}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo />
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              © <HydratedDate date={new Date()} format="year" /> Aula Virtual. Todos los derechos reservados.
            </p>
          </div>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
            Desarrollado por{' '}
            <span style={{ color: 'hsl(75, 63%, 62%)', fontWeight: 600 }}>Fly Software</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default WebFooter
