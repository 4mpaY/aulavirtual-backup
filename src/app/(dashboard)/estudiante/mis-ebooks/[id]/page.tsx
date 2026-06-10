import { redirect, notFound } from 'next/navigation'

import { Box, Typography, Button } from '@mui/material'
import Link from 'next/link'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { EbookViewer } from '@/features/estudiante/mis-ebooks/components/EbookViewer'
import prisma from '@/utils/libs/prisma'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const ebook = await prisma.ebook.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    select: { titulo: true },
  })

  return { title: ebook ? `${ebook.titulo} | Mis Ebooks` : 'Ebook | Aula Virtual' }
}

export default async function Page({ params }: Props) {
  const session = await getAuthSession()

  if (!session) redirect('/login')

  const ebook = await prisma.ebook.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }], estado: 'PUBLICADO' },
    select: { id: true, titulo: true, autor: true, paginas: true },
  })

  if (!ebook) notFound()

  const acceso = await prisma.ebookAcceso.findUnique({
    where: { usuario_id_ebook_id: { usuario_id: session.user.id, ebook_id: ebook.id } },
  })

  if (!acceso) redirect('/estudiante/mis-ebooks')

  return (
    <Box>
      <Box display='flex' alignItems='center' gap={2} mb={3}>
        <Button
          component={Link}
          href='/estudiante/mis-ebooks'
          variant='text'
          startIcon={<i className='tabler-arrow-left' />}
          size='small'
        >
          Mis Ebooks
        </Button>
      </Box>

      <Typography variant='h5' fontWeight={700} mb={0.5}>
        {ebook.titulo}
      </Typography>
      {ebook.autor && (
        <Typography variant='body2' color='text.secondary' mb={3}>
          {ebook.autor} {ebook.paginas ? `· ${ebook.paginas} páginas` : ''}
        </Typography>
      )}

      <EbookViewer ebookId={ebook.id} />
    </Box>
  )
}
