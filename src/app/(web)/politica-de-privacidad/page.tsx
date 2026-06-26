import type { Metadata } from 'next'

import PrivacyPolicyPage from '@sout/pages/PrivacyPolicy'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Seguridad de Datos',
  description:
    'Conoce nuestra política de privacidad. En SOUT Training Center valoramos y protegemos tu información personal.',
}

export default function Page() {
  return <PrivacyPolicyPage />
}
