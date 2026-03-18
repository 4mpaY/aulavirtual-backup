// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'
import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@core/types'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Component Imports
import { Providers } from '@/components/Providers'

import { authOptions } from '@/utils/configs/auth'

export const metadata = {
  title: 'Aula Virtual - Sistema de gestión de cursos',
  description: 'Plataforma de gestión de cursos online con sistema de exámenes y certificados'
}

const RootLayout = async ({ children }: ChildrenType) => {
  // Vars
  const direction = 'ltr'
  const session = await getServerSession(authOptions)

  return (
    <html id='__next' lang='es' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
