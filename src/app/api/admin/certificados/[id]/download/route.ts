import { NextResponse } from 'next/server'

import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import { buildCertificadoData } from '@/app/api/_shared/certificados/buildCertificadoData'
import { getGenerator } from '@/app/api/_shared/certificados/generators'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized || auth.user.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { id } = params
    const reqUrl = new URL(request.url)
    const previewFlag = reqUrl.searchParams.get('preview') === 'true'

    // ── Carga paralela principal ──────────────────────────────────────
    const [certificado, configs] = await Promise.all([
      prisma.certificado.findUnique({
        where: { id },
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
                select: { nombre: true, apellido: true, cargo: true, firma: true }
              }
            }
          },
          ruta: {
            select: {
              id: true,
              titulo: true,
              slug: true
            }
          },
          usuario: { select: { nombre: true, apellido: true } }
        }
      }),
      getConfigs()
    ])

    if (!certificado) {
      return NextResponse.json({ error: 'Certificado no encontrado' }, { status: 404 })
    }

    const isRuta = !certificado.curso_id
    const cursoIdStr = (certificado.curso_id || '') as string

    // ── Carga secundaria ──────────────────────────────────────────────
    const [inscripcion, usuarioCompleto, intentosExamen, modulosCurso] = await Promise.all([
      !isRuta
        ? prisma.inscripcion.findUnique({
            where: {
              usuario_id_curso_id: {
                usuario_id: certificado.usuario_id,
                curso_id: cursoIdStr
              }
            },
            select: { completado_en: true, inscrito_en: true, nota_final: true }
          })
        : Promise.resolve(null),
      prisma.usuario.findUnique({
        where: { id: certificado.usuario_id },
        select: { avatar: true }
      }),
      !isRuta
        ? prisma.intentoExamen.findMany({
            where: {
              usuario_id: certificado.usuario_id,
              esta_aprobado: true,
              examen: { curso_id: cursoIdStr, modulo_id: { not: null } }
            },
            select: {
              puntaje: true,
              examen: { select: { modulo_id: true, peso: true } }
            },
            orderBy: { enviado_en: 'desc' }
          })
        : Promise.resolve([]),
      !isRuta
        ? prisma.modulo.findMany({
            where: { curso_id: cursoIdStr },
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
        : Promise.resolve([])
    ])

    // fecha_fin del curso
    const cursoFechaFin = !isRuta
      ? (await prisma.curso.findUnique({
          where: { id: cursoIdStr },
          select: { fecha_fin: true }
        }))?.fecha_fin ?? null
      : null

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
      certificado: {
        ...certificado,
        curso: isRuta ? null : { ...certificado.curso, modulos: modulosCurso }
      } as any,
      configs,
      inscripcion,
      usuarioAvatar: usuarioCompleto?.avatar,
      intentosExamen: intentosExamen as any[],
      cursoFechaFin,
      reqUrl,
      previewFlag
    })

    // Inyectar gerente (requiere query adicional que hacemos aquí)
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
