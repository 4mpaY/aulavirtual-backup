import { notFound, redirect } from 'next/navigation'

import { AxiosPlayer } from '@/features/estudiante/player/http/axiosPlayer'
import CoursePlayerView from '@/features/estudiante/player/components/CoursePlayerView'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import { prisma } from '@/lib/prisma';

export default async function LearningPage({ params, searchParams }: { params: { slug: string }; searchParams: { leccion?: string; examen?: string } }) {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const profesorByCurso = await prisma.curso.findUnique({
    where: { slug: params.slug },
    include: {
      profesor: {
        select: {
          celular: true,
        }
      }
    }
  })

  let phoneNumberProfesor = "51959436827"

  if (profesorByCurso && profesorByCurso.profesor && profesorByCurso.profesor.celular) {
    phoneNumberProfesor = profesorByCurso.profesor.celular
  }

  const token = session.user?.accessToken ?? null

  const axiosPlayer = new AxiosPlayer({
    getAuthToken: () => token
  })

  try {
    const data = await axiosPlayer.getPlayerData(params.slug)

    console.log(data)

    return <CoursePlayerView course={data.course} initialLessonId={searchParams.leccion} initialExamenId={searchParams.examen} phoneNumberProfesor={phoneNumberProfesor} />
  } catch (err: any) {
    const code = err?.code || err?.error

    if (code === 'UNCISCRIBED') {
      redirect(`/cursos/${params.slug}`)
    }

    notFound()
  }
}
