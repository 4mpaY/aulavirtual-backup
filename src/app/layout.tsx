import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { Providers } from '@/components/Providers'
import { getConfigs } from '@/utils/libs/config'
import { resolveFaviconUrl } from '@/utils/functions/syncFavicon'
import { getAuthOptions } from '@/utils/configs/auth'
import { plus_jakarta_sans } from '@core/theme'

import 'react-perfect-scrollbar/dist/css/styles.css'
import './globals.css'
import '@assets/iconify-icons/generated-icons.css'

export async function generateMetadata(): Promise<Metadata> {
  const configs = await getConfigs()
  const title = configs.TEMPLATE_NAME || 'Aula Virtual'
  const slogan = configs.TEMPLATE_SLOGAN || ''
  const logo = resolveFaviconUrl(configs)

  return {
    title: {
      default: slogan ? `${title} - ${slogan}` : title,
      template: `%s | ${title}`
    },
    description: slogan,
    manifest: '/manifest.json',
    icons: {
      icon: logo,
      shortcut: logo,
      apple: '/icons/apple-touch-icon.png',
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title,
    },
  }
}

function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) || 0
  const g = parseInt(clean.slice(2, 4), 16) || 0
  const b = parseInt(clean.slice(4, 6), 16) || 0

  return `${r}, ${g}, ${b}`
}

function darkenHex(hex: string, factor: number): string {
  const clean = hex.replace('#', '')
  const r = Math.round((parseInt(clean.slice(0, 2), 16) || 0) * factor)
  const g = Math.round((parseInt(clean.slice(2, 4), 16) || 0) * factor)
  const b = Math.round((parseInt(clean.slice(4, 6), 16) || 0) * factor)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const configs = await getConfigs()
  const authOptions = await getAuthOptions()
  const session = await getServerSession(authOptions)

  // Colores MUI admin
  const primaryMain = configs.PRIMARY_COLOR_MAIN || '#131FF2'
  const primaryLight = configs.PRIMARY_COLOR_LIGHT || '#242CBF'
  const primaryDark = configs.PRIMARY_COLOR_DARK || '#9196F2'

  // Colores web (con fallback al design system teal)
  const webPrimary = configs.PRIMARY_COLOR_MAIN || '#25927F'
  const webLight = configs.PRIMARY_COLOR_LIGHT || '#BDD962'
  const webDark = configs.PRIMARY_COLOR_DARK || '#025E44'
  const webDarkDeep = darkenHex(webDark, 0.45)  // muy oscuro → reemplaza #012d22
  const webDarkMid = darkenHex(webDark, 0.72)  // oscuro medio → reemplaza #0f4438

  return (
    <html lang='es' suppressHydrationWarning className={`${plus_jakarta_sans.variable} ${plus_jakarta_sans.className}`}>
      <head>
        {/* Favicon estático de respaldo — garantiza que siempre se muestre public/favicon.ico */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className='flex is-full min-bs-full flex-col' id="__next">
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-main: ${primaryMain};
              --primary-light: ${primaryLight};
              --primary-dark: ${primaryDark};
              --web-primary:     ${webPrimary};
              --web-primary-rgb: ${hexToRgb(webPrimary)};
              --web-light:       ${webLight};
              --web-light-rgb:   ${hexToRgb(webLight)};
              --web-dark:        ${webDark};
              --web-dark-rgb:    ${hexToRgb(webDark)};
              --web-dark-deep:   ${webDarkDeep};
              --web-dark-mid:    ${webDarkMid};
            }
          `
        }} />
        <Providers session={session} configs={configs}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
