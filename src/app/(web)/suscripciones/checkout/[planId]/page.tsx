import { notFound } from 'next/navigation'

import { SuscripcionCheckoutView } from '@/features/web/suscripciones/components/SuscripcionCheckoutView'
import type { PlanPublico } from '@/features/estudiante/suscripciones/entity/Suscripcion'
import prisma from '@/utils/libs/prisma'

async function getPlan(planId: string): Promise<PlanPublico | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/planes-suscripcion`, { cache: 'no-store' })

    if (!res.ok) return null

    const data = await res.json()
    const planes: PlanPublico[] = data?.result?.planes ?? []

    return planes.find(p => p.id === planId) ?? null
  } catch {
    return null
  }
}

async function getCulqiPublicKey(): Promise<string> {
  // Primero intenta desde la BD (igual que el checkout de cursos)
  try {
    const config = await prisma.configuracion.findUnique({ where: { clave: 'CULQI_PUBLIC_KEY' } })

    if (config?.valor) return config.valor
  } catch {}

  // Fallback al env
  return process.env.CULQI_PUBLIC_KEY ?? ''
}

export default async function SuscripcionCheckoutPage({ params }: { params: { planId: string } }) {
  const [plan, culqiPublicKey] = await Promise.all([
    getPlan(params.planId),
    getCulqiPublicKey()
  ])

  if (!plan) notFound()

  return <SuscripcionCheckoutView plan={plan} culqiPublicKey={culqiPublicKey} />
}

export async function generateMetadata({ params }: { params: { planId: string } }) {
  const plan = await getPlan(params.planId)

  return {
    title: plan ? `Suscribirse a ${plan.nombre}` : 'Checkout Suscripción',
  }
}
