import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'

import { PedidosPage } from '@/features/admin/pedidos/pages/PedidosPage'
import { AxiosPedido } from '@/features/admin/pedidos/http/axiosPedido'
import { authOptions } from '@/utils/configs/auth'
import type { Pedido } from '@/features/admin/pedidos/entity/Pedido'

export const metadata = {
  title: 'Gestión de Pedidos | Aula Virtual'
}

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const token = session.user?.accessToken ?? null

  const axiosPedido = new AxiosPedido({
    getAuthToken: () => token
  })

  let initialData: Pedido[] = []

  try {
    const result = await axiosPedido.getAll({ estado: 'COMPLETADO' })

    initialData = result.pedidos ?? []
  } catch (error) {
    console.error('Error fetching pedidos:', error)
  }

  return <PedidosPage initialData={initialData} />
}
