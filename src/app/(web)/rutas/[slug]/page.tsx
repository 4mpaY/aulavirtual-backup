import { notFound } from 'next/navigation'

import { Box } from '@mui/material'

import { AxiosRuta } from '@/features/web/rutas/http/axiosRuta'
import RutaDetail from '@/features/web/rutas/components/RutaDetail'

const axiosRuta = new AxiosRuta()

export default async function RutaDetailPage({ params }: { params: { slug: string } }) {
  try {
    const ruta = await axiosRuta.getBySlug(params.slug)

    if (!ruta) notFound()

    return (
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <RutaDetail ruta={ruta} />
      </Box>
    )
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const ruta = await axiosRuta.getBySlug(params.slug)

    if (!ruta) return { title: 'Ruta no encontrada' }

    return {
      title: `${ruta.titulo} | Aula Virtual`,
      description: ruta.descripcion || 'Detalles de la ruta de aprendizaje en nuestra plataforma EdTech.'
    }
  } catch {
    return { title: 'Ruta no encontrada' }
  }
}
