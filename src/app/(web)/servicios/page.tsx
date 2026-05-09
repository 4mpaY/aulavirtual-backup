import type { Metadata } from 'next'

import ServiciosClient from './ServiciosClient'

export const metadata: Metadata = {
  title: 'Servicios - VISIONA',
  description: 'Consultoría ISO, Primera Respuesta, Academy, Activaciones BTL y Trabajos de Alto Riesgo. Soluciones integrales para tu organización.',
}

export default function ServiciosPage() {
  return <ServiciosClient />
}
