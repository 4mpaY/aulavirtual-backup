import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { CourseCreatePage } from '@/features/admin/cursos'
import { AxiosUsuario } from '@/features/admin/usuarios/http/axiosUsuario'
import { authOptions } from '@/utils/configs/auth'

export const metadata: Metadata = {
    title: 'Crear Nuevo Curso',
    description: 'Configura un nuevo curso para el aula virtual'
}

export default async function Page() {
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
        const [usuarios, admins] = await Promise.all([
            axiosUsuario.searchAll({ rol: 'PROFESOR', esta_activo: 'true' }),
            axiosUsuario.searchAll({ rol: 'ADMIN', esta_activo: 'true' })
        ])

        const allUsers = [...usuarios, ...admins]

        // Eliminar duplicados si los hay y mapear
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.id, u])).values())

        profesores = uniqueUsers.map(u => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido
        }))
    } catch (error) {
        console.error('Error fetching profesores:', error)
    }

    return <CourseCreatePage profesores={profesores} />
}
