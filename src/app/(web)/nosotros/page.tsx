import type { Metadata } from 'next'

import AboutPage from '@sout/pages/About'

export const metadata: Metadata = {
  title: 'Quiénes Somos | Experiencia y Liderazgo',
  description:
    'Más de 10 años formando conductores y operadores responsables, seguros y eficientes para el sector minero e industrial. Centro certificado NSC.',
}

export default function Page() {
  return <AboutPage />
}
