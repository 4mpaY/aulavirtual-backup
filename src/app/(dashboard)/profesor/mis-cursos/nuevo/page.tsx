import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { CourseCreatePage } from '@/features/admin/cursos'
import { authOptions } from '@/utils/configs/auth'

export const metadata = {
    title: 'Crear Nuevo Curso',
    description: 'Configura un nuevo curso para el aula virtual'
}

export default async function Page() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    // Un profesor solo puede asignarse a sí mismo
    const profesores = [{
        id: session.user.id,
        nombre: session.user.name || 'Yo',
        apellido: ''
    }]

    return <CourseCreatePage profesores={profesores} />
}
