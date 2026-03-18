// Next Imports
import React from 'react'

import { notFound } from 'next/navigation'

import { Box } from '@mui/material'

// Component Imports
import RutaDetail from '@/features/web/rutas/components/RutaDetail'

// Lib Imports
import prisma from '@/utils/libs/prisma'

// Server Action / Data Fetching
async function getRutaData(slug: string) {
  try {
    const ruta = await prisma.rutaAprendizaje.findFirst({
      where: {
        slug: { equals: slug, mode: 'insensitive' },
        esta_activo: true
      },
      include: {
        cursos: {
          orderBy: { orden: 'asc' },
          include: {
            curso: {
              select: {
                id: true,
                titulo: true,
                slug: true,
                miniatura: true,
                descripcion: true,
                precio: true,
                precio_oferta: true
              }
            }
          }
        }
      }
    })

    if (!ruta) return null

    const formattedCursos = (ruta as any).cursos.map((rc: any) => ({
      ...rc.curso,
      orden: rc.orden,
      seccion_id: rc.seccion_id
    }))

    return JSON.parse(JSON.stringify({
      ...ruta,
      cursos: formattedCursos
    }))
  } catch (error) {
    console.error('Error fetching ruta data:', error)

    return null
  }
}

export default async function RutaDetailPage({ params }: { params: { slug: string } }) {
  const ruta = await getRutaData(params.slug)

  if (!ruta) {
    notFound()
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      <RutaDetail ruta={ruta} />
    </Box>
  )
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const ruta = await getRutaData(params.slug)

  if (!ruta) return { title: 'Ruta no encontrada' }

  return {
    title: `${ruta.titulo} | Aula Virtual`,
    description: ruta.descripcion || 'Detalles de la ruta de aprendizaje en nuestra plataforma EdTech.'
  }
}
