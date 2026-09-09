import React from 'react'

import { notFound } from 'next/navigation'

import type { Metadata } from 'next'

import LandingClientPage from '@/features/web/landing/components/LandingClientPage'
import { getConfigs } from '@/utils/libs/config'
import prisma from '@/utils/libs/prisma'

async function getCourseForLanding(slug: string) {
  const course = await prisma.curso.findUnique({
    where: { slug },
    include: {
      profesor: {
        select: { nombre: true, apellido: true }
      },
      modulos: {
        orderBy: { orden: 'asc' },
        include: {
          lecciones: {
            orderBy: { orden: 'asc' }
          }
        }
      }
    }
  })

  if (!course) {
    return null
  }

  return course
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const course = await getCourseForLanding(params.slug)

  if (!course) {
    return { title: 'Curso no encontrado' }
  }

  return {
    title: `Lanzamiento: ${course.titulo} | Aula Virtual`,
    description: course.descripcion || `Únete al lanzamiento de ${course.titulo}`
  }
}

export default async function LandingPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const course = await getCourseForLanding(params.slug)

  if (!course) {
    notFound()
  }

  const configs = await getConfigs()
  const platformLogo = configs.TEMPLATE_LOGO || configs.WEB_LOGO_URL || '/images/logo.png'

  return <LandingClientPage curso={course as any} logo={platformLogo} />
}
