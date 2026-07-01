'use client'

import { useState } from 'react'

import { MonitorSmartphone, X, Monitor, Smartphone } from 'lucide-react'

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
            position: 'absolute', top: 'calc(100% + 10px)', left: 0,
            width: '300px',
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
            border: '1px solid hsl(214,20%,88%)',
            zIndex: 50,
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px 10px',
              borderBottom: '1px solid hsl(214,20%,93%)',
            }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: 700, color: '#0A0A0A', margin: 0 }}>
                ¿Cómo instalar la app?
              </p>
              <button onClick={() => setShowTip(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
                <X size={16} />
              </button>
            </div>

            {/* Desktop step */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid hsl(214,20%,93%)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: 'rgba(189,217,98,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Monitor size={14} color="#025E44" />
                </div>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#0A0A0A' }}>
                  En Chrome o Edge (PC)
                </span>
              </div>
              {/* Simulación de barra de URL */}
              <div style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '10px',
                padding: '7px 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
                marginBottom: '6px',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  devrocket.org
                </span>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  backgroundColor: '#0A0A0A', borderRadius: '6px',
                  padding: '3px 8px', flexShrink: 0,
                }}>
                  <span style={{ fontSize: '0.7rem' }}>⊕</span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', color: '#ffffff', fontWeight: 600 }}>Instalar</span>
                </div>
              </div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Busca el ícono <strong>⊕</strong> o <strong>⬇</strong> en la barra de direcciones y haz clic en <strong>"Instalar"</strong>.
              </p>
            </div>

            {/* Mobile step */}
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '8px', backgroundColor: 'rgba(189,217,98,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Smartphone size={14} color="#025E44" />
                </div>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#0A0A0A' }}>
                  En móvil
                </span>
              </div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', color: '#64748b', margin: '0 0 4px 0', lineHeight: 1.5 }}>
                <strong>Chrome Android:</strong> menú <strong>⋮</strong> → <strong>"Añadir a pantalla de inicio"</strong>
              </p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                <strong>Safari iOS:</strong> botón <strong>Compartir ↑</strong> → <strong>"Agregar a inicio"</strong>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
