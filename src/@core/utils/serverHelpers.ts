import 'server-only'

// Next Imports
import { cookies, headers } from 'next/headers'

// Type Imports
import type { Settings } from '@core/contexts/settingsContext'
import type { DemoName, SystemMode, Mode } from '@core/types'

// Config Imports
import primaryColorConfig from '@/utils/configs/primaryColorConfig'
import themeConfig from '@/utils/configs/themeConfig'

export const getDemoName = async (): Promise<DemoName | null> => {
  const headersList = await headers()

  return headersList.get('X-server-header') as DemoName | null
}

export const getSettingsFromCookie = async (): Promise<Settings> => {
  const cookieStore = await cookies()
  const demoName = await getDemoName()

  const cookieName = demoName
    ? themeConfig.settingsCookieName.replace('demo-1', demoName)
    : themeConfig.settingsCookieName

  const cookieValue = JSON.parse(cookieStore.get(cookieName)?.value || '{}')

  // Retornar combinando con valores por defecto mínimos necesarios
  return {
    ...cookieValue,
    mode: 'light',
    primaryColor: primaryColorConfig[0].main // Siempre usar el color configurado, ignorar el cookie
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

export const getSkin = async () => {
  const settingsCookie = await getSettingsFromCookie()

  return settingsCookie.skin || 'default'
}
