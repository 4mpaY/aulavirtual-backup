export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import {
  calcularMejoresIntentos,
  calcularResumenNotasCurso,
  formatearFechaNota,
  obtenerAnioAcademico,
  obtenerPeriodoAcademico
} from '@/utils/functions/calcularNotasCurso'

function modalidadLabel(tipoEmision: string): string {
  if (tipoEmision === 'SINCRONO') return 'PRESENCIAL'

  return 'REGULAR'
}

function toNotaFinalNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null

  const n = Number(value)

  return Number.isFinite(n) ? n : null
}

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { searchParams } = new URL(request.url)
    const anioParam = searchParams.get('anio')
    const categoriaId = searchParams.get('categoria_id')

    const inscripciones = await prisma.inscripcion.findMany({
      where: { usuario_id: user.id },
      include: {
        curso: {
          include: {
            profesor: { select: { nombre: true, apellido: true } },
            categoria: { select: { id: true, nombre: true } },
            examenes: {
              where: { esta_publicado: true },
              select: {
                id: true,
                titulo: true,
                peso: true,
                orden: true,
                modulo_id: true,
                modulo: { select: { orden: true } }
              }
            }
          }
        }
      },
      orderBy: { inscrito_en: 'desc' }
    })

    const cursoIds = inscripciones.map(i => i.curso_id)

    const intentos =
      cursoIds.length === 0
        ? []
        : await prisma.intentoExamen.findMany({
            where: {
              usuario_id: user.id,
              examen: { curso_id: { in: cursoIds } },
              enviado_en: { not: null }
            },
            select: { examen_id: true, puntaje: true, enviado_en: true }
          })

    const intentosPorCurso = new Map<string, typeof intentos>()

    for (const inscripcion of inscripciones) {
      const examenIds = new Set(inscripcion.curso.examenes.map(e => e.id))
      const delCurso = intentos.filter(i => examenIds.has(i.examen_id))

      intentosPorCurso.set(inscripcion.curso_id, delCurso)
    }

    const categoriasMap = new Map<string, { id: string; nombre: string }>()
    const aniosSet = new Set<number>()

    const registros = inscripciones.map(inscripcion => {
      const curso = inscripcion.curso
      const intentosCurso = intentosPorCurso.get(curso.id) ?? []
      const mejoresIntentos = calcularMejoresIntentos(intentosCurso)

      const examenesInput = curso.examenes.map(ex => ({
        id: ex.id,
        titulo: ex.titulo,
        peso: ex.peso,
        orden: ex.orden,
        modulo_id: ex.modulo_id,
        modulo_orden: ex.modulo?.orden ?? null
      }))

      const resumen = calcularResumenNotasCurso(
        examenesInput,
        mejoresIntentos,
        toNotaFinalNumber(inscripcion.nota_final)
      )

      const fechaRef =
        inscripcion.completado_en ??
        intentosCurso.reduce<Date | null>((latest, i) => {
          if (!i.enviado_en) return latest

          return !latest || i.enviado_en > latest ? i.enviado_en : latest
        }, null) ??
        curso.fecha_fin ??
        curso.fecha_inicio ??
        inscripcion.inscrito_en

      const fecha = new Date(fechaRef)
      const anioAcademico = obtenerAnioAcademico(fecha)

      aniosSet.add(anioAcademico)

      if (curso.categoria) {
        categoriasMap.set(curso.categoria.id, {
          id: curso.categoria.id,
          nombre: curso.categoria.nombre
        })
      }

      const docente = `${curso.profesor.nombre} ${curso.profesor.apellido ?? ''}`.trim()

      return {
        inscripcion_id: inscripcion.id,
        curso_id: curso.id,
        codigo: curso.codigo?.trim() || '',
        curso: curso.titulo,
        periodo: obtenerPeriodoAcademico(fecha),
        anio_academico: anioAcademico,
        grupo: '—',
        seccion: curso.categoria?.nombre ?? '—',
        promedio: resumen.promedio,
        fecha: formatearFechaNota(fecha),
        fecha_iso: fecha.toISOString(),
        modalidad: modalidadLabel(curso.tipo_emision),
        docente,
        categoria_id: curso.categoria?.id ?? null,
        categoria: curso.categoria?.nombre ?? 'General',
        total_evaluaciones: resumen.total_evaluaciones,
        evaluaciones_realizadas: resumen.evaluaciones_realizadas
      }
    })

    let filtrados = registros

    if (anioParam) {
      const anio = Number(anioParam)

      if (!Number.isNaN(anio)) {
        filtrados = filtrados.filter(r => r.anio_academico === anio)
      }
    }

    if (categoriaId) {
      filtrados = filtrados.filter(r => r.categoria_id === categoriaId)
    }

    const anios = Array.from(aniosSet).sort((a, b) => b - a)
    const categorias = Array.from(categoriasMap.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))

    return ApiResponse.success(request, {
      filtros: { anios, categorias },
      registros: filtrados
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
