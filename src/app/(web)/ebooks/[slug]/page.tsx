export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'

import { Box, Container, Grid, Typography, Button, Chip, Divider, Paper } from '@mui/material'
import Link from 'next/link'

import prisma from '@/utils/libs/prisma'
import { ObtenerEbookGratisButton } from '@/features/web/ebooks/components/ObtenerEbookGratisButton'
import { getAuthSession } from '@/utils/libs/auth-helpers'

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
    : { title: 'Ebook | Aula Virtual' }
}

export default async function EbookDetailPage({ params }: Props) {
  const ebook = await prisma.ebook.findFirst({
    where: { OR: [{ id: params.slug }, { slug: params.slug }], estado: 'PUBLICADO' },
    select: {
      id: true, titulo: true, slug: true, descripcion: true,
      autor: true, miniatura: true, precio: true, precio_falso: true,
      moneda: true, es_gratis: true, paginas: true,
      _count: { select: { accesos: true } },
    },
  })

  if (!ebook) notFound()

  const precio = Number(ebook.precio)
  const precioFalso = Number(ebook.precio_falso)

  const session = await getAuthSession()

  let tieneAcceso = false

  if (session) {
    const acceso = await prisma.ebookAcceso.findUnique({
      where: { usuario_id_ebook_id: { usuario_id: session.user.id, ebook_id: ebook.id } },
    })

    tieneAcceso = !!acceso
  }

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth='lg'>
        <Grid container spacing={6}>
          <Grid item xs={12} md={8}>
            <Typography variant='h3' fontWeight={800} mb={1}>
              {ebook.titulo}
            </Typography>
            {ebook.autor && (
              <Typography variant='body1' color='text.secondary' mb={3}>
                Por {ebook.autor}
              </Typography>
            )}
            <Divider sx={{ my: 3 }} />
            {ebook.descripcion && (
              <Typography variant='body1' color='text.secondary' sx={{ whiteSpace: 'pre-line' }}>
                {ebook.descripcion}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant='outlined' sx={{ p: 4, borderRadius: 3, position: 'sticky', top: 80 }}>
              {ebook.miniatura && (
                <Box
                  component='img'
                  src={ebook.miniatura}
                  alt={ebook.titulo}
                  sx={{ width: '100%', borderRadius: 2, mb: 3, objectFit: 'cover', maxHeight: 260 }}
                />
              )}

              {ebook.paginas && (
                <Typography variant='body2' color='text.secondary' mb={2}>
                  <i className='tabler-file-text' /> {ebook.paginas} páginas
                </Typography>
              )}

              {!ebook.es_gratis && precioFalso > 0 && (
                <Typography variant='body2' color='text.disabled' sx={{ textDecoration: 'line-through' }}>
                  {ebook.moneda} {precioFalso.toFixed(2)}
                </Typography>
              )}

              <Typography variant='h4' fontWeight={800} color={ebook.es_gratis ? 'success.main' : 'primary'} mb={3}>
                {ebook.es_gratis ? 'Gratis' : `${ebook.moneda} ${precio.toFixed(2)}`}
              </Typography>

              {tieneAcceso ? (
                <Button
                  variant='contained'
                  color='success'
                  fullWidth
                  size='large'
                  component={Link}
                  href={`/estudiante/mis-ebooks/${ebook.id}`}
                  startIcon={<i className='tabler-book-open' />}
                >
                  Leer Ebook
                </Button>
              ) : !session ? (
                <Button variant='contained' fullWidth size='large' component={Link} href='/login'>
                  Iniciar sesión para obtener
                </Button>
              ) : ebook.es_gratis ? (
                <ObtenerEbookGratisButton ebookId={ebook.id} />
              ) : (
                <Button variant='contained' fullWidth size='large' disabled>
                  Próximamente — compra disponible
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
