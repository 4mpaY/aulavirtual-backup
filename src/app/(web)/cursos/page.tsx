// Next Imports
import React from 'react'

import { Box } from '@mui/material'

// Component Imports
import CourseCatalog from '@/features/web/home/components/CourseCatalog'

// Http Client
import { AxiosWebCursos } from '@/features/web/cursos/http/axiosWebCursos'
import { getAuthSession } from '@/utils/libs/auth-helpers'

// Server Action / Data Fetching
async function getData(token: string | null) {
  try {
    const axiosWebCursos = new AxiosWebCursos({
      getAuthToken: () => token
    })

    const data = await axiosWebCursos.getCatalog()

    // Serialización manual de Decimal a Number para evitar errores en Client Components
    if (data.courses) {
      data.courses = data.courses.map((c: any) => ({
        ...c,
        precio: c.precio ? Number(c.precio) : 0,
        precio_oferta: c.precio_oferta ? Number(c.precio_oferta) : null
      }))
    }

    return data
  } catch (error) {
    console.error('Error fetching data in CursosPage via API:', error)

    return { courses: [], categories: [] }
  }
}

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_URL} | Cursos`,
  description: 'Explora nuestra amplia variedad de cursos y comienza a aprender hoy mismo.'
}

export default async function CursosPage() {
  const session = await getAuthSession()
  const token = session?.user?.accessToken ?? null

  const { courses, categories } = await getData(token)

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      {/* Banner */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.50) 100%), url("https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          py: { xs: 6, md: 9 },
          px: { xs: 3, md: 6 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', backgroundColor: 'rgba(var(--web-light-rgb, 189, 217, 98),0.06)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -60, right: 80, width: 300, height: 300, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <Box sx={{ maxWidth: 1280, mx: 'auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Box
              component="a"
              href="/"
              sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', '&:hover': { color: 'var(--web-light, #BDD962)' }, transition: 'color 0.2s' }}
            >
              Inicio
            </Box>
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/</Box>
            <Box component="span" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8125rem', color: 'var(--web-light, #BDD962)', fontWeight: 600 }}>
              Cursos
            </Box>
          </Box>

          <Box
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: { xs: '2rem', md: '2.75rem' },
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              mb: 1,
              lineHeight: 1.2,
            }}
            component="h1"
          >
            Catálogo de <span style={{ color: 'var(--web-light, #BDD962)' }}>Programas y Especializaciones</span>
          </Box>
          <Box
            sx={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 580, lineHeight: 1.7 }}
            component="p"
          >
            Descubre nuestros programas de especialización, capacitaciones, actualizaciones y diplomados en educación, salud, gestión y tecnología. Clases en vivo y grabadas con certificado oficial.
          </Box>

          {/* Stats chips */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
            {[
              { label: `${courses.length} programas disponibles`, icon: '📚' },
              { label: `${categories.length} áreas académicas`, icon: '🏫' },
              { label: 'Clases en vivo y grabadas', icon: '💻' },
            ].map(chip => (
              <Box
                key={chip.label}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  borderRadius: '999px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#ffffff',
                  fontWeight: 500,
                }}
              >
                <span>{chip.icon}</span>
                {chip.label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <CourseCatalog courses={courses} categories={categories} />
    </Box>
  )
}
