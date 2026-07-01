import type { Metadata } from 'next'

import RefundPolicyPage from '@sout/pages/RefundPolicy'

export const metadata: Metadata = {
  title: 'Política de Cambios y Devoluciones',
  description:
    'Conoce las condiciones de reembolso y devoluciones para cursos y servicios de SOUT Training Center.',
}

export default function Page() {
  return <RefundPolicyPage />
}
