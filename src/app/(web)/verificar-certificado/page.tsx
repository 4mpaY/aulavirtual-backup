import React from 'react'

import type { Metadata } from 'next'

import SearchCertificateSection from '@/features/web/home/components/SearchCertificateSection'

export const metadata: Metadata = {
  title: 'Verificar Certificado | Visiona Perú',
  description: 'Verifique la autenticidad de su certificado emitido por Visiona Perú ingresando su código único.',
}

export default function VerificarCertificadoPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--web-dark, #025E44)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <SearchCertificateSection />
    </div>
  )
}
