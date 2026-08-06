import { notFound, redirect } from 'next/navigation'

import CoursePlayerView from '@/features/estudiante/player/components/CoursePlayerView'
import { UnenrolledError, getPlayerCourseData } from '@/features/estudiante/player/server/getPlayerCourseData'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import { prisma } from '@/lib/prisma';

export default async function LearningPage({ params, searchParams }: { params: { slug: string }; searchParams: { leccion?: string; examen?: string } }) {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const profesorByCurso = await prisma.curso.findUnique({
    where: { slug: params.slug },
    select: {
      numero_asesor: true,
      profesor: {
        select: {
          celular: true,
        }
      }
    }
  })

  let phoneNumberProfesor = "51959436827"

  if (profesorByCurso?.numero_asesor) {
    phoneNumberProfesor = profesorByCurso.numero_asesor
  } else if (profesorByCurso?.profesor?.celular) {
    phoneNumberProfesor = profesorByCurso.profesor.celular
  }

  try {
    const data = await getPlayerCourseData({ id: session.user!.id, rol: session.user!.rol }, params.slug)

    return <CoursePlayerView course={data.course} initialLessonId={searchParams.leccion} initialExamenId={searchParams.examen} phoneNumberProfesor={phoneNumberProfesor} />
  } catch (err) {
    if (err instanceof UnenrolledError) {
      redirect(`/cursos/${params.slug}`)
    }

    notFound()
  }
}
