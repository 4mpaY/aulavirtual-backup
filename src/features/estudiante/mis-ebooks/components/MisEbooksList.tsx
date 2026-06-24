'use client'

import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'

import CustomTextField from '@core/components/mui/TextField'

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

const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
}))

function EbookCard({ ebook }: { ebook: MiEbook }) {
  const router = useRouter()

  return (
    <StyledCard onClick={() => router.push(`/estudiante/mis-ebooks/${ebook.id}`)}>
      {/* Portada */}
      <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '2/3', bgcolor: '#f1f5f9', flexShrink: 0 }}>
        {ebook.miniatura ? (
          <Box
            component='img'
            src={ebook.miniatura}
            alt={ebook.titulo}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#94a3b8' }}>
            <i className='tabler-book' style={{ fontSize: '2.5rem' }} />
            <Typography variant='caption' color='text.disabled'>Sin portada</Typography>
          </Box>
        )}

        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Chip
            icon={<i className='tabler-circle-check-filled' style={{ fontSize: '1.1rem', color: 'white' }} />}
            label='ADQUIRIDO'
            sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 800, borderRadius: '12px', height: '28px', pl: 0.5, pr: 1, boxShadow: '0 4px 14px rgba(16,185,129,0.4)', fontSize: '0.65rem' }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 800, lineHeight: 1.2, mb: 1.5, color: '#1e293b', fontSize: '1.05rem',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '44px',
            }}
          >
            {ebook.titulo}
          </Typography>

          {ebook.autor && (
            <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1.5 }}>
              <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className='tabler-user' style={{ fontSize: '0.875rem', color: 'var(--mui-palette-primary-main)' }} />
              </Box>
              <Typography variant='body2' sx={{ color: '#334155', fontWeight: 600 }}>
                Por {ebook.autor}
              </Typography>
            </Stack>
          )}

          {ebook.paginas && (
            <Stack direction='row' spacing={1} alignItems='center'>
              <i className='tabler-file-text' style={{ fontSize: '1.1rem', color: '#10b981' }} />
              <Typography variant='body2' sx={{ color: '#475569', fontWeight: 600 }}>
                {ebook.paginas} páginas
              </Typography>
            </Stack>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Button
            fullWidth
            variant='contained'
            onClick={e => { e.stopPropagation(); router.push(`/estudiante/mis-ebooks/${ebook.id}`) }}
            sx={{
              borderRadius: '12px', textTransform: 'none', fontWeight: 700, py: 1.5,
              bgcolor: '#10b981',
              boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
              '&:hover': { bgcolor: '#059669', boxShadow: '0 6px 16px rgba(16,185,129,0.45)' },
            }}
          >
            Leer ebook
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  )
}

export const MisEbooksList = ({ ebooks }: Props) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return ebooks
    const q = searchQuery.toLowerCase()

    return ebooks.filter(e => e.titulo.toLowerCase().includes(q) || e.autor?.toLowerCase().includes(q))
  }, [ebooks, searchQuery])

  if (ebooks.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <i className='tabler-books' style={{ fontSize: '3.5rem', color: 'var(--mui-palette-text-disabled)' }} />
        <Typography variant='h5' color='text.secondary' sx={{ fontWeight: 700, mt: 2 }}>
          Aún no tienes ebooks adquiridos.
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mt: 1 }}>
          Explora el catálogo y comienza a leer hoy mismo.
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 6, maxWidth: { xs: '100%', sm: 400 } }}>
        <CustomTextField
          fullWidth
          placeholder='Buscar ebook por nombre o autor...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <i className='tabler-search text-[22px]' />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position='end'>
                <i className='tabler-x text-[22px] cursor-pointer' onClick={() => setSearchQuery('')} />
              </InputAdornment>
            ) : null,
          }}
        />
      </Box>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant='h5' color='text.secondary' sx={{ fontWeight: 700 }}>
            No se encontraron ebooks con &quot;{searchQuery}&quot;
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
            Prueba con otros términos de búsqueda.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={5}>
          {filtered.map(ebook => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={ebook.id}>
              <EbookCard ebook={ebook} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
