export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const ahora = new Date()
    const inicioMesActual = startOfMonth(ahora)
    const inicioMesAnterior = startOfMonth(new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1))
    const inicioHistorico = startOfMonth(new Date(ahora.getFullYear(), ahora.getMonth() - 5, 1))

    const [
      totalEstudiantes,
      totalProfesores,
      totalCursos,
      cursosPublicados,
      pedidosPendientes,
      certificadosEmitidos,
      pedidosCompletados,
      pedidosParaSerie,
      inscripcionesRecientes,
      pedidosRecientes,
      cursosPopulares
    ] = await Promise.all([
      prisma.usuario.count({ where: { rol: 'ESTUDIANTE' } }),
      prisma.usuario.count({ where: { rol: 'PROFESOR' } }),
      prisma.curso.count(),
      prisma.curso.count({ where: { estado: 'PUBLICADO' } }),
      prisma.pedido.count({ where: { estado: 'PENDIENTE' } }),
      prisma.certificado.count(),
      // ✅ Aggregate: no carga filas a memoria, una sola query SQL
      prisma.pedido.aggregate({
        where: { estado: 'COMPLETADO' },
        _sum: { total: true },
        _count: { id: true }
      }),
      prisma.pedido.findMany({
        where: { estado: 'COMPLETADO', pagado_en: { gte: inicioHistorico } },
        select: { total: true, pagado_en: true }
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
          precio: true,
          moneda: true,
          _count: {
            select: { inscripciones: true }
          }
        }
      })
    ])

    const totalIngresos = Number(pedidosCompletados._sum.total ?? 0)
    const ticketPromedio = pedidosCompletados._count.id > 0 ? totalIngresos / pedidosCompletados._count.id : 0

    const ingresosMesActual = pedidosParaSerie
      .filter(p => p.pagado_en && p.pagado_en >= inicioMesActual)
      .reduce((acc, p) => acc + Number(p.total), 0)

    const ingresosMesAnterior = pedidosParaSerie
      .filter(p => p.pagado_en && p.pagado_en >= inicioMesAnterior && p.pagado_en < inicioMesActual)
      .reduce((acc, p) => acc + Number(p.total), 0)

    const crecimientoIngresos =
      ingresosMesAnterior > 0
        ? ((ingresosMesActual - ingresosMesAnterior) / ingresosMesAnterior) * 100
        : ingresosMesActual > 0
          ? 100
          : 0

    const ventasPorMes = Array.from({ length: 6 }).map((_, i) => {
      const mesInicio = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i), 1)
      const mesFin = new Date(ahora.getFullYear(), ahora.getMonth() - (5 - i) + 1, 1)

      const total = pedidosParaSerie
        .filter(p => p.pagado_en && p.pagado_en >= mesInicio && p.pagado_en < mesFin)
        .reduce((acc, p) => acc + Number(p.total), 0)

      return {
        mes: mesInicio.toLocaleDateString('es-PE', { month: 'short' }),
        total
      }
    })

    return ApiResponse.success(request, {
      resumen: {
        estudiantes: totalEstudiantes,
        profesores: totalProfesores,
        cursos: totalCursos,
        cursosPublicados,
        ingresos: totalIngresos,
        ingresosMesActual,
        crecimientoIngresos,
        ticketPromedio,
        pedidosPendientes,
        certificadosEmitidos
      },
      ventasPorMes,
      inscripcionesRecientes,
      pedidosRecientes,
      cursosPopulares
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
