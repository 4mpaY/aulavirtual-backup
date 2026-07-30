import { promises as fs } from 'fs'
import path from 'path'

import prisma from '@/utils/libs/prisma'
import { getConfigs } from '@/utils/libs/config'
import { buildCertificadoData } from './buildCertificadoData'
import { getGenerator } from './generators'

export async function getPdfBuffer(
  certificadoId: string,
  reqUrl: URL,
  previewFlag = false,
  forceDynamic = false
): Promise<{ buffer: Buffer; filename: string }> {
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
            fecha_fin: true,
            vigencia_meses: true,
            tipo_emision: true,
            profesor: {
              select: { nombre: true, apellido: true, cargo: true, firma: true }
            }
          }
        },
        usuario: { select: { nombre: true, apellido: true } }
      }
    }),
    getConfigs()
  ])

  if (!certificado) {
    throw new Error('Certificado no encontrado')
  }

  const snapshot = certificado.datos as any
  const filename = `certificado-${certificado.codigo_verificacion}.pdf`

  // 1. Si existe archivo_pdf subido estáticamente y no se fuerza dinámico, cargarlo desde el disco
  if (!forceDynamic && snapshot?.archivo_pdf) {
    const filePath = path.join(process.cwd(), 'public', snapshot.archivo_pdf)

    try {
      const buffer = await fs.readFile(filePath)

      
return { buffer, filename }
    } catch (e) {
      console.error(`Archivo PDF estático no encontrado en ${filePath}, se generará dinámicamente:`, e)
    }
  }

  // 2. Carga secundaria para generación dinámica
  const [inscripcion, usuarioCompleto, intentosExamen, modulosCurso] = await Promise.all([
    prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: certificado.usuario_id,
          curso_id: certificado.curso_id
        }
      },
      select: { completado_en: true, inscrito_en: true, nota_final: true }
    }),
    prisma.usuario.findUnique({
      where: { id: certificado.usuario_id },
      select: { avatar: true }
    }),
    prisma.intentoExamen.findMany({
      where: {
        usuario_id: certificado.usuario_id,
        esta_aprobado: true,
        examen: { curso_id: certificado.curso_id, modulo_id: { not: null } }
      },
      select: { puntaje: true, examen: { select: { modulo_id: true, peso: true } } },
      orderBy: { enviado_en: 'desc' }
    }),
    prisma.modulo.findMany({
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
  ])

  const cursoFechaFin = certificado.curso.fecha_fin

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

  return { buffer: Buffer.from(pdfBuffer), filename }
}
