import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

import { Box, Typography, Button } from '@mui/material'

import EbookViewerClient from '@/features/estudiante/mis-ebooks/components/EbookViewerClient'
import { getAuthSession } from '@/utils/libs/auth-helpers'
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
      <Box display='flex' alignItems='center' justifyContent='space-between' mb={2}>
        <Button
          component={Link}
          href='/estudiante/mis-ebooks'
          variant='text'
          startIcon={<i className='tabler-arrow-left' />}
          size='small'
        >
          Mis Ebooks
        </Button>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant='h6' fontWeight={700} lineHeight={1.2}>
            {ebook.titulo}
          </Typography>
          {ebook.autor && (
            <Typography variant='caption' color='text.secondary'>
              {ebook.autor}{ebook.paginas ? ` · ${ebook.paginas} páginas` : ''}
            </Typography>
          )}
        </Box>
      </Box>

      <EbookViewerClient ebookId={ebook.id} />
    </Box>
  )
}
