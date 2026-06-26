import type { Metadata } from 'next'

import TermsOfUsePage from '@sout/pages/TermsOfUse'

export const metadata: Metadata = {
  title: 'Términos de Uso | Condiciones del Servicio',
  description:
    'Lee nuestros términos y condiciones de uso. Al acceder a SOUT Training Center, aceptas cumplir con nuestras políticas y regulaciones vigentes.',
}

export default function Page() {
  return <TermsOfUsePage />
}
