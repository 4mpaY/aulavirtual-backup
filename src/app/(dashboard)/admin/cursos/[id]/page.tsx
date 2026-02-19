import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { CourseBuilderPage } from '@/features/admin/cursos/pages/CourseBuilderPage'
import { AxiosUsuario } from '@/features/admin/usuarios/http/axiosUsuario'
import { authOptions } from '@/utils/configs/auth'

export const metadata: Metadata = {
    title: 'Editor de Curso',
    description: 'Edita el contenido y configuración del curso'
}

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const token = session.user?.accessToken ?? null

    const axiosUsuario = new AxiosUsuario({
        getAuthToken: () => token
    })

    let profesores: { id: string; nombre: string; apellido: string }[] = []

    try {
        const profs = await axiosUsuario.searchAll({ rol: 'PROFESOR', esta_activo: 'true' })
        const admins = await axiosUsuario.searchAll({ rol: 'ADMIN', esta_activo: 'true' })
        profesores = [...profs, ...admins].map(u => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido
        }))
    } catch (error) {
        console.error('Error fetching profesores:', error)
    }

    return <CourseBuilderPage cursoId={params.id} profesores={profesores} />
}
