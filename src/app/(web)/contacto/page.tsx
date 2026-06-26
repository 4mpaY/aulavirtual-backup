import type { Metadata } from 'next'

import ContactPage from '@sout/pages/Contact'

export const metadata: Metadata = {
  title: 'Contacto | Solicitar Cotización',
  description:
    'Contáctanos para obtener información sobre nuestras capacitaciones y solicitar una cotización personalizada. Atención inmediata vía WhatsApp.',
}

export default function Page() {
  return <ContactPage />
}
