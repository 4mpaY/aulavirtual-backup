'use client'

import { useEffect, useState } from 'react'

export default function PWAInstalledToast() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleInstalled = () => {
      setVisible(true)
      setTimeout(() => setVisible(false), 5000)
    }

    window.addEventListener('appinstalled', handleInstalled)

    return () => window.removeEventListener('appinstalled', handleInstalled)
  }, [])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes pwaToastSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: '88px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: '320px',
          maxWidth: 'calc(100vw - 32px)',
          backgroundColor: '#0A0A0A',
          borderRadius: '18px',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          border: '1px solid rgba(255,255,255,0.08)',
          animation: 'pwaToastSlideUp 0.4s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        <span style={{ fontSize: '1.375rem', lineHeight: 1, flexShrink: 0, marginTop: '1px' }}>📲</span>
        <div>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 3px 0',
            lineHeight: 1.3,
          }}>
            ¡Ya tienes la app instalada!
          </p>
          <p style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.775rem',
            color: 'rgba(255,255,255,0.65)',
            margin: 0,
            lineHeight: 1.5,
          }}>
            Encuéntrala en tu pantalla de inicio y ábrela cuando quieras.
          </p>
        </div>

        {/* Barra de progreso auto-dismiss */}
        <style>{`
          @keyframes pwaToastProgress {
            from { width: 100%; }
            to   { width: 0%; }
          }
        `}</style>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          borderRadius: '0 0 18px 18px',
          overflow: 'hidden',
          backgroundColor: 'rgba(255,255,255,0.08)',
        }}>
          <div style={{
            height: '100%',
            backgroundColor: 'var(--web-light, #BDD962)',
            animation: 'pwaToastProgress 5s linear forwards',
          }} />
        </div>
      </div>
    </>
  )
}
