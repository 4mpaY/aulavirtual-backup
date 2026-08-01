'use client'

import { useState } from 'react'

import { MonitorSmartphone } from 'lucide-react'

import { usePWAInstall } from '@/utils/hooks/usePWAInstall'
import PWAInstallTip from '@/utils/components/shared/PWAInstallTip'

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
        <PWAInstallTip onClose={() => setShowTip(false)} />
      )}
    </div>
  )
}
