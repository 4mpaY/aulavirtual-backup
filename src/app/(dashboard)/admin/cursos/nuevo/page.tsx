import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { CourseCreatePage } from '@/features/admin/cursos'
import prisma from '@/utils/libs/prisma'
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

    let profesores: { id: string; nombre: string; apellido: string }[] = []

    try {
        const usuariosData = await prisma.usuario.findMany({
            where: {
                esta_activo: true,
                rol: { in: ['PROFESOR', 'ADMIN'] }
            },
            select: {
                id: true,
                nombre: true,
                apellido: true,
                rol: true
            }
        })

        profesores = usuariosData.map(u => ({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido
        }))
    } catch (error) {
        console.error('Error fetching profesores from DB:', error)
    }

    return <CourseCreatePage profesores={profesores} />
}
