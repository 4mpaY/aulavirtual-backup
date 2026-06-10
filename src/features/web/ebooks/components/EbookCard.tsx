'use client'

import type { MouseEvent } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'

import { useSession } from 'next-auth/react'

import { useAuthModal } from '@/contexts/AuthModalContext'

interface EbookCardProps {
  id: string
  titulo: string
  slug: string
  miniatura?: string | null
  precio: number
  precio_falso: number
  moneda: string
  es_gratis: boolean
  autor?: string | null
  paginas?: number | null
  genero?: string | null
  categoria?: { nombre: string } | null
  adquirido: boolean
}

const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  overflow: 'hidden',
  position: 'relative',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
}))

export default function EbookCard({
  id, titulo, slug, miniatura, precio, precio_falso, moneda,
  es_gratis, autor, paginas, genero, categoria, adquirido,
}: EbookCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const { openLogin } = useAuthModal()

  const handleComprar = (e: MouseEvent) => {
    e.stopPropagation()

    const goToCheckout = () => router.push(`/checkout/ebook/${id}`)

    if (!session) {
      openLogin(undefined, goToCheckout)

      return
    }

    goToCheckout()
  }

  return (
    <StyledCard onClick={() => router.push(`/ebooks/${slug}`)}>

      {/* Portada */}
      <Box sx={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10.5', bgcolor: '#f1f5f9', flexShrink: 0 }}>
        {miniatura ? (
          <Box
            component='img'
            src={miniatura}
            alt={titulo}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#94a3b8' }}>
            <i className='tabler-book' style={{ fontSize: '2.5rem' }} />
            <Typography variant='caption' color='text.disabled'>Sin portada</Typography>
          </Box>
        )}

        {/* Badge izquierdo: género */}
        {genero && (
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
            <Chip
              label={genero}
              sx={{ bgcolor: '#3b82f6', color: 'white', fontWeight: 700, borderRadius: '12px', height: '28px', px: 1 }}
            />
          </Box>
        )}

        {/* Badge derecho: adquirido / gratis / formato */}
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          {adquirido ? (
            <Chip
              icon={<i className='tabler-circle-check-filled' style={{ fontSize: '1.2rem', color: 'white' }} />}
              label='TU EBOOK'
              sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 800, borderRadius: '12px', height: '28px', pl: 0.5, pr: 1, boxShadow: '0 4px 14px rgba(16,185,129,0.4)' }}
            />
          ) : es_gratis ? (
            <Chip
              label='GRATIS'
              sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 700, borderRadius: '12px', height: '28px', px: 1 }}
            />
          ) : (
            <Chip
              label='PDF'
              sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700, borderRadius: '12px', height: '28px', px: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box>
          {/* Categoría */}
          {categoria && (
            <Chip
              label={categoria.nombre}
              size='small'
              sx={{ bgcolor: 'primary.50', color: 'primary.main', fontWeight: 700, mb: 1, borderRadius: '6px', fontSize: '0.65rem', textTransform: 'uppercase' }}
            />
          )}

          {/* Título */}
          <Typography
            variant='h6'
            component={Link}
            href={`/ebooks/${slug}`}
            onClick={e => e.stopPropagation()}
            sx={{
              fontWeight: 800, lineHeight: 1.2, mb: 0.5, color: '#1e293b', textDecoration: 'none',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              fontSize: '1.1rem', minHeight: '44px', transition: 'color 0.2s',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {titulo}
          </Typography>

          {/* Autor */}
          {autor && (
            <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 2 }}>
              <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.100', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className='tabler-user' style={{ fontSize: '0.875rem', color: 'var(--mui-palette-primary-main)' }} />
              </Box>
              <Typography variant='body2' sx={{ color: '#334155', fontWeight: 700 }}>
                Por {autor}
              </Typography>
            </Stack>
          )}

          {/* Páginas */}
          {paginas && (
            <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 2 }}>
              <i className='tabler-file-text' style={{ fontSize: '1.2rem', color: '#10b981' }} />
              <Typography variant='body2' sx={{ color: '#1e293b', fontWeight: 600 }}>
                {paginas} páginas
              </Typography>
            </Stack>
          )}

          {/* Precio */}
          <Typography variant='h5' sx={{ fontWeight: 800, color: adquirido ? '#10b981' : 'primary.main' }}>
            {adquirido ? 'Adquirido' : es_gratis ? 'Gratis' : `${moneda} ${precio.toFixed(2)}`}
          </Typography>
          {!adquirido && !es_gratis && precio_falso > 0 && (
            <Typography variant='body2' sx={{ color: 'text.disabled', textDecoration: 'line-through', mt: 0.25 }}>
              {moneda} {precio_falso.toFixed(2)}
            </Typography>
          )}
        </Box>

        {/* Botones */}
        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            component={Link}
            href={adquirido ? `/estudiante/mis-ebooks/${id}` : `/ebooks/${slug}`}
            onClick={e => e.stopPropagation()}
            variant='contained'
            sx={{
              borderRadius: '12px', textTransform: 'none', fontWeight: 700, px: 3, py: 1.5, height: 50,
              bgcolor: adquirido ? '#10b981' : 'primary.main',
              boxShadow: adquirido
                ? '0 4px 14px rgba(16,185,129,0.39)'
                : '0 4px 14px 0 rgba(var(--mui-palette-primary-mainChannel) / 0.39)',
              '&:hover': { bgcolor: adquirido ? '#059669' : 'primary.dark' },
              flexGrow: 1,
            }}
          >
            {adquirido ? 'Leer ebook' : 'Ver ebook'}
          </Button>

          {!adquirido && !es_gratis && (
            <Tooltip title='Comprar ahora'>
              <IconButton
                onClick={handleComprar}
                sx={{
                  borderRadius: '12px',
                  bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.08)',
                  color: 'primary.main',
                  width: 50, height: 50,
                  border: '1px solid',
                  borderColor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.12)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.15)', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                }}
              >
                <i className='tabler-credit-card' style={{ fontSize: '1.4rem' }} />
              </IconButton>
            </Tooltip>
          )}

          {!adquirido && es_gratis && (
            <Tooltip title='Obtener gratis'>
              <IconButton
                component={Link}
                href={`/ebooks/${slug}`}
                onClick={e => e.stopPropagation()}
                sx={{
                  borderRadius: '12px', bgcolor: 'success.50', color: 'success.main',
                  width: 50, height: 50, border: '1px solid', borderColor: 'success.200',
                  '&:hover': { bgcolor: 'success.100', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <i className='tabler-download' style={{ fontSize: '1.4rem' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  )
}
