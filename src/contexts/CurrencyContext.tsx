'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

import { useConfig } from '@/contexts/ConfigContext'

export type Currency = 'PEN' | 'USD'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const STORAGE_KEY = 'currency:v1'

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const configs = useConfig()
  const multiMonedaHabilitado = configs.WEB_MULTIMONEDA_HABILITADO === 'true'
  const [currency, setCurrencyState] = useState<Currency>('PEN')

  useEffect(() => {
    if (!multiMonedaHabilitado) return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved === 'PEN' || saved === 'USD') setCurrencyState(saved)
    } catch {
      // Safari private mode, quota exceeded, o localStorage deshabilitado
    }
  }, [multiMonedaHabilitado])

  const setCurrency = (next: Currency) => {
    if (!multiMonedaHabilitado) return

    setCurrencyState(next)

    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignorar
    }
  }

  const toggleCurrency = () => setCurrency(currency === 'PEN' ? 'USD' : 'PEN')

  const effectiveCurrency = multiMonedaHabilitado ? currency : 'PEN'

  return (
    <CurrencyContext.Provider value={{ currency: effectiveCurrency, setCurrency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)

  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }

  return context
}
