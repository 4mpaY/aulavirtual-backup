import { Linkedin, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react'


import { getConfigs } from '@/utils/libs/config'

export const metadata = {
  title: 'Empleabilidad — Bono LinkedIn & Networking',
  description: 'Potencia tu perfil profesional con LinkedIn y networking. Bono gratuito incluido en todos nuestros programas.',
}

const ITEMS = [
  'Optimización profesional de perfil en LinkedIn',
  'Estrategias de networking efectivo para el sector tech',
  'Creación de marca personal para desarrolladores',
  'Técnicas de búsqueda activa de empleo',
  'Asesoría en visibilidad profesional digital',
]

export default async function EmpleabilidadPage() {
  const configs = await getConfigs()
  const waNumber = configs.WHATSAPP_NUMERO || '51994356180'
  const WA = `https://wa.me/${waNumber}?text=Hola%2C%20quiero%20información%20sobre%20el%20bono%20de%20empleabilidad`

  return (
    <main>
      {/* Encabezado */}
      <section style={{ background: 'linear-gradient(135deg, #012d22 0%, #025E44 50%, #0f4438 100%)', padding: '4rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem' }}>Inicio</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</span>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#BDD962', fontWeight: 600 }}>Empleabilidad</span>
          </div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: '1rem' }}>
            Bono de <span style={{ color: '#BDD962' }}>Empleabilidad</span>
          </h1>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', maxWidth: '520px', lineHeight: 1.7 }}>
            Potencia tu perfil profesional con LinkedIn, networking y estrategias de marca personal.
          </p>
        </div>
      </section>

      <div className="bg-circuit" style={{ paddingTop: '5rem', paddingBottom: '8rem' }}>
      <section className="container-page" style={{ position: 'relative' }}>
        <div style={{ marginBottom: '4rem' }}>
          <span className="eyebrow-agenda">Bono de Empleabilidad</span>
          <h1
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              marginTop: '1.5rem',
              color: '#1A1A1A',
              lineHeight: 1.15,
            }}
          >
            Potencia tu perfil con{' '}
            <span style={{ color: 'var(--agenda-primary)' }}>LinkedIn y Networking</span>
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#555', lineHeight: 1.75, marginBottom: '3rem' }}>
              Todos nuestros alumnos matriculados acceden de forma gratuita a un programa exclusivo de marca personal diseñado por expertos en el sector tecnológico.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
              {ITEMS.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(0,111,101,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--agenda-primary)',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500, color: 'rgba(26,26,26,0.8)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary-agenda"
              style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}
            >
              <MessageCircle size={20} /> Solicitar información del bono
            </a>
          </div>

          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '3rem',
                background: '#ffffff',
                border: '1px solid #e5e5e5',
                padding: '3rem',
                boxShadow: 'var(--agenda-shadow-premium)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', color: 'rgba(0,111,101,0.08)' }}>
                <Linkedin size={160} />
              </div>

              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: 'var(--agenda-gradient-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    marginBottom: '2rem',
                  }}
                >
                  <Sparkles size={32} />
                </div>

                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.75rem', marginBottom: '1.5rem', color: '#1A1A1A', letterSpacing: '-0.02em' }}>
                  Seminario Incluido
                </h2>
                <p style={{ fontFamily: 'Inter, sans-serif', color: '#666', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                  No se trata solo de aprender código, sino de saber cómo mostrar tu valor al mundo profesional. Este bono te da las herramientas necesarias para destacar.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {[
                    { value: '+20', label: 'Años de experiencia.' },
                    { value: '100%', label: 'Gratuito' },
                  ].map(s => (
                    <div key={s.label} style={{ flex: '1 1 140px', background: '#fafafa', padding: '1.5rem', borderRadius: '1.25rem', border: '1px solid #e5e5e5', minWidth: 0 }}>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '1.75rem', color: 'var(--agenda-primary)', marginBottom: '0.25rem' }}>{s.value}</p>
                      <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </main>
  )
}
