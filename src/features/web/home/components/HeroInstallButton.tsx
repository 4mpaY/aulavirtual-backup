'use client'

import { useState } from 'react'

import { MonitorSmartphone } from 'lucide-react'

import { usePWAInstall } from '@/utils/hooks/usePWAInstall'

export default function HeroInstallButton() {
  const { canInstall, hasNativePrompt, install } = usePWAInstall()
  const [showTip, setShowTip] = useState(false)

  if (!canInstall) return null

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => hasNativePrompt ? install() : setShowTip(t => !t)}
        className="inline-flex items-center gap-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
        style={{
          fontFamily: 'Poppins, sans-serif',
          backgroundColor: 'var(--web-light, #BDD962)',
          color: '#0A0A0A',
          fontSize: '0.9375rem',
          padding: '0.875rem 1.75rem',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(189,217,98,0.45)',
        }}
      >
        <MonitorSmartphone size={18} />
        Instalar App
      </button>

      {showTip && !hasNativePrompt && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setShowTip(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            width: '280px', backgroundColor: '#fff', borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '1px solid hsl(214,20%,91%)',
            zIndex: 50, padding: '16px',
          }}>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#0A0A0A', margin: '0 0 8px 0' }}>
              Instalar la aplicación
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.78rem', color: '#64748b', margin: '0 0 6px 0', lineHeight: 1.6 }}>
              <strong>Chrome / Edge:</strong> busca el ícono ⊕ o ⬇ en la barra de direcciones y selecciona &quot;Instalar&quot;.
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
              <strong>Safari iOS:</strong> toca <strong>Compartir ↑</strong> → <strong>&quot;Agregar a inicio&quot;</strong>.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
