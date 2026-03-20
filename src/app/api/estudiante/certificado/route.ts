export const dynamic = 'force-dynamic'

import prisma from '@/utils/libs/prisma'

import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/estudiante/certificado?cursoId=xxx
 * Obtiene el certificado del usuario para un curso específico
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

    const certificado = await prisma.certificado.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: cursoId
        }
      },
      include: {
        curso: { select: { titulo: true } },
        usuario: { select: { nombre: true, apellido: true } }
      }
    })

    if (!certificado) {
      return ApiResponse.success(request, { certificado: null })
    }

    return ApiResponse.success(request, {
      certificado: {
        id: certificado.id,
        codigoVerificacion: certificado.codigo_verificacion,
        emitidoEn: certificado.emitido_en,
        cursoTitulo: certificado.curso.titulo,
        nombreCompleto: `${certificado.usuario.nombre} ${certificado.usuario.apellido}`
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/estudiante/certificado
 * Genera un certificado para el usuario (valida examen aprobado)
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

    // 1. Verificar inscripción
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: cursoId
        }
      }
    })

    if (!inscripcion || inscripcion.estado !== 'ACTIVO') {
      return ApiResponse.error(request, 'No estás inscrito en este curso', 403)
    }

    // 2. Verificar progreso 100%
    const progresoCurso = await prisma.progresoCurso.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: cursoId
        }
      }
    })

    if (!progresoCurso || progresoCurso.porcentaje_progreso < 100) {
      return ApiResponse.error(request, 'Debes completar todas las lecciones', 403)
    }

    // 3. Verificar que existe un examen aprobado
    const examenAprobado = await prisma.intentoExamen.findFirst({
      where: {
        usuario_id: auth.user.id,
        esta_aprobado: true,
        examen: {
          curso_id: cursoId
        }
      }
    })

    if (!examenAprobado) {
      return ApiResponse.error(request, 'Debes aprobar el examen antes de obtener tu certificado', 403)
    }

    // 4. Verificar si ya existe un certificado
    const certificadoExistente = await prisma.certificado.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: auth.user.id,
          curso_id: cursoId
        }
      }
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

    // 5. Generar código de verificación único
    const codigoVerificacion = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // 6. Crear certificado
    const certificado = await prisma.certificado.create({
      data: {
        usuario_id: auth.user.id,
        curso_id: cursoId,
        codigo_verificacion: codigoVerificacion
      },
      include: {
        curso: { select: { titulo: true } },
        usuario: { select: { nombre: true, apellido: true } }
      }
    })

    return ApiResponse.success(request, {
      certificado: {
        id: certificado.id,
        codigoVerificacion: certificado.codigo_verificacion,
        emitidoEn: certificado.emitido_en,
        cursoTitulo: certificado.curso.titulo,
        nombreCompleto: `${certificado.usuario.nombre} ${certificado.usuario.apellido}`
      }
    }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
