import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { CourseBuilderPage } from '@/features/admin/cursos/pages/CourseBuilderPage'
import { authOptions } from '@/utils/configs/auth'

export const metadata = {
    title: 'Editor de Curso | Profesor',
    description: 'Edita el contenido de tu curso'
}

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const profesores = [{
        id: session.user.id,
        nombre: session.user.name || 'Yo',
        apellido: ''
    }]

    return <CourseBuilderPage cursoId={params.id} profesores={profesores} />
}
