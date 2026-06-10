'use client'

import Link from 'next/link'

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material'

interface MiEbook {
  id: string
  titulo: string
  slug: string
  descripcion?: string | null
  autor?: string | null
  miniatura?: string | null
  paginas?: number | null
}

interface Props {
  ebooks: MiEbook[]
}

export const MisEbooksList = ({ ebooks }: Props) => {
  if (ebooks.length === 0) {
    return (
      <Box textAlign='center' py={10}>
        <i className='tabler-books text-6xl text-textDisabled' />
        <Typography variant='h6' color='text.secondary' mt={2}>
          Aún no tienes ebooks
        </Typography>
        <Typography variant='body2' color='text.disabled' mt={1}>
          Explora el catálogo y adquiere tus primeros ebooks.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={4}>
      {ebooks.map(ebook => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={ebook.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea
              component={Link}
              href={`/estudiante/mis-ebooks/${ebook.id}`}
              sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
              <CardMedia
                component='img'
                height={160}
                image={ebook.miniatura ?? '/images/ebook-placeholder.png'}
                alt={ebook.titulo}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant='subtitle2' fontWeight={700} mb={0.5} noWrap>
                  {ebook.titulo}
                </Typography>
                {ebook.autor && (
                  <Typography variant='caption' color='text.secondary' display='block' mb={0.5}>
                    {ebook.autor}
                  </Typography>
                )}
                {ebook.paginas && (
                  <Typography variant='caption' color='text.disabled' display='block'>
                    {ebook.paginas} páginas
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
