export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import {
  calcularMejoresIntentos,
  calcularResumenNotasCurso,
  formatearFechaNota,
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

export async function GET(request: Request, { params }: { params: { cursoId: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { user } = auth
    const { cursoId } = params

    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: user.id,
          curso_id: cursoId
        }
      },
      include: {
        curso: {
          include: {
            profesor: { select: { nombre: true, apellido: true } },
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
      }
    })

    if (!inscripcion) {
      return ApiResponse.error(request, 'No estás inscrito en este curso', 404)
    }

    const intentos = await prisma.intentoExamen.findMany({
      where: {
        usuario_id: user.id,
        examen: { curso_id: cursoId },
        enviado_en: { not: null }
      },
      select: { examen_id: true, puntaje: true, enviado_en: true }
    })

    const mejoresIntentos = calcularMejoresIntentos(intentos)

    const examenesInput = inscripcion.curso.examenes.map(ex => ({
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
      intentos.reduce<Date | null>((latest, i) => {
        if (!i.enviado_en) return latest

        return !latest || i.enviado_en > latest ? i.enviado_en : latest
      }, null) ??
      inscripcion.curso.fecha_fin ??
      inscripcion.curso.fecha_inicio ??
      inscripcion.inscrito_en

    const fecha = new Date(fechaRef)
    const docente = `${inscripcion.curso.profesor.nombre} ${inscripcion.curso.profesor.apellido ?? ''}`.trim()

    return ApiResponse.success(request, {
      curso_id: cursoId,
      codigo: inscripcion.curso.codigo ?? '—',
      curso: inscripcion.curso.titulo,
      periodo: obtenerPeriodoAcademico(fecha),
      promedio: resumen.promedio,
      fecha: formatearFechaNota(fecha),
      modalidad: modalidadLabel(inscripcion.curso.tipo_emision),
      docente,
      evaluaciones: resumen.evaluaciones.map(e => ({
        numero: e.numero,
        examen_id: e.examen_id,
        descripcion: e.descripcion,
        peso: e.peso,
        nota: e.nota
      }))
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
