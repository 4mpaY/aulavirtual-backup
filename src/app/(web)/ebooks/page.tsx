export const dynamic = 'force-dynamic'

import { Box, Typography } from '@mui/material'

import prisma from '@/utils/libs/prisma'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import EbookCatalog from '@/features/web/ebooks/components/EbookCatalog'

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Ebooks`,
  description: 'Explora nuestra colección de ebooks especializados.',
}

export default async function EbooksPage() {
  const session = await getAuthSession()

  const ebooks = await prisma.ebook.findMany({
    where: { estado: 'PUBLICADO' },
    orderBy: { creado_en: 'desc' },
    select: {
      id: true, titulo: true, slug: true, descripcion: true,
      autor: true, miniatura: true, precio: true, precio_falso: true,
      moneda: true, es_gratis: true, paginas: true, genero: true,
      categoria: { select: { nombre: true } },
    },
  })

  let adquiridosIds: string[] = []

  if (session?.user?.id) {
    const accesos = await prisma.ebookAcceso.findMany({
      where: { usuario_id: session.user.id },
      select: { ebook_id: true },
    })

    adquiridosIds = accesos.map(a => a.ebook_id)
  }

  const ebooksSerializados = ebooks.map(e => ({
    ...e,
    precio: Number(e.precio),
    precio_falso: Number(e.precio_falso),
  }))

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      {/* Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, var(--web-dark-deep, #012d22) 0%, var(--web-dark, #025E44) 100%)',
          py: { xs: 5, md: 7 },
          px: { xs: 3, md: 6 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(var(--web-light-rgb, 189,217,98),0.06)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box
              component='a'
              href='/'
              sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', '&:hover': { color: 'var(--web-light, #BDD962)' }, transition: 'color 0.2s' }}
            >
              Inicio
            </Box>
            <Box component='span' sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</Box>
            <Box component='span' sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: 'var(--web-light, #BDD962)', fontWeight: 600 }}>
              Ebooks
            </Box>
          </Box>

          <Typography
            component='h1'
            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', mb: 1, lineHeight: 1.2 }}
          >
            Catálogo de Ebooks
          </Typography>
          <Typography
            component='p'
            sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 520, lineHeight: 1.6 }}
          >
            Amplía tu conocimiento con nuestra colección de ebooks especializados.
          </Typography>

          {/* Stats chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
            {[
              { label: `${ebooks.length} ebooks disponibles`, icon: '📖' },
              ...(adquiridosIds.length > 0 ? [{ label: `${adquiridosIds.length} adquiridos`, icon: '✅' }] : []),
            ].map(chip => (
              <Box
                key={chip.label}
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 2, py: 0.75, borderRadius: '999px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: '#ffffff', fontWeight: 500 }}
              >
                <span>{chip.icon}</span>
                {chip.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <EbookCatalog ebooks={ebooksSerializados} adquiridosIds={adquiridosIds} />
    </Box>
  )
}
