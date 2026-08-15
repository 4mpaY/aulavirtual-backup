export const dynamic = 'force-dynamic'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { contarCertificadosCurso, formatearCodigoCertificado } from '@/app/api/_shared/certificados/generarCodigoCertificado'

/** Calcula el promedio ponderado de las evaluaciones del estudiante en un curso.
 *  Los exámenes sin intentar cuentan como 0. */
async function calcularElegibilidad(usuarioId: string, cursoId: string) {
  const [progresoCurso, examenes] = await Promise.all([
    prisma.progresoCurso.findUnique({
      where: { usuario_id_curso_id: { usuario_id: usuarioId, curso_id: cursoId } }
    }),
    prisma.examen.findMany({
      where: { curso_id: cursoId, esta_publicado: true },
      select: {
        id: true,
        puntaje_aprobacion: true,
        intentos: {
          where: { usuario_id: usuarioId },
          orderBy: { puntaje: 'desc' },
          take: 1,
          select: { puntaje: true }
        }
      }
    })
  ])

  const progreso = progresoCurso?.porcentaje_progreso ?? 0
  const totalExamenes = examenes.length

  let promedioScore = 0
  let promedioMinimo = 60 // umbral por defecto si no hay exámenes

  if (totalExamenes > 0) {
    const sumScores = examenes.reduce((acc, ex) => acc + (ex.intentos[0]?.puntaje ?? 0), 0)
    const sumMinimos = examenes.reduce((acc, ex) => acc + (ex.puntaje_aprobacion ?? 60), 0)

    promedioScore = Math.round((sumScores / totalExamenes) * 10) / 10
    promedioMinimo = Math.round((sumMinimos / totalExamenes) * 10) / 10
  }

  const isEligible = progreso >= 100 && (totalExamenes === 0 || promedioScore >= promedioMinimo)

  return { progreso, promedioScore, promedioMinimo, isEligible, totalExamenes }
}

/**
 * GET /api/estudiante/certificado?cursoId=xxx
 * Obtiene el certificado existente + datos de elegibilidad del estudiante
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { searchParams } = new URL(request.url)
    const cursoId = searchParams.get('cursoId')

    if (!cursoId) {
      return ApiResponse.error(request, 'El ID del curso es requerido', 400)
    }

    const [certificado, elegibilidad, inscripcion, curso] = await Promise.all([
      prisma.certificado.findUnique({
        where: { usuario_id_curso_id: { usuario_id: auth.user.id, curso_id: cursoId } },
        include: {
          curso: { select: { titulo: true } },
          usuario: { select: { nombre: true, apellido: true } }
        }
      }),
      calcularElegibilidad(auth.user.id, cursoId),
      prisma.inscripcion.findUnique({
        where: { usuario_id_curso_id: { usuario_id: auth.user.id, curso_id: cursoId } },
        select: { certificado_habilitado: true }
      }),
      prisma.curso.findUnique({
        where: { id: cursoId },
        select: {
          precio_certificado: true,
          titulo: true,
          numero_asesor: true,
          modo_certificado: true,
          certificacion_habilitada: true
        }
      })
    ])

    const precioCert = curso?.precio_certificado ? Number(curso.precio_certificado) : null
    const pagoPendiente = precioCert && precioCert > 0 && !inscripcion?.certificado_habilitado

    return ApiResponse.success(request, {
      certificado: certificado
        ? {
            id: certificado.id,
            codigoVerificacion: certificado.codigo_verificacion,
            emitidoEn: certificado.emitido_en,
            cursoTitulo: certificado.curso.titulo,
            nombreCompleto: `${certificado.usuario.nombre} ${certificado.usuario.apellido}`,
            archivoPdf: (certificado.datos as any)?.archivo_pdf || null
          }
        : null,
      cursoTitulo: curso?.titulo ?? null,
      numeroAsesor: curso?.numero_asesor ?? null,
      modoCertificado: curso?.modo_certificado ?? 'AUTOMATICO',
      certificacionHabilitada: curso?.certificacion_habilitada ?? true,
      elegibilidad,
      pagoPendiente: pagoPendiente || false,
      precioCertificado: precioCert
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/estudiante/certificado
 * Genera un certificado validando progreso 100% y promedio de evaluaciones
 * Body: { cursoId: string }
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { cursoId } = await request.json()

    if (!cursoId) {
      return ApiResponse.error(request, 'El ID del curso es requerido', 400)
    }

    // 1. Verificar inscripción activa
    const [inscripcion, curso] = await Promise.all([
      prisma.inscripcion.findUnique({
        where: { usuario_id_curso_id: { usuario_id: auth.user.id, curso_id: cursoId } }
      }),
      prisma.curso.findUnique({
        where: { id: cursoId },
        select: { precio_certificado: true, codigo: true, slug: true, certificacion_habilitada: true }
      })
    ])

    if (!inscripcion || inscripcion.estado !== 'ACTIVO') {
      return ApiResponse.error(request, 'No estás inscrito en este curso', 403)
    }

    // 1a. Verificar que la certificación esté habilitada para este curso
    if (curso && !curso.certificacion_habilitada) {
      return ApiResponse.error(
        request,
        'La certificación de este curso aún no está habilitada. Contacta al administrador.',
        403
      )
    }

    // 1b. Verificar pago del certificado si aplica
    const precioCert = curso?.precio_certificado ? Number(curso.precio_certificado) : null

    if (precioCert && precioCert > 0 && !inscripcion.certificado_habilitado) {
      return ApiResponse.error(
        request,
        'El certificado de este curso requiere un pago previo. Comunícate con nosotros para habilitarlo.',
        403
      )
    }

    // 2. Verificar elegibilidad (progreso + promedio de evaluaciones)
    const elegibilidad = await calcularElegibilidad(auth.user.id, cursoId)

    if (elegibilidad.progreso < 100) {
      return ApiResponse.error(request, 'Debes completar todas las lecciones del curso', 403)
    }

    if (elegibilidad.totalExamenes > 0 && elegibilidad.promedioScore < elegibilidad.promedioMinimo) {
      const notaPromedio = Math.round((elegibilidad.promedioScore / 100) * 20 * 10) / 10
      const notaMinima = Math.round((elegibilidad.promedioMinimo / 100) * 20 * 10) / 10

      return ApiResponse.error(
        request,
        `Tu promedio de evaluaciones es ${notaPromedio}/20. Necesitas al menos ${notaMinima}/20 para obtener el certificado.`,
        403
      )
    }

    // 3. Verificar si ya existe un certificado
    const certificadoExistente = await prisma.certificado.findUnique({
      where: { usuario_id_curso_id: { usuario_id: auth.user.id, curso_id: cursoId } }
    })

    if (certificadoExistente) {
      return ApiResponse.success(request, {
        certificado: {
          id: certificadoExistente.id,
          codigoVerificacion: certificadoExistente.codigo_verificacion,
          emitidoEn: certificadoExistente.emitido_en
        },
        mensaje: 'Ya tienes un certificado para este curso'
      })
    }

    // 4. Capturar datos del curso y usuario para el snapshot
    const [cursoData, usuarioData] = await Promise.all([
      prisma.curso.findUnique({
        where: { id: cursoId },
        include: {
          profesor: { select: { nombre: true, apellido: true, cargo: true, firma: true } }
        }
      }),
      prisma.usuario.findUnique({
        where: { id: auth.user.id },
        select: { nombre: true, apellido: true }
      })
    ])

    if (!cursoData) {
      return ApiResponse.error(request, 'Curso no encontrado', 404)
    }

    // 5. Generar código de verificación único: {CODIGO_CURSO}-{YYMMDD}-{NNNNNN}
    const ahora = new Date()

    const codigoCurso =
      cursoData?.codigo || cursoData?.slug?.slice(0, 12).toUpperCase() || cursoId.slice(0, 8).toUpperCase()

    let numeroSecuencial = (await contarCertificadosCurso(cursoId)) + 1
    let codigoVerificacion = formatearCodigoCertificado(codigoCurso, ahora, numeroSecuencial)

    const datosSnapshot = {
      curso: {
        titulo: cursoData.titulo,
        duracion: cursoData.duracion,
        nivel: cursoData.nivel,
        tipo_emision: cursoData.tipo_emision,
        fecha_inicio: cursoData.fecha_inicio
      },
      usuario: { nombre: usuarioData?.nombre ?? '', apellido: usuarioData?.apellido ?? '' },
      profesor: {
        nombre: cursoData.profesor.nombre,
        apellido: cursoData.profesor.apellido,
        cargo: cursoData.profesor.cargo,
        firma: cursoData.profesor.firma
      },
      fechas: {
        inicio_curso: cursoData.tipo_emision === 'SINCRONO' ? cursoData.fecha_inicio : inscripcion.inscrito_en,
        culminacion: inscripcion.completado_en || new Date(),
        emision: new Date()
      }
    }

    let certificado

    for (let intento = 0; intento < 3; intento++) {
      try {
        certificado = await prisma.certificado.create({
          data: {
            usuario_id: auth.user.id,
            curso_id: cursoId,
            codigo_verificacion: codigoVerificacion,
            datos: datosSnapshot as any
          },
          include: {
            curso: { select: { titulo: true } },
            usuario: { select: { nombre: true, apellido: true } }
          }
        })
        break
      } catch (error: any) {
        if (error?.code === 'P2002' && intento < 2) {
          numeroSecuencial += 1
          codigoVerificacion = formatearCodigoCertificado(codigoCurso, ahora, numeroSecuencial)
          continue
        }
        
        throw error
      }
    }

    if (!certificado) {
      throw new Error('No se pudo generar un código de verificación único para el certificado')
    }

    return ApiResponse.success(
      request,
      {
        certificado: {
          id: certificado.id,
          codigoVerificacion: certificado.codigo_verificacion,
          emitidoEn: certificado.emitido_en,
          cursoTitulo: certificado.curso.titulo,
          nombreCompleto: `${certificado.usuario.nombre} ${certificado.usuario.apellido}`,
          archivoPdf: (certificado.datos as any)?.archivo_pdf || null
        }
      },
      201
    )
  } catch (error) {
    return handleApiError(error, request)
  }
}
