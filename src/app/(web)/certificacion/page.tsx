import Image from 'next/image'
import Link from 'next/link'

import { BadgeCheck, QrCode, Award, ShieldCheck, Search } from 'lucide-react'

import SearchCertificateSection from '@/features/web/home/components/SearchCertificateSection'

export const metadata = {
  title: 'Certificación Digital con QR — Respaldo Agenda 2050',
  description: 'Obtén un certificado digital verificable con código QR al finalizar tus estudios. Respaldado institucionalmente por Agenda 2050 y con validez profesional.',
}

const FEATURES = [
  {
    icon: BadgeCheck,
    title: 'Aval Institucional Agenda 2050',
    text: 'Emitido y respaldado directamente por Agenda 2050, garantizando la validez institucional y autenticidad de tu certificación.',
  },
  {
    icon: ShieldCheck,
    title: 'Verificación en Línea',
    text: 'Cualquier empleador puede escanear el código QR para validar instantáneamente la validez y los detalles de tu certificación.',
  },
  {
    icon: Award,
    title: 'Horas Académicas',
    text: 'Nuestros certificados detallan la carga horaria cronológica y académica para dar peso a tu formación profesional.',
  },
]

export default function CertificacionPage() {
  return (
    <main>
      {/* Encabezado */}
      <section style={{ background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem' }}>Inicio</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#BDD962', fontWeight: 600 }}>Certificación</span>
          </div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
            Certificación <span style={{ color: '#BDD962' }}>Digital con QR</span>
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.7 }}>
            Certificados verificables con código QR, respaldo institucional de Agenda 2050 y validez profesional reconocida.
          </p>
        </div>
      </section>

      <div className="bg-circuit" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
        <section className="container-page">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }} data-animate="fade-up">
            <span className="eyebrow-agenda">Validación Profesional</span>
            <h1
              style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '-0.03em',
                marginTop: '2rem',
                color: '#1A1A1A',
                lineHeight: 1.15,
              }}
            >
              Certificación con <span style={{ color: 'var(--agenda-primary)' }}>Respaldo Digital</span>
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#666', lineHeight: 1.7, maxWidth: '640px', margin: '1.5rem auto 0' }}>
              Al finalizar satisfactoriamente tus estudios, obtendrás un certificado digital verificable que acredita tus nuevas competencias tecnológicas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            {/* Imagen */}
            <div data-animate="fade-right" style={{ position: 'relative', order: 1 }}>
              <div style={{ position: 'absolute', inset: '-1rem', background: 'rgba(0,111,101,0.12)', borderRadius: '2.5rem', filter: 'blur(30px)', opacity: 0, transition: 'opacity 0.7s' }} />
              <Image
                src="/images/agenda/certificate.jpg"
                alt="Ejemplo de certificado con código QR"
                width={600}
                height={420}
                style={{ borderRadius: '2rem', boxShadow: 'var(--agenda-shadow-premium)', border: '1px solid #e5e5e5', width: '100%', height: 'auto' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-1.5rem',
                  right: '-1.5rem',
                  background: '#ffffff',
                  padding: '1.25rem',
                  borderRadius: '1.25rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  border: '1px solid #e5e5e5',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <QrCode size={48} style={{ color: 'var(--agenda-primary)' }} />
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center' }}>QR Verificable</p>
              </div>
            </div>

            {/* Features */}
            <div data-animate="fade-left" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', order: 2 }} className="stagger-container">
              {FEATURES.map((f) => (
                <div key={f.title} style={{ display: 'flex', gap: '1.5rem' }}>
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '1rem',
                      background: 'var(--agenda-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--agenda-primary-dark)',
                      flexShrink: 0,
                    }}
                  >
                    <f.icon size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.75rem', color: '#1A1A1A' }}>{f.title}</h3>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', color: '#666', lineHeight: 1.65 }}>{f.text}</p>
                  </div>
                </div>
              ))}

              <div style={{ paddingTop: '1rem' }}>
                <a
                  href="#verificar-certificado"
                  className="btn-primary-agenda"
                  style={{ fontSize: '1rem', padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                >
                  <Search size={20} /> Verificar certificado
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Sección para verificar certificado */}
      <section id="verificar-certificado">
        <SearchCertificateSection />
      </section>
    </main>
  )
}
