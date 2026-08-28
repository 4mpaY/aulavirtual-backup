export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { buildCertificadoData } from '@/app/api/_shared/certificados/buildCertificadoData'
import { getConfigs } from '@/utils/libs/config'
import { getGenerator } from '@/app/api/_shared/certificados/generators'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'

/**
 * GET /api/estudiante/certificado/[certificadoId]/pdf
 * Descarga el PDF del certificado (Estudiante).
 * La plantilla se resuelve desde la configuración CERTIFICADO_PLANTILLA.
 */
export async function GET(request: Request, { params }: { params: { certificadoId: string } }) {
  try {
    await requireAuth(request)

    // if (!auth.authorized) return auth.error

    const { certificadoId } = params
    const reqUrl = new URL(request.url)
    const previewFlag = reqUrl.searchParams.get('preview') === 'true'

    // ── Carga paralela principal ──────────────────────────────────────
    const [certificado, configs] = await Promise.all([
      prisma.certificado.findUnique({
        where: { id: certificadoId },
        include: {
          curso: {
            select: {
              titulo: true,
              duracion: true,
              nivel: true,
              fecha_inicio: true,
              vigencia_meses: true,
              tipo_emision: true,
              profesor: {
                select: { nombre: true, apellido: true, cargo: true, firma: true, codigo_instructor_nsc: true }
              }
            }
          },
          usuario: { select: { nombre: true, apellido: true, licencia: true, equipo_opera: true, empresa: true, ciudad: true, pais: true, foto_auto: true } }
        }
      }),
      getConfigs()
    ])

    if (!certificado) {
      return NextResponse.json({ error: 'Certificado no encontrado' }, { status: 404 })
    }

    // ── Verificar ownership ──────────────────────────────────────────
    // if (certificado.usuario_id !== auth.user.id && auth.user.rol !== 'ADMIN') {
    //   return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    // }

    // ── Carga secundaria ──────────────────────────────────────────────
    const [inscripcion, usuarioCompleto, intentosExamen, modulosCurso, cursoDetalle] = await Promise.all([
      certificado.usuario_id && certificado.curso_id
        ? prisma.inscripcion.findUnique({
            where: {
              usuario_id_curso_id: {
                usuario_id: certificado.usuario_id,
                curso_id: certificado.curso_id
              }
            },
            select: { completado_en: true, inscrito_en: true, nota_final: true }
          })
        : null,
      certificado.usuario_id
        ? prisma.usuario.findUnique({
            where: { id: certificado.usuario_id },
            select: { avatar: true }
          })
        : null,
      certificado.usuario_id && certificado.curso_id
        ? prisma.intentoExamen.findMany({
            where: {
              usuario_id: certificado.usuario_id,
              esta_aprobado: true,
              examen: { curso_id: certificado.curso_id, modulo_id: { not: null } }
            },
            select: { puntaje: true, examen: { select: { modulo_id: true, peso: true } } },
            orderBy: { enviado_en: 'desc' }
          })
        : [],
      certificado.curso_id
        ? prisma.modulo.findMany({
            where: { curso_id: certificado.curso_id },
            orderBy: { orden: 'asc' },
            select: {
              id: true,
              titulo: true,
              orden: true,
              lecciones: {
                orderBy: { orden: 'asc' },
                select: { id: true, titulo: true, orden: true, duracion: true }
              }
            }
          })
        : [],
      certificado.curso_id
        ? prisma.curso.findUnique({
            where: { id: certificado.curso_id },
            select: { fecha_fin: true }
          })
        : null
    ])

    const cursoFechaFin = cursoDetalle?.fecha_fin ?? null

    // ── Gerente General ───────────────────────────────────────────────
    const gerenteGeneralId = configs.CERTIFICADO_GERENTE_GENERAL_ID

    const gerenteGeneral = gerenteGeneralId
      ? await prisma.usuario.findUnique({
          where: { id: gerenteGeneralId },
          select: { nombre: true, apellido: true, cargo: true, firma: true }
        })
      : null

    // ── Construir datos del certificado ───────────────────────────────
    const certData = await buildCertificadoData({
      certificado: { ...certificado, curso: { ...certificado.curso, modulos: modulosCurso } } as any,
      configs,
      inscripcion,
      usuarioAvatar: usuarioCompleto?.avatar,
      intentosExamen,
      cursoFechaFin,
      reqUrl,
      previewFlag
    })

    certData.gerenteGeneral = gerenteGeneral

    // ── Seleccionar plantilla y generar PDF ───────────────────────────
    const plantilla = configs.CERTIFICADO_PLANTILLA || 'clasico'
    const generarPDF = getGenerator(plantilla)
    const pdfBuffer = await generarPDF(certData)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${previewFlag ? 'inline' : 'attachment'}; filename="certificado-${certificado.codigo_verificacion}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
