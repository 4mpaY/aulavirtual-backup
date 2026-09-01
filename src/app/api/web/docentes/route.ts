export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import { ApiResponse } from '@/utils/libs/apiResponse'

export async function GET(request: Request) {
  try {
    const [teachers, configs] = await Promise.all([
      prisma.usuario.findMany({
        where: { rol: 'PROFESOR' },
        select: {
          id: true,
          nombre: true,
          apellido: true,
          slug: true,
          avatar: true,
          cargo: true,
          biografia: true,
          _count: { select: { cursos_dictados: true } },
        },
        orderBy: { cursos_dictados: { _count: 'desc' } },
        take: 12,
      }),
      getConfigs(),
    ])

    const mostrar_en_inicio = configs.DOCENTES_MOSTRAR_EN_INICIO !== 'false'

    return ApiResponse.success(request, {
      teachers,
      mostrar_en_inicio,
    })
  } catch (error) {
    return ApiResponse.error(request, 'Error al obtener los docentes', 500)
  }
}
