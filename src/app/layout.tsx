import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { Providers } from '@/components/Providers'
import { getConfigs } from '@/utils/libs/config'
import { getAuthOptions } from '@/utils/configs/auth'

import './globals.css'
import '@assets/iconify-icons/generated-icons.css'

export async function generateMetadata(): Promise<Metadata> {
  const configs = await getConfigs()
  const title = configs.TEMPLATE_NAME || 'Aula Virtual'
  const slogan = configs.TEMPLATE_SLOGAN || ''
  const logo = configs.TEMPLATE_LOGO || '/favicon.ico'

  return {
    title: slogan ? `${title} - ${slogan}` : title,
    description: slogan,
    icons: {
      icon: logo
    }
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const configs = await getConfigs()
  const authOptions = await getAuthOptions()
  const session = await getServerSession(authOptions)

  // Inyectar variables CSS para los colores
  const primaryMain = configs.PRIMARY_COLOR_MAIN || '#131FF2'
  const primaryLight = configs.PRIMARY_COLOR_LIGHT || '#242CBF'
  const primaryDark = configs.PRIMARY_COLOR_DARK || '#9196F2'

  return (
    <html lang='es' suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-col' id="__next">
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-main: ${primaryMain};
              --primary-light: ${primaryLight};
              --primary-dark: ${primaryDark};
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
