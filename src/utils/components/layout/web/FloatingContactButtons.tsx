'use client'

import { useConfig } from '@/contexts/ConfigContext'

const WhatsAppSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.301-.15-1.767-.872-2.04-.971-.272-.099-.47-.15-.669.15-.199.3-.771.971-.945 1.171-.174.2-.347.225-.648.075-.301-.15-1.269-.467-2.417-1.493-.893-.796-1.496-1.779-1.67-2.079-.174-.3-.018-.462.132-.61.135-.133.301-.35.452-.525.151-.174.202-.299.302-.499.101-.199.05-.375-.025-.524-.075-.15-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.299-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.768-.721 2.016-1.416.249-.695.249-1.291.174-1.416-.075-.124-.272-.199-.573-.349zM12.004 2C6.48 2 2.01 6.47 2.01 11.99c0 1.76.459 3.42 1.263 4.87L2 22l5.27-1.38c1.4.76 3.01 1.18 4.73 1.18 5.524 0 9.991-4.47 9.991-9.8 0-5.323-4.467-9.8-9.987-9.8zm.003 17.525a7.7 7.7 0 01-3.922-1.063l-.281-.167-2.91.763.777-2.834-.183-.291a7.71 7.71 0 01-1.18-4.043c0-4.256 3.46-7.717 7.72-7.717 4.258 0 7.719 3.46 7.719 7.718 0 4.258-3.46 7.72-7.72 7.72z" />
  </svg>
)

export default function FloatingContactButtons() {
  const configs = useConfig()
  const waNumber = configs.WHATSAPP_NUMERO || '51994356180'

  return (
    <div
      className="animate-agenda-float"
      style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999 }}
    >
      <a
        href={`https://wa.me/${waNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="group"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 25px rgba(37,211,102,0.45)',
          textDecoration: 'none',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
        }}
      >
        <WhatsAppSVG />
        <span
          style={{
            position: 'absolute',
            right: '100%',
            marginRight: '1rem',
            top: '50%',
            transform: 'translateY(-50%) scale(0)',
            transformOrigin: 'right center',
            backgroundColor: 'rgba(15,23,42,0.85)',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            padding: '0.3rem 0.75rem',
            borderRadius: '6px',
            transition: 'transform 0.2s ease',
            pointerEvents: 'none',
          }}
          className="group-hover:!scale-100"
        >
          WhatsApp
        </span>
      </a>
    </div>
  )
}
