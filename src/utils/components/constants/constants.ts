import type { Theme } from '@mui/material'

export const THEMES = { LIGHT: 'light', DARK: 'dark' }

export type themeSettingsTypes = {
  activeLayout?: string
  theme: string
  direction: 'ltr' | 'rtl'
  responsiveFontSizes?: boolean
}

export const lightTheme = (theme: Theme) => theme.palette.mode === 'light'

export const secondarySideBarGap = 80
export const secondarySideBarWidth = 215

export const initialThemeSettings: themeSettingsTypes = {
  direction: 'ltr',
  theme: THEMES.LIGHT,
  activeLayout: 'layout1',
  responsiveFontSizes: true
}
