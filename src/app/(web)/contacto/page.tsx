import type { Metadata } from 'next'

import ContactoClient from './ContactoClient'

export const metadata: Metadata = {
  title: 'Contacto - VISIONA',
  description: 'Contáctanos y generemos impacto real en tu organización. Consultoría, seguridad y formación a nivel nacional.',
}

export default function ContactoPage() {
  return <ContactoClient />
}
