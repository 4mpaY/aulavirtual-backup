import { redirect } from 'next/navigation'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { MisEbooksList } from '@/features/estudiante/mis-ebooks/components/MisEbooksList'
import prisma from '@/utils/libs/prisma'

export const metadata = {
  title: 'Mis Ebooks | Aula Virtual',
}

export default async function Page() {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  const accesos = await prisma.ebookAcceso.findMany({
    where: { usuario_id: session.user.id },
    orderBy: { creado_en: 'desc' },
    include: {
      ebook: {
        select: {
          id: true,
          titulo: true,
          slug: true,
          descripcion: true,
          autor: true,
          miniatura: true,
          paginas: true,
        },
      },
    },
  })

  const ebooks = accesos.map(a => a.ebook)

  return (
    <div>
      <MisEbooksList ebooks={ebooks} />
    </div>
  )
}
