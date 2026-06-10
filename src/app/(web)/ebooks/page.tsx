export const dynamic = 'force-dynamic'

import { Box, Container, Grid, Typography, Card, CardActionArea, CardContent, CardMedia, Chip } from '@mui/material'
import Link from 'next/link'

import prisma from '@/utils/libs/prisma'

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Ebooks`,
}

export default async function EbooksPage() {
  const ebooks = await prisma.ebook.findMany({
    where: { estado: 'PUBLICADO' },
    orderBy: { creado_en: 'desc' },
    select: {
      id: true, titulo: true, slug: true, descripcion: true,
      autor: true, miniatura: true, precio: true, precio_falso: true,
      moneda: true, es_gratis: true, paginas: true,
    },
  })

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth='xl'>
        <Typography variant='h3' fontWeight={800} mb={1} textAlign='center'>
          Catálogo de Ebooks
        </Typography>
        <Typography variant='body1' color='text.secondary' textAlign='center' mb={6}>
          Amplía tu conocimiento con nuestra colección de ebooks especializados.
        </Typography>

        {ebooks.length === 0 ? (
          <Box textAlign='center' py={10}>
            <Typography variant='h6' color='text.secondary'>
              No hay ebooks disponibles por el momento.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {ebooks.map(ebook => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={ebook.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea
                    component={Link}
                    href={`/ebooks/${ebook.slug}`}
                    sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <CardMedia
                      component='img'
                      height={180}
                      image={ebook.miniatura ?? '/images/ebook-placeholder.png'}
                      alt={ebook.titulo}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant='subtitle1' fontWeight={700} mb={0.5} noWrap>
                        {ebook.titulo}
                      </Typography>
                      {ebook.autor && (
                        <Typography variant='caption' color='text.secondary' display='block' mb={1}>
                          {ebook.autor}
                        </Typography>
                      )}
                      {ebook.descripcion && (
                        <Typography
                          variant='body2'
                          color='text.secondary'
                          mb={1}
                          sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                        >
                          {ebook.descripcion}
                        </Typography>
                      )}
                      <Box display='flex' alignItems='center' justifyContent='space-between' mt={1} flexWrap='wrap' gap={1}>
                        {ebook.es_gratis ? (
                          <Chip label='Gratis' color='success' size='small' />
                        ) : (
                          <Typography variant='subtitle2' fontWeight={700} color='primary'>
                            {ebook.moneda} {Number(ebook.precio).toFixed(2)}
                          </Typography>
                        )}
                        {ebook.paginas && (
                          <Typography variant='caption' color='text.disabled'>
                            {ebook.paginas} págs.
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
