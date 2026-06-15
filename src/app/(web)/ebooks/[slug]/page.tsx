export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'

import { Box } from '@mui/material'

import prisma from '@/utils/libs/prisma'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import EbookDetail from '@/features/web/ebooks/components/EbookDetail'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const ebook = await prisma.ebook.findFirst({
    where: { OR: [{ id: params.slug }, { slug: params.slug }], estado: 'PUBLICADO' },
    select: { titulo: true, descripcion: true },
  })

  return ebook
    ? { title: `${ebook.titulo} | Ebooks`, description: ebook.descripcion ?? undefined }
    : { title: 'Ebook | Abeja Smart' }
}

export default async function EbookDetailPage({ params }: Props) {
  notFound()
  const ebook = await prisma.ebook.findFirst({
    where: { OR: [{ id: params.slug }, { slug: params.slug }], estado: 'PUBLICADO' },
    select: {
      id: true, titulo: true, slug: true, descripcion: true,
      autor: true, miniatura: true, precio: true, precio_falso: true,
      moneda: true, es_gratis: true, paginas: true, genero: true,
      categoria: { select: { nombre: true } },
      _count: { select: { accesos: true } },
    },
  })

  if (!ebook) notFound()

  const session = await getAuthSession()

  let tieneAcceso = false

  if (session?.user?.id) {
    const acceso = await prisma.ebookAcceso.findUnique({
      where: { usuario_id_ebook_id: { usuario_id: session.user.id, ebook_id: ebook.id } },
    })

    tieneAcceso = !!acceso
  }

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      <EbookDetail
        ebook={{
          ...ebook,
          precio: Number(ebook.precio),
          precio_falso: Number(ebook.precio_falso),
          tieneAcceso,
        }}
      />
    </Box>
  )
}
