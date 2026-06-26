import type { Metadata } from 'next'

import '@sout/styles/sout.css'

import SouProviders from '@sout/components/SouProviders'

export const metadata: Metadata = {
  title: {
    default: 'SOUT Training Center',
    template: '%s | SOUT Training Center',
  },
  description:
    'Centro de capacitación líder en manejo defensivo NSC, seguridad vial, primeros auxilios y prevención de riesgos para minería, industria y transporte en Perú.',
}

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <SouProviders>
      <div id="sout-web">{children}</div>
    </SouProviders>
  )
}
