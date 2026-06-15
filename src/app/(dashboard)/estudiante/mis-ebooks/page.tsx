import { redirect, notFound } from 'next/navigation'

import { Box, Button, Container, Stack, Typography } from '@mui/material'

import { getAuthSession } from '@/utils/libs/auth-helpers'
import { MisEbooksList } from '@/features/estudiante/mis-ebooks/components/MisEbooksList'
import prisma from '@/utils/libs/prisma'

export const metadata = {
  title: 'Mis Ebooks | Abeja Smart',
}

export default async function Page() {
  notFound()
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
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 8, lg: 12 } }}>
        <Stack spacing={{ xs: 3, md: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, color: 'text.primary' }}>
                Mis <span style={{ color: 'var(--mui-palette-primary-main)' }}>Ebooks</span>
              </Typography>
              <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500 }}>
                Accede a todos los ebooks que has adquirido y disfruta tu lectura.
              </Typography>
            </Box>
            <Button
              variant='contained'
              color='primary'
              size='medium'
              sx={{ borderRadius: '10px' }}
              startIcon={<i className='tabler-search' />}
              href='/ebooks'
            >
              Explorar Ebooks
            </Button>
          </Box>

          <MisEbooksList ebooks={ebooks} />
        </Stack>
      </Container>
    </Box>
  )
}
