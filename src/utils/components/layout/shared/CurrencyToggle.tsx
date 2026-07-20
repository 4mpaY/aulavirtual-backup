'use client'

import { useCurrency } from '@/contexts/CurrencyContext'

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div
      className="flex items-center rounded-full overflow-hidden"
      style={{ border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
    >
      <button
        onClick={() => setCurrency('USD')}
        className="border-0 cursor-pointer"
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.375rem 0.75rem',
          backgroundColor: currency === 'USD' ? 'var(--web-primary, #25927F)' : 'transparent',
          color: currency === 'USD' ? '#ffffff' : '#475569',
          transition: 'background-color 0.2s, color 0.2s',
        }}
      >
        $ Dólares
      </button>
      <button
        onClick={() => setCurrency('PEN')}
        className="border-0 cursor-pointer"
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.375rem 0.75rem',
          backgroundColor: currency === 'PEN' ? 'var(--web-primary, #25927F)' : 'transparent',
          color: currency === 'PEN' ? '#ffffff' : '#475569',
          transition: 'background-color 0.2s, color 0.2s',
        }}
      >
        Soles
      </button>
    </div>
  )
}
