import { notFound } from 'next/navigation'
import { getSimulacroBySlug } from '@/features/web/simulacros/http/axiosWebSimulacros'
import SimulacroDetailView from '@/features/web/simulacros/components/SimulacroDetailView'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const simulacro = await getSimulacroBySlug(params.slug)
  if (!simulacro) return { title: 'Simulacro no encontrado' }
  return {
    title: `${simulacro.titulo} | ATD Academy`,
    description: simulacro.descripcion ?? 'Simulacro de examen en ATD Academy.',
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const simulacro = await getSimulacroBySlug(params.slug)
  if (!simulacro || simulacro.estado !== 'PUBLICADO') notFound()
  return <SimulacroDetailView simulacro={simulacro} />
}
