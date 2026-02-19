import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { CursosPage } from '@/features/admin/cursos'
import { AxiosCurso } from '@/features/admin/cursos/http/axiosCurso'
import { AxiosUsuario } from '@/features/admin/usuarios/http/axiosUsuario'
import { authOptions } from '@/utils/configs/auth'
import type { Curso } from '@/features/admin/cursos/entity/Curso'

export const metadata: Metadata = {
    title: 'Gestión de Cursos',
    description: 'Administra los cursos del aula virtual'
}

export default async function Page() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const token = session.user?.accessToken ?? null

    const axiosCurso = new AxiosCurso({
        getAuthToken: () => token
    })

    const axiosUsuario = new AxiosUsuario({
        getAuthToken: () => token
    })

    let initialDataCursos: Curso[] = []

    try {
        const result = await axiosCurso.searchAll()
        initialDataCursos = result.cursos ?? []
    } catch (error) {
        console.error('Error fetching cursos:', error)
    }

    // Obtener profesores via HTTP (roles PROFESOR y ADMIN activos)
    let profesores: { id: string; nombre: string; apellido: string }[] = []

    try {
        const usuarios = await axiosUsuario.searchAll({ rol: 'PROFESOR', esta_activo: 'true' })
        const admins = await axiosUsuario.searchAll({ rol: 'ADMIN', esta_activo: 'true' })
        profesores = [...usuarios, ...admins].map(u => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido
        }))
    } catch (error) {
        console.error('Error fetching profesores:', error)
    }

    return <CursosPage initialDataCursos={initialDataCursos} profesores={profesores} />
}
