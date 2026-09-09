import { notFound, redirect } from 'next/navigation'

import prisma from '@/utils/libs/prisma'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import CheckoutView from '@/features/web/checkout/components/CheckoutView'

export async function generateMetadata() {
  return {
    title: 'Checkout - Comprar Ebook | Aula Virtual',
    description: 'Finaliza tu compra y accede a tu ebook.',
  }
}

export default async function CheckoutEbookPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const ebook = await prisma.ebook.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }], estado: 'PUBLICADO' },
    select: { id: true, titulo: true, slug: true, miniatura: true, precio: true, moneda: true, es_gratis: true },
  })

  if (!ebook) notFound()

  if (ebook.es_gratis || Number(ebook.precio) === 0) {
    redirect(`/ebooks/${ebook.slug}`)
  }

  const session = await getAuthSession()

  if (session?.user?.id) {
    const acceso = await prisma.ebookAcceso.findUnique({
      where: { usuario_id_ebook_id: { usuario_id: session.user.id, ebook_id: ebook.id } },
    })

    if (acceso) redirect(`/estudiante/mis-ebooks/${ebook.id}`)
  }

  return (
    <CheckoutView
      courses={[]}
      ebooks={[{
        id: ebook.id,
        titulo: ebook.titulo,
        slug: ebook.slug,
        miniatura: ebook.miniatura ?? undefined,
        precio: Number(ebook.precio),
        moneda: ebook.moneda,
      }]}
    />
  )
}
