import Link from 'next/link'

import { MessageCircle, Phone, Mail, MapPin, ArrowRight, Instagram, Linkedin } from 'lucide-react'

import { getConfigs } from '@/utils/libs/config'

export const metadata = {
  title: 'Contacto — Estamos aquí para ayudarte',
  description: 'Ponte en contacto con nosotros por WhatsApp, llamada o correo electrónico.',
}

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
)

export default async function ContactoPage() {
  const configs = await getConfigs()
  const waNumber = configs.WHATSAPP_NUMERO || '51959436827'
  const phone = configs.TELEFONO || `+${waNumber}`
  const email = configs.EMAIL_CONTACTO || 'contacto@agendaperu.com'
  const address = configs.DIRECCION || 'Lima, Perú'
  const WA = `https://wa.me/${waNumber}?text=Hola%2C%20quiero%20información%20sobre%20las%20capacitaciones`

  return (
    <main>
      {/* Encabezado */}
      <section style={{ background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem' }}>Inicio</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#BDD962', fontWeight: 600 }}>Contacto</span>
          </div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
            Estamos aquí para <span style={{ color: '#BDD962' }}>ayudarte</span>
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.7 }}>
            Ponte en contacto con nosotros por WhatsApp, llamada o correo electrónico.
          </p>
        </div>
      </section>

      <div className="bg-circuit" style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      <section className="container-page">

        {/* Cards de contacto */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          {/* WhatsApp */}
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="group"
            style={{ padding: '2.5rem', borderRadius: '3rem', background: '#ffffff', border: '1px solid #e5e5e5', transition: 'all 0.4s', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: 'rgba(37,211,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366', transition: 'all 0.4s' }}>
              <MessageCircle size={30} />
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#1A1A1A' }}>WhatsApp</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', lineHeight: 1.65 }}>
              Atención inmediata y personalizada para consultas rápidas y matrículas.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--agenda-primary)', marginTop: 'auto' }}>
              Ir a WhatsApp <ArrowRight size={18} />
            </div>
          </a>

          {/* Llamada */}
          <Link
            href="/llamadas"
            className="group"
            style={{ padding: '2.5rem', borderRadius: '3rem', background: '#ffffff', border: '1px solid #e5e5e5', transition: 'all 0.4s', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: 'rgba(0,111,101,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--agenda-primary)', transition: 'all 0.4s' }}>
              <Phone size={30} />
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#1A1A1A' }}>Llamada Directa</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', lineHeight: 1.65 }}>
              Habla directamente con nuestro equipo académico para una asesoría detallada.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--agenda-primary)', marginTop: 'auto' }}>
              Ver número <ArrowRight size={18} />
            </div>
          </Link>

          {/* Email */}
          <div style={{ padding: '2.5rem', borderRadius: '3rem', background: '#ffffff', border: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: 'var(--agenda-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--agenda-primary-dark)' }}>
              <Mail size={30} />
            </div>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', color: '#1A1A1A' }}>Correo Electrónico</h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#666', lineHeight: 1.65 }}>
              Envíanos tus propuestas o consultas corporativas de forma oficial.
            </p>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--agenda-primary)', marginTop: 'auto' }}>{email}</p>
          </div>
        </div>

        {/* Ubicación */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Panel izquierdo */}
          <div style={{ background: 'linear-gradient(135deg, #012d22 0%, #025E44 100%)', borderRadius: '3rem', padding: '3rem', border: 'none', boxShadow: '0 8px 40px rgba(2,94,68,0.25)' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.5rem', color: '#ffffff', marginBottom: '2rem' }}>Nuestra Ubicación</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BDD962', flexShrink: 0 }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Sede Central</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{address}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#BDD962', flexShrink: 0 }}>
                  <Phone size={20} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>Teléfono</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>{phone}</p>
                </div>
              </div>

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#BDD962', marginBottom: '1rem' }}>Redes Oficiales</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {[
                    { href: '#', icon: <Instagram size={20} />, label: 'Instagram' },
                    { href: '#', icon: <Linkedin size={20} />, label: 'LinkedIn' },
                    { href: '#', icon: <TikTokIcon size={20} />, label: 'TikTok' },
                  ].map(s => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', textDecoration: 'none', transition: 'all 0.2s' }}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div style={{ borderRadius: '3rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(2,94,68,0.2)', border: '3px solid #025E44', aspectRatio: '1 / 1', position: 'relative' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.123456789!2d-76.971!3d-12.085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA1JzA2LjAiUyA3Niw1OCcxNS42Ilc!5e0!3m2!1ses!2spe!4v1234567890123"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              loading="lazy"
              title="Mapa de ubicación"
            />
          </div>
        </div>
      </section>
      </div>
    </main>
  )
}
