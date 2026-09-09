import { notFound, redirect } from 'next/navigation'

import { AxiosPlayer } from '@/features/estudiante/player/http/axiosPlayer'
import CoursePlayerView from '@/features/estudiante/player/components/CoursePlayerView'
import { getAuthSession } from '@/utils/libs/auth-helpers'
import { prisma } from '@/lib/prisma';

export default async function LearningPage(
  props: { params: Promise<{ slug: string }>; searchParams: Promise<{ leccion?: string; examen?: string }> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
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

  let phoneNumberProfesor = "51977703661"

  if (profesorByCurso?.numero_asesor) {
    phoneNumberProfesor = profesorByCurso.numero_asesor
  } else if (profesorByCurso?.profesor?.celular) {
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
