import { notFound } from 'next/navigation'
import prisma from '@/utils/libs/prisma'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import SimulacroDetailView from '@/features/web/simulacros/components/SimulacroDetailView'

async function getData(slug: string, userId?: string) {
  const simulacro = await prisma.simulacro.findUnique({ where: { slug } })
  if (!simulacro || simulacro.estado !== 'PUBLICADO') return null

  // Verificar si el usuario tiene acceso
  let tieneAcceso = simulacro.es_gratis // gratis = acceso libre

  if (!tieneAcceso && userId) {
    const inscripcion: any[] = await prisma.$queryRaw`
      SELECT id FROM inscripciones_simulacro
      WHERE usuario_id = ${userId}
        AND simulacro_id = ${simulacro.id}
        AND estado = 'ACTIVO'
      LIMIT 1
    `
    tieneAcceso = inscripcion.length > 0
  }

  // Cargar preguntas solo si tiene acceso (no exponer al frontend si no pagó)
  let preguntas: any[] = []
  if (tieneAcceso) {
    const rows: any[] = await prisma.$queryRaw`
      SELECT id, enunciado, tema, fundamento, audio_url, imagen_url, orden
      FROM "PreguntaSimulacro"
      WHERE simulacro_id = ${simulacro.id}
      ORDER BY RANDOM()
    `

    // Seleccionar N preguntas aleatorias del pool (numero_preguntas del simulacro)
    const pool = simulacro.numero_preguntas > 0 && simulacro.numero_preguntas < rows.length
      ? rows.slice(0, simulacro.numero_preguntas)
      : rows

    preguntas = await Promise.all(
      pool.map(async (pq: any) => {
        const opciones: any[] = await prisma.$queryRaw`
          SELECT id, texto, es_correcta, orden
          FROM "OpcionPreguntaSimulacro"
          WHERE pregunta_id = ${pq.id}
          ORDER BY RANDOM()
        `
        return { ...pq, opciones }
      })
    )
  }

  return { simulacro, preguntas, tieneAcceso }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug)
  if (!data) return { title: 'Simulacro no encontrado' }
  return {
    title: `${data.simulacro.titulo} | ATD Academy`,
    description: data.simulacro.descripcion ?? 'Simulacro de examen en ATD Academy.',
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await getAuthSession()
  const userId = session?.user?.id ?? undefined

  const data = await getData(params.slug, userId)
  if (!data) notFound()

  return (
    <SimulacroDetailView
      simulacro={data.simulacro as any}
      preguntas={data.preguntas}
      tieneAcceso={data.tieneAcceso}
      estaAutenticado={!!session}
    />
  )
}
