import React from 'react'

import type { Metadata } from 'next'

import SearchCertificateSection from '@/features/web/home/components/SearchCertificateSection'
import PageHeader from '@/utils/components/layout/web/PageHeader'

export const metadata: Metadata = {
  title: 'Verificar Certificado - SSMAT',
  description: 'Verifique la autenticidad de su certificado emitido por SSMAT ingresando su código único.',
}

export default function VerificarCertificadoPage() {
  return (
    <>
      <PageHeader
        label="Certificaciones"
        title="Verificar Certificado"
        description="Ingresa el código único de tu certificado para comprobar su autenticidad."
        imageSrc="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
      />
      <SearchCertificateSection />
    </>
  )
}
