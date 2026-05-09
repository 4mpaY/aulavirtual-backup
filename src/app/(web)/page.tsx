import type { Metadata } from 'next'

import HomePageClient from './HomePageClient'
import SearchCertificateSection from '@/features/web/home/components/SearchCertificateSection'

export const metadata: Metadata = {
  title: 'VISIONA - Consultoría, Seguridad y Formación',
  description: 'Impulsamos organizaciones hacia la excelencia operativa. Consultoría ISO, Primera Respuesta, Academy, Activaciones BTL y Trabajos de Alto Riesgo.',
}

export default function HomePage() {
  return (
    <>
      <HomePageClient />
      <SearchCertificateSection />
    </>
  )
}
