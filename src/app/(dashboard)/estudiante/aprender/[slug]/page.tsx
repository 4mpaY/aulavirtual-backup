import { notFound, redirect } from 'next/navigation'

import { AxiosPlayer } from '@/features/estudiante/player/http/axiosPlayer'
import CoursePlayerView from '@/features/estudiante/player/components/CoursePlayerView'
import { getAuthSession } from '@/utils/libs/auth-helpers'

export default async function LearningPage({ params, searchParams }: { params: { slug: string }; searchParams: { leccion?: string; examen?: string } }) {
  const session = await getAuthSession()

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosPlayer = new AxiosPlayer({
    getAuthToken: () => token
  })

  try {
    const data = await axiosPlayer.getPlayerData(params.slug)

    console.log(data)

    return <CoursePlayerView course={data.course} initialLessonId={searchParams.leccion} initialExamenId={searchParams.examen} />
  } catch (err: any) {
    const code = err?.code || err?.error

    if (code === 'UNCISCRIBED') {
      redirect(`/cursos/${params.slug}`)
    }

    notFound()
  }
}
