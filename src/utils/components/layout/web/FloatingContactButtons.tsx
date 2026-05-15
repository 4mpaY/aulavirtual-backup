'use client'

import { useState } from 'react'

import { Phone, X, MapPin, Wrench } from 'lucide-react'

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.123.554 4.197 1.608 6.037L0 24l6.105-1.602a11.834 11.834 0 005.937 1.603h.005c6.637 0 12.032-5.395 12.035-12.032a11.761 11.761 0 00-3.489-8.492" />
  </svg>
)

const phoneNumbers = {
  ingenieria: { phone: '+51952914761', label: 'Área Ingeniería', icon: Wrench },
  topografia:  { phone: '+51989784114', label: 'Área Topografía', icon: MapPin },
}

export default function FloatingContactButtons() {
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)

  const handleWhatsApp = (area: keyof typeof phoneNumbers) => {
    const raw = phoneNumbers[area].phone.replace(/\D/g, '')

    window.open(`https://wa.me/${raw}`, '_blank')
    setWhatsappOpen(false)
  }

  const handleCall = (area: keyof typeof phoneNumbers) => {
    window.location.href = `tel:${phoneNumbers[area].phone}`
    setCallOpen(false)
  }

  const menuBase: React.CSSProperties = {
    position: 'absolute',
    bottom: '68px',
    left: 0,
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    border: '1px solid #EBF5FB',
    padding: '8px',
    minWidth: '210px',
    animation: 'fadeIn .15s ease',
  }

  const menuBtn: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#0D3A52',
    textAlign: 'left',
    transition: 'background .15s',
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* WhatsApp */}
      <div style={{ position: 'relative' }}>
        {whatsappOpen && (
          <div style={menuBase}>
            {Object.entries(phoneNumbers).map(([key, val]) => {
              const Icon = val.icon

              return (
                <button
                  key={key}
                  onClick={() => handleWhatsApp(key as keyof typeof phoneNumbers)}
                  style={menuBtn}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#EBF5FB' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                >
                  <Icon size={18} style={{ color: '#88C7E6', flexShrink: 0 }} />
                  {val.label}
                </button>
              )
            })}
          </div>
        )}
        <button
          onClick={() => { setWhatsappOpen(o => !o); setCallOpen(false) }}
          aria-label={whatsappOpen ? 'Cerrar opciones WhatsApp' : 'Abrir WhatsApp'}
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            backgroundColor: whatsappOpen ? '#EBF5FB' : '#25D366',
            color: whatsappOpen ? '#0D3A52' : '#ffffff',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(37,211,102,0.45)',
            transition: 'transform .2s, box-shadow .2s',
            transform: whatsappOpen ? 'rotate(45deg)' : 'scale(1)',
          }}
          onMouseEnter={e => { if (!whatsappOpen) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)' }}
          onMouseLeave={e => { if (!whatsappOpen) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          {whatsappOpen ? <X size={24} /> : <WhatsAppIcon size={24} />}
        </button>
      </div>

      {/* Llamada */}
      <div style={{ position: 'relative' }}>
        {callOpen && (
          <div style={menuBase}>
            {Object.entries(phoneNumbers).map(([key, val]) => {
              const Icon = val.icon

              return (
                <button
                  key={key}
                  onClick={() => handleCall(key as keyof typeof phoneNumbers)}
                  style={menuBtn}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#EBF5FB' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent' }}
                >
                  <Icon size={18} style={{ color: '#1177AB', flexShrink: 0 }} />
                  {val.label}
                </button>
              )
            })}
          </div>
        )}
        <button
          onClick={() => { setCallOpen(o => !o); setWhatsappOpen(false) }}
          aria-label={callOpen ? 'Cerrar opciones de llamada' : 'Llamar'}
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            backgroundColor: callOpen ? '#EBF5FB' : '#1177AB',
            color: callOpen ? '#0D3A52' : '#ffffff',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(17,119,171,0.45)',
            transition: 'transform .2s, box-shadow .2s',
            transform: callOpen ? 'rotate(45deg)' : 'scale(1)',
          }}
          onMouseEnter={e => { if (!callOpen) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)' }}
          onMouseLeave={e => { if (!callOpen) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
        >
          {callOpen ? <X size={24} /> : <Phone size={24} />}
        </button>
      </div>

    </div>
  )
}
