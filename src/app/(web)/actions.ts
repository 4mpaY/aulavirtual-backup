'use server'

import prisma from '@/utils/libs/prisma'

export async function getEscuelasConRutas() {
  try {
    const escuelas = await prisma.escuela.findMany({
      include: {
        rutas: {
          where: { esta_activo: true },
          select: { titulo: true, slug: true }
        }
      },
      orderBy: { orden: 'asc' }
    })

    
return escuelas
  } catch (error) {
    console.error('Error fetching escuelas:', error)
    
return []
  }
}
