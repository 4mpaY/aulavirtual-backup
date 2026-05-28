import { notFound } from 'next/navigation'

import CompaniesSection from '@/features/web/home/components/CompaniesSection'
import EnterpriseCTASection from '@/features/web/home/components/EnterpriseCTASection'
import PageHeader from '@/utils/components/layout/web/PageHeader'
import { getConfig } from '@/utils/libs/config'

export const metadata = {
  title: 'Soluciones para Empresas - SSMAT',
  description: 'Soluciones integrales de salud ocupacional y seguridad para empresas. Protege a tu equipo con SSMAT.',
}

export default async function EmpresasPage() {
  const habilitado = await getConfig('WEB_EMPRESAS_HABILITADO', 'true')

  if (habilitado !== 'true') notFound()

  return (
    <>
      <PageHeader
        label="Para Empresas"
        title="Soluciones Corporativas"
        description="Diseñamos programas integrales de salud ocupacional y seguridad adaptados a las necesidades de tu empresa y tus trabajadores."
        ctaText="Solicitar propuesta"
        ctaHref="/contacto"
        imageSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
      />
      <CompaniesSection />
      <EnterpriseCTASection />
    </>
  )
}
