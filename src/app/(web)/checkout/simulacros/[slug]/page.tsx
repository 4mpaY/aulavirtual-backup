import { notFound, redirect } from 'next/navigation'
import prisma from '@/utils/libs/prisma'
import SimulacroCheckoutView from '@/features/web/checkout/components/SimulacroCheckoutView'

async function getSimulacroData(slug: string) {
  try {
    const rows: any[] = await prisma.$queryRaw`
      SELECT id, titulo, slug, miniatura, precio, moneda, nivel, es_gratis, estado
      FROM "Simulacro" WHERE slug = ${slug} LIMIT 1`
    return rows[0] ?? null
  } catch {
    return null
  }
}

export default async function CheckoutSimulacroPage({ params }: { params: { slug: string } }) {
  const simulacro = await getSimulacroData(params.slug)

  if (!simulacro) notFound()

  if (simulacro.estado !== 'PUBLICADO') {
    redirect(`/simulacros/${params.slug}`)
  }

  if (simulacro.es_gratis || Number(simulacro.precio) === 0) {
    redirect(`/simulacros/${params.slug}`)
  }

  return (
    <SimulacroCheckoutView
      simulacro={{
        id: simulacro.id,
        titulo: simulacro.titulo,
        slug: simulacro.slug,
        miniatura: simulacro.miniatura,
        precio: Number(simulacro.precio),
        moneda: simulacro.moneda,
        nivel: simulacro.nivel,
      }}
    />
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `Comprar Simulacro | Aula Virtual`,
    description: 'Adquiere acceso al simulacro y pon a prueba tus conocimientos.'
  }
}
