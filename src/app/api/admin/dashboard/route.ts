import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const [
      totalEstudiantes,
      totalProfesores,
      totalCursos,
      pedidosCompletados,
      inscripcionesRecientes,
      pedidosRecientes,
      cursosPopulares
    ] = await Promise.all([
      prisma.usuario.count({ where: { rol: 'ESTUDIANTE' } }),
      prisma.usuario.count({ where: { rol: 'PROFESOR' } }),
      prisma.curso.count(),
      prisma.pedido.findMany({
        where: { estado: 'COMPLETADO' },
        select: { total: true }
      }),
      prisma.inscripcion.findMany({
        take: 5,
        orderBy: { inscrito_en: 'desc' },
        include: {
          usuario: { select: { nombre: true, apellido: true, avatar: true } },
          curso: { select: { titulo: true } }
        }
      }),
      prisma.pedido.findMany({
        take: 5,
        orderBy: { creado_en: 'desc' },
        include: {
          usuario: { select: { nombre: true, apellido: true } }
        }
      }),
      prisma.curso.findMany({
        take: 5,
        orderBy: {
          inscripciones: {
            _count: 'desc'
          }
        },
        select: {
          id: true,
          titulo: true,
          slug: true,
          miniatura: true,
          _count: {
            select: { inscripciones: true }
          }
        }
      })
    ])

    const totalIngresos = pedidosCompletados.reduce((acc, p) => acc + Number(p.total), 0)

    return ApiResponse.success(request, {
      resumen: {
        estudiantes: totalEstudiantes,
        profesores: totalProfesores,
        cursos: totalCursos,
        ingresos: totalIngresos
      },
      inscripcionesRecientes,
      pedidosRecientes,
      cursosPopulares
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
