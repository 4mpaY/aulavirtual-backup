import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

import { getServerSession } from 'next-auth'

import { UsuariosPage } from '@/features/admin/usuarios/pages/UsuariosPage'
import type { Usuario } from '@/features/admin/usuarios/entity/Usuario'
import { AxiosUsuario } from '@/features/admin/usuarios/http/axiosUsuario'
import { authOptions } from '@/utils/configs/auth'

export const metadata: Metadata = {
  title: 'Gestión de Usuarios',
  description: 'Administra los usuarios del sistema'
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

  let initialData: Usuario[] = []

  try {
    initialData = await axiosUsuario.searchAll()
  } catch (error) {
    console.error('Error fetching usuarios:', error)
  }

  console.log("initialData", initialData)

  return <UsuariosPage initialDataUsuarios={initialData} />
}
