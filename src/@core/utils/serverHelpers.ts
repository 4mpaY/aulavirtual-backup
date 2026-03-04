import 'server-only'

// Next Imports
import { cookies, headers } from 'next/headers'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { DemoName, SystemMode, Mode } from '@core/types'

// Config Imports
import themeConfig from '@/utils/configs/themeConfig'

export const getDemoName = (): DemoName => {
  const headersList = headers()

  return headersList.get('X-server-header') as DemoName | null
}

export const getSettingsFromCookie = (): Settings => {
  const cookieStore = cookies()
  const demoName = getDemoName()
  const cookieName = demoName
    ? themeConfig.settingsCookieName.replace('demo-1', demoName)
    : themeConfig.settingsCookieName

  const cookieValue = JSON.parse(cookieStore.get(cookieName)?.value || '{}')

  // Retornar combinando con valores por defecto mínimos necesarios
  return {
    ...cookieValue,
    mode: 'light',
    primaryColor: cookieValue.primaryColor || '#7367F0' // Fallback al color primario por defecto
  }
}

export const getMode = (): Mode => {
  return 'light'
}

export const getSystemMode = (): SystemMode => {
  return 'light'
}

export const getServerMode = () => {
  const mode = getMode()
  const systemMode = getSystemMode()

  return mode === 'system' ? systemMode : mode
}

export const getSkin = () => {
  const settingsCookie = getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}
