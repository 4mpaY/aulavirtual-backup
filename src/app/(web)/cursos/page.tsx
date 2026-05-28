// Next Imports
import React from 'react'

import { Box } from '@mui/material'

import CourseCatalog from '@/features/web/home/components/CourseCatalog'
import PageHeader from '@/utils/components/layout/web/PageHeader'

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
  title: `${process.env.NEXT_PUBLIC_APP_NAME} | Cursos`,
  description: 'Explora nuestra amplia variedad de cursos y comienza a aprender hoy mismo.'
}

export default async function CursosPage() {
  const session = await getAuthSession()
  const token = session?.user?.accessToken ?? null

  const { courses, categories } = await getData(token)

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
      <PageHeader
        label="Formación Especializada"
        title="Catálogo de Cursos"
        description="Explora nuestra selección de cursos en salud ocupacional, seguridad y medio ambiente, diseñados por expertos del sector."
        imageSrc="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80"
      />
      <CourseCatalog courses={courses} categories={categories} />
    </Box>
  )
}
