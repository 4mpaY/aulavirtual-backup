'use client'

import type { CSSProperties } from 'react'

import { AlertTriangle, Monitor, Share, Smartphone, X } from 'lucide-react'

import { usePWAInstall } from '@/utils/hooks/usePWAInstall'

interface PWAInstallTipProps {
  onClose: () => void
  style?: CSSProperties
}

const textMuted: CSSProperties = { fontFamily: 'Poppins, sans-serif', fontSize: '0.72rem', color: '#64748b', margin: 0, lineHeight: 1.5 }
const sectionTitle: CSSProperties = { fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#0A0A0A' }
const iconBadge: CSSProperties = { width: '26px', height: '26px', borderRadius: '8px', backgroundColor: 'rgba(189,217,98,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }

export default function PWAInstallTip({ onClose, style }: PWAInstallTipProps) {
  const { platform, isSafari, isInAppBrowser } = usePWAInstall()

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={onClose} />
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: 0,
          width: '300px',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
          border: '1px solid hsl(214,20%,88%)',
          zIndex: 50,
          overflow: 'hidden',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px', borderBottom: '1px solid hsl(214,20%,93%)' }}>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: 700, color: '#0A0A0A', margin: 0 }}>
            ¿Cómo instalar la app?
          </p>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px', display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '12px 16px' }}>
          {isInAppBrowser && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={iconBadge}><AlertTriangle size={14} color="#025E44" /></div>
                <span style={sectionTitle}>Abre el enlace en tu navegador</span>
              </div>
              <p style={textMuted}>
                Estás dentro de una app (Instagram, TikTok, WhatsApp, etc.). Toca el menú <strong>⋮</strong> o <strong>&quot;Abrir en el navegador&quot;</strong> para poder instalar la aplicación.
              </p>
            </>
          )}

          {!isInAppBrowser && platform === 'ios' && isSafari && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={iconBadge}><Share size={14} color="#025E44" /></div>
                <span style={sectionTitle}>Safari (iPhone / iPad)</span>
              </div>
              <p style={textMuted}>
                Toca el botón <strong>Compartir ↑</strong> en la barra inferior y luego <strong>&quot;Agregar a inicio&quot;</strong>.
              </p>
            </>
          )}

          {!isInAppBrowser && platform === 'ios' && !isSafari && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={iconBadge}><AlertTriangle size={14} color="#025E44" /></div>
                <span style={sectionTitle}>Abre este sitio en Safari</span>
              </div>
              <p style={textMuted}>
                En iPhone/iPad, solo <strong>Safari</strong> permite instalar la app. Copia el enlace y ábrelo en Safari, luego toca <strong>Compartir ↑</strong> → <strong>&quot;Agregar a inicio&quot;</strong>.
              </p>
            </>
          )}

          {!isInAppBrowser && platform === 'android' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={iconBadge}><Smartphone size={14} color="#025E44" /></div>
                <span style={sectionTitle}>Android</span>
              </div>
              <p style={textMuted}>
                Toca el menú <strong>⋮</strong> de tu navegador y selecciona <strong>&quot;Añadir a pantalla de inicio&quot;</strong> o <strong>&quot;Instalar app&quot;</strong>.
              </p>
            </>
          )}

          {!isInAppBrowser && platform === 'desktop' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={iconBadge}><Monitor size={14} color="#025E44" /></div>
                <span style={sectionTitle}>Chrome / Edge (PC)</span>
              </div>
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
                  {typeof window !== 'undefined' ? window.location.hostname : ''}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#0A0A0A', borderRadius: '6px', padding: '3px 8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.7rem' }}>⊕</span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', color: '#ffffff', fontWeight: 600 }}>Instalar</span>
                </div>
              </div>
              <p style={textMuted}>
                Busca el ícono <strong>⊕</strong> o <strong>⬇</strong> en la barra de direcciones y haz clic en <strong>&quot;Instalar&quot;</strong>.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
