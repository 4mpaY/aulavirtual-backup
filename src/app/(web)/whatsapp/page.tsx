'use client'

import { useEffect } from 'react'

import { MessageCircle, ExternalLink } from 'lucide-react'

import { useConfig } from '@/contexts/ConfigContext'

export default function WhatsAppPage() {
  const configs = useConfig()
  const waNumber = configs.WHATSAPP_NUMERO || '51959436827'
  const waUrl = `https://wa.me/${waNumber}?text=Hola%2C%20vengo%20de%20la%20web%20y%20quiero%20información%20sobre%20las%20capacitaciones`

  useEffect(() => {
    const t = setTimeout(() => {
      window.open(waUrl, '_blank')
    }, 2000)

    return () => clearTimeout(t)
  }, [waUrl])

  return (
    <div style={{ display: 'flex', minHeight: '80vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', background: '#ffffff' }}>
      <div style={{ position: 'relative', marginBottom: '2rem' }}>
        <div style={{ position: 'absolute', inset: '-1rem', borderRadius: '50%', background: 'rgba(37,211,102,0.15)', animation: 'agenda-float 3s ease-in-out infinite' }} />
        <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '24px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', boxShadow: '0 8px 30px rgba(37,211,102,0.4)' }}>
          <MessageCircle size={48} />
        </div>
      </div>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2rem', color: '#1A1A1A', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>WhatsApp</h1>
      <p style={{ fontFamily: 'Inter, sans-serif', color: '#666', maxWidth: '420px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
        Te estamos redirigiendo a nuestro canal oficial de WhatsApp para brindarte una atención personalizada.
      </p>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem 2rem',
          borderRadius: '9999px',
          background: '#25D366',
          color: '#ffffff',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          textDecoration: 'none',
          boxShadow: '0 8px 25px rgba(37,211,102,0.4)',
        }}
      >
        Abrir WhatsApp ahora <ExternalLink size={18} />
      </a>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: '#aaa', marginTop: '1.5rem' }}>
        Si la aplicación no se abre automáticamente, haz clic en el botón de arriba.
      </p>
    </div>
  )
}
