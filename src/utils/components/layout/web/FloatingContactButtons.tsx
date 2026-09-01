'use client'

import { useState, useRef, useEffect } from 'react'

import { X, Send } from 'lucide-react'

import { useConfig } from '@/contexts/ConfigContext'

const WhatsAppIcon = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.301-.15-1.767-.872-2.04-.971-.272-.099-.47-.15-.669.15-.199.3-.771.971-.945 1.171-.174.2-.347.225-.648.075-.301-.15-1.269-.467-2.417-1.493-.893-.796-1.496-1.779-1.67-2.079-.174-.3-.018-.462.132-.61.135-.133.301-.35.452-.525.151-.174.202-.299.302-.499.101-.199.05-.375-.025-.524-.075-.15-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.299-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.768-.721 2.016-1.416.249-.695.249-1.291.174-1.416-.075-.124-.272-.199-.573-.349zM12.004 2C6.48 2 2.01 6.47 2.01 11.99c0 1.76.459 3.42 1.263 4.87L2 22l5.27-1.38c1.4.76 3.01 1.18 4.73 1.18 5.524 0 9.991-4.47 9.991-9.8 0-5.323-4.467-9.8-9.987-9.8zm.003 17.525a7.7 7.7 0 01-3.922-1.063l-.281-.167-2.91.763.777-2.834-.183-.291a7.71 7.71 0 01-1.18-4.043c0-4.256 3.46-7.717 7.72-7.717 4.258 0 7.719 3.46 7.719 7.718 0 4.258-3.46 7.72-7.72 7.72z" />
  </svg>
)

export default function FloatingContactButtons() {
  const configs = useConfig()
  const waNumber = configs.WHATSAPP_NUMERO || '51994356180'
  const logoUrl = configs.TEMPLATE_LOGO || '/icons/icon-192x192.png'
  const platformName = configs.TEMPLATE_NAME || 'Agenda'
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
    }
  }, [isOpen])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const textToSend = message.trim() || '¡Hola! Quisiera más información sobre los cursos y capacitaciones.'
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(textToSend)}`

    window.open(url, '_blank')
    setMessage('')
    setIsOpen(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: '1.75rem', right: '1.75rem', zIndex: 99999 }}>
      {/* Ventana Modal / Chat Popup */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '75px',
            right: '0',
            width: '340px',
            maxWidth: 'calc(100vw - 2.5rem)',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'wspPopupIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            transformOrigin: 'bottom right',
            background: '#ffffff',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {/* Header del Chat */}
          <div
            style={{
              background: '#075E54',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  flexShrink: 0,
                  overflow: 'hidden'
                }}
              >
                <img
                  src={logoUrl}
                  alt={platformName}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div>
                <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '0.98rem', margin: 0, lineHeight: 1.2 }}>
                  Equipo de soporte
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#25D366' }} />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    En línea
                  </span>
                </div>
              </div>
            </div>

            {/* Botón Cerrar en Header */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar chat"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              <X size={16} />
            </button>
          </div>

          {/* Cuerpo del Chat (Estilo WhatsApp) */}
          <div
            style={{
              background: '#EFEAE2',
              backgroundImage: 'radial-gradient(#d3c9bf 1px, transparent 1px)',
              backgroundSize: '16px 16px',
              padding: '1.25rem 1rem',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start'
            }}
          >
            {/* Mensaje de bienvenida */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '0 1rem 1rem 1rem',
                padding: '0.85rem 1rem',
                maxWidth: '88%',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                position: 'relative',
                alignSelf: 'flex-start'
              }}
            >
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#1A1A1A', lineHeight: 1.45 }}>
                ¡Hola! 👋 ¿Tienes alguna duda? Escríbenos y te ayudamos al instante.
              </p>
              <span
                style={{
                  display: 'block',
                  textAlign: 'right',
                  fontSize: '0.68rem',
                  color: '#888',
                  marginTop: '0.35rem'
                }}
              >
                Ahora
              </span>
            </div>
          </div>

          {/* Footer Input */}
          <form
            onSubmit={handleSendMessage}
            style={{
              background: '#ffffff',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderTop: '1px solid #f0f0f0'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: '999px',
                border: '1.5px solid #25D366',
                outline: 'none',
                fontSize: '0.88rem',
                fontFamily: 'Inter, sans-serif',
                color: '#333'
              }}
            />
            <button
              type="submit"
              aria-label="Enviar mensaje a WhatsApp"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: message.trim() ? '#25D366' : '#c4cdd5',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s ease, transform 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => {
                if (message.trim()) e.currentTarget.style.transform = 'scale(1.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Botón Flotante Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp'}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(37,211,102,0.5)',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s',
          position: 'relative',
          outline: 'none'
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <>
            <WhatsAppIcon size={32} />
            {/* Punto indicador de en línea / notificación */}
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                border: '3px solid #25D366'
              }}
            />
          </>
        )}
      </button>

      <style jsx global>{`
        @keyframes wspPopupIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(15px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
