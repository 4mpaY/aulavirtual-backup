import { notFound } from 'next/navigation'

import { Box } from '@mui/material'

import { AxiosRuta } from '@/features/web/rutas/http/axiosRuta'
import RutaDetail from '@/features/web/rutas/components/RutaDetail'

const axiosRuta = new AxiosRuta()

export default async function RutaDetailPage({ params }: { params: { slug: string } }) {
  notFound()
  try {
    const ruta = await axiosRuta.getBySlug(params.slug)

    if (!ruta) notFound()

    // Serializar Decimal a Number para Client Components
    const serializedRuta = {
      ...ruta,
      cursos: ruta.cursos.map((c: any) => ({
        ...c,
        precio: c.precio ? Number(c.precio) : 0,
        precio_oferta: c.precio_oferta ? Number(c.precio_oferta) : null
      }))
    }

    return (
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
        <RutaDetail ruta={serializedRuta} />
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
      title: `${ruta.titulo} | Abeja Smart`,
      description: ruta.descripcion || 'Detalles de la ruta de aprendizaje en nuestra plataforma EdTech.'
    }
  } catch {
    return { title: 'Ruta no encontrada' }
  }
}
