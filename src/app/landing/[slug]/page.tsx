import React from 'react'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import prisma from '@/utils/libs/prisma'

import LandingClientPage from '@/features/web/landing/components/LandingClientPage'
import { getConfigs } from '@/utils/libs/config'

async function getCourseForLanding(slug: string) {
  const course = await prisma.curso.findUnique({
    where: { slug },
    include: {
      profesor: {
        select: { nombre: true, apellido: true }
      }
    }
  })

  if (!course) return null
  return course
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course = await getCourseForLanding(params.slug)

  if (!course) return { title: 'Curso no encontrado' }

  return {
    title: `Lanzamiento: ${course.titulo} | Aula Virtual`,
    description: course.descripcion || `Únete al lanzamiento de ${course.titulo}`
  }
}

export default async function LandingPage({ params }: { params: { slug: string } }) {
  const course = await getCourseForLanding(params.slug)

  if (!course) {
    notFound()
  }

  const configs = await getConfigs()
  const platformLogo = configs.WEB_LOGO_URL || '/images/logos/default-logo.png'

  return <LandingClientPage curso={course as any} logo={platformLogo} />
}
