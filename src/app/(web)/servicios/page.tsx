import type { Metadata } from 'next'

import ServicesPage from '@sout/pages/Services'

export const metadata: Metadata = {
  title: 'Servicios de Capacitación y Seguridad Vial',
  description:
    'Programas especializados en manejo defensivo, seguridad vial, primeros auxilios y prevención de incendios. Certificación NSC y estándares internacionales.',
}

export default function Page() {
  return <ServicesPage />
}
