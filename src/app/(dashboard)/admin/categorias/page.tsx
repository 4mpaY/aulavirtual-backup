import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { CategoriasPage } from '@/features/admin/categorias/pages/CategoriasPage'
import type { Categoria } from '@/features/admin/categorias/entity/Categoria'
import { AxiosCategoria } from '@/features/admin/categorias/http/axiosCategoria'
import { authOptions } from '@/utils/configs/auth'

export const metadata: Metadata = {
    title: 'Gestión de Categorías',
    description: 'Administra las categorías del aula virtual'
}

export default async function Page() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/login')
    }

    const token = session.user?.accessToken ?? null

    const axiosCategoria = new AxiosCategoria({
        getAuthToken: () => token
    })

    let initialData: Categoria[] = []

    try {
        initialData = await axiosCategoria.searchAll()
    } catch (error) {
        console.error('Error fetching categorias:', error)
    }

    return <CategoriasPage initialDataCategorias={initialData} />
}
