import { Phone, PhoneCall } from 'lucide-react'

import { getConfigs } from '@/utils/libs/config'

export const metadata = {
  title: 'Atención Telefónica — Contacto Directo',
}

export default async function LlamadasPage() {
  const configs = await getConfigs()
  const waNumber = configs.WHATSAPP_NUMERO || '51994356180'
  const phoneDisplay = configs.TELEFONO || `+${waNumber}`
  const telLink = `tel:${phoneDisplay.startsWith('+') ? phoneDisplay : '+' + phoneDisplay}`

  return (
    <div style={{ display: 'flex', minHeight: '80vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{ position: 'absolute', inset: '-1rem', borderRadius: '50%', background: 'rgba(0,111,101,0.12)', animation: 'agenda-float 3s ease-in-out infinite' }} />
        <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '24px', background: 'var(--agenda-gradient-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: 'var(--agenda-shadow-brand)' }}>
          <Phone size={48} />
        </div>
      </div>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#1A1A1A', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>Atención Telefónica</h1>
      <p style={{ fontFamily: 'Inter, sans-serif', color: '#666', fontSize: '1.1rem', maxWidth: '420px', lineHeight: 1.7, marginBottom: '2rem' }}>
        Nuestro equipo está listo para resolver tus dudas.
      </p>
      <div style={{ background: '#fafafa', padding: '2rem 3rem', borderRadius: '1.5rem', border: '1px solid #e5e5e5', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2.5rem' }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: '0.5rem' }}>Número de contacto</p>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#1A1A1A', letterSpacing: '-0.02em' }}>{phoneDisplay}</span>
      </div>
      <a
        href={telLink}
        className="btn-primary-agenda"
        style={{ fontSize: '1.1rem', padding: '1.1rem 2.75rem' }}
      >
        <PhoneCall size={22} /> Llamar ahora
      </a>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#aaa', marginTop: '2rem' }}>
        Horario de atención: Lunes a Sábado de 9:00 AM a 8:00 PM.
      </p>
    </div>
  )
}
