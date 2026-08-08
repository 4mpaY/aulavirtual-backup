import { notFound } from 'next/navigation'

import { Box } from '@mui/material'

import prisma from '@/utils/libs/prisma'
import RutaDetail from '@/features/web/rutas/components/RutaDetail'

export default async function RutaDetailPage({ params }: { params: { slug: string } }) {
  try {
    const ruta = await prisma.rutaAprendizaje.findFirst({
      where: {
        slug: params.slug,
        esta_activo: true
      },
      include: {
        cursos: {
          orderBy: { orden: 'asc' },
          include: {
            curso: {
              include: {
                _count: {
                  select: { modulos: true }
                }
              }
            }
          }
        }
      }
    })

    if (!ruta) notFound()

    const formattedCursos = ruta.cursos.map(rc => ({
      ...rc.curso,
      total_modulos: rc.curso._count.modulos,
      orden: rc.orden,
      seccion_id: rc.seccion_id
    }))

    // Serializar Decimal a Number para Client Components
    const serializedRuta = {
      ...ruta,
      cursos: formattedCursos.map((c: any) => ({
        ...c,
        precio: c.precio ? Number(c.precio) : 0,
        precio_oferta: c.precio_oferta ? Number(c.precio_oferta) : null
      }))
    }

    return (
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <RutaDetail ruta={serializedRuta as any} />
      </Box>
    )
  } catch (error) {
    console.error('Error fetching Ruta:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const ruta = await prisma.rutaAprendizaje.findFirst({
      where: {
        slug: params.slug,
        esta_activo: true
      },
      select: {
        titulo: true,
        descripcion: true
      }
    })

    if (!ruta) return { title: 'Ruta no encontrada' }

    return {
      title: `${ruta.titulo} | Aula Virtual`,
      description: ruta.descripcion || 'Detalles de la ruta de aprendizaje en nuestra plataforma EdTech.'
    }
  } catch {
    return { title: 'Ruta no encontrada' }
  }
}
