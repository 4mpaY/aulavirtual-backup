import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { CursosPage } from '@/features/admin/cursos/pages/CursosPage'
import { AxiosCurso } from '@/features/admin/cursos/http/axiosCurso'
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

    let initialDataCursos: Curso[] = []

    try {
        const result = await axiosCurso.searchAll()

        initialDataCursos = result.cursos ?? []
    } catch (error) {
        console.error('Error fetching cursos:', error)
    }

    return <CursosPage initialDataCursos={initialDataCursos} />
}
