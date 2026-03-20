'use client'

import type { ReactNode } from 'react';
import React, { createContext, useContext } from 'react'

interface ConfigContextType {
  configs: Record<string, string>
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children, configs }: { children: ReactNode, configs: Record<string, string> }) {
  return (
    <ConfigContext.Provider value={{ configs }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)

  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }


  return context.configs
}
