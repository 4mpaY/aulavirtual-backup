export const dynamic = 'force-dynamic'

import { readFile } from 'fs/promises'
import { join } from 'path'

import { NextResponse } from 'next/server'

import * as QRCode from 'qrcode'
import sharp from 'sharp'

import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getConfigs } from '@/utils/libs/config'

/** Convierte un color hex (#RRGGBB) a rgb [r, g, b] */
function hexToRgb(hex: string): [number, number, number] {
  try {
    const clean = hex.replace('#', '')
    const r = parseInt(clean.substring(0, 2), 16)
    const g = parseInt(clean.substring(2, 4), 16)
    const b = parseInt(clean.substring(4, 6), 16)

    return [isNaN(r) ? 30 : r, isNaN(g) ? 120 : g, isNaN(b) ? 70 : b]
  } catch {
    return [30, 120, 70]
  }
}

/** Intenta cargar una imagen (local o remota) y devuelve Buffer */
async function fetchImageBuffer(url: string | null): Promise<Buffer | null> {
  try {
    if (!url) return null

    if (url.startsWith('/')) {
      const cleanUrl = url.replace(/\/+/g, '/')
      const filePath = join(process.cwd(), 'public', cleanUrl)

      return await readFile(filePath)
    }

    const response = await fetch(url)

    if (!response.ok) return null

    return Buffer.from(await response.arrayBuffer())
  } catch {
    return null
  }
}

/**
 * GET /api/admin/certificados/[id]/download
 * Genera y descarga el PDF del certificado (solo ADMIN)
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const reqUrl = new URL(request.url)
    const currentHost = reqUrl.host

    // Cargar en paralelo
    const [certificado, configs] = await Promise.all([
      prisma.certificado.findUnique({
        where: { id: params.id },
        include: {
          curso: {
            select: {
              titulo: true,
              duracion: true,
              nivel: true,
              fecha_inicio: true,
              tipo_emision: true,
              profesor: {
                select: {
                  nombre: true,
                  apellido: true,
                  cargo: true,
                  firma: true
                }
              },
              modulos: {
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
              }
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

    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        usuario_id_curso_id: {
          usuario_id: certificado.usuario_id,
          curso_id: certificado.curso_id
        }
      },
      select: { completado_en: true, inscrito_en: true }
    })


    // Branding (Priorizar llaves específicas de certificado)
    const colorPrimario = configs.PRIMARY_COLOR_MAIN ?? '#131FF2'

    const logoUrl = configs.TEMPLATE_LOGO || '/images/logo.png'
    const nombreInstitucion = configs.CERTIFICADO_INSTITUTION_NAME || configs.TEMPLATE_NAME || 'Aula Virtual'
    const slogan = configs.CERTIFICADO_SLOGAN || configs.TEMPLATE_SLOGAN || 'Capacitación Especializada'
    
    // OBTENCIÓN AUTOMÁTICA DEL DOMINIO: Priorizamos config manual, luego host actual
    const linkInstitucion = configs.CERTIFICADO_INSTITUTION_URL || configs.SETTINGS_INSTITUTION_URL || currentHost

    const [pr, pg, pb] = hexToRgb(colorPrimario)

    const goldColor: [number, number, number] = [184, 134, 11]

    const appUrl = `${reqUrl.protocol}//${reqUrl.host}`
    const verifyUrl = `${appUrl}/verificar-certificado/${certificado.codigo_verificacion}`

    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 120,
      margin: 1,
      color: { dark: colorPrimario, light: '#ffffff' }
    })

    const logoBuffer = logoUrl ? await fetchImageBuffer(logoUrl) : null

    // Gerente General
    const gerenteGeneralId = configs.CERTIFICADO_GERENTE_GENERAL_ID

    const gerenteGeneral = gerenteGeneralId
      ? await prisma.usuario.findUnique({
          where: { id: gerenteGeneralId },
          select: { nombre: true, apellido: true, cargo: true, firma: true }
        })
      : null

    // ================================================================
    const { jsPDF } = await import('jspdf')

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // ── DATOS DEL CERTIFICADO (snapshot) ──
    const snapshot = certificado.datos as any

    const nombreCompleto = (snapshot?.usuario?.nombre && snapshot?.usuario?.apellido)
      ? `${snapshot.usuario.nombre} ${snapshot.usuario.apellido}`
      : `${certificado.usuario.nombre} ${certificado.usuario.apellido}`

    const cursoTitulo = snapshot?.curso?.titulo || certificado.curso.titulo
    const cursoNivel = snapshot?.curso?.nivel || certificado.curso.nivel
    const cursoModalidad = snapshot?.curso?.tipo_emision || certificado.curso.tipo_emision
    const cursoDuracion = snapshot?.curso?.duracion || certificado.curso.duracion
    const modalidad = cursoModalidad === 'ASINCRONO' ? 'VIRTUAL ASÍNCRONO' : 'PRESENCIAL/VIRTUAL'

    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return '---'
      return new Date(date).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    const fechaEmisionVal = snapshot?.fechas?.emision || certificado.emitido_en
    const fechaInicioVal = snapshot?.fechas?.inicio_curso
      || (certificado.curso.tipo_emision === 'SINCRONO'
        ? certificado.curso.fecha_inicio
        : (inscripcion?.inscrito_en || certificado.emitido_en))
    const fechaFinVal = snapshot?.fechas?.culminacion || (inscripcion?.completado_en || certificado.emitido_en)

    const fechaEmisionStr = formatDate(fechaEmisionVal)
    const profesorSnapshot = snapshot?.profesor || certificado.curso.profesor

    const formatDateLong = (date: Date | string | null | undefined) => {
      if (!date) return '---'
      return new Date(date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    // Base64 del logo (precomputado)
    let base64Logo: string | null = null
    if (logoBuffer) {
      try {
        const ext = logoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() ?? 'PNG'
        base64Logo = `data:image/${ext.toLowerCase()};base64,${logoBuffer.toString('base64')}`
      } catch { /* skip */ }
    }

    // Variante oscura del color primario (para el gradiente del panel)
    const dpR = Math.round(pr * 0.52)
    const dpG = Math.round(pg * 0.52)
    const dpB = Math.round(pb * 0.52)

    // ── FUNCIÓN: bloque de firma ──
    const addSignatureBlock = async (x: number, lineY: number, user: any) => {
      if (!user) return

      // Imagen de firma — 34×34mm cuadrado, 0mm sobre la línea
      if (user.firma) {
        try {
          const signatureBuffer = await fetchImageBuffer(user.firma)
          if (signatureBuffer) {
            const sigExt = user.firma.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'png'
            doc.addImage(signatureBuffer, sigExt.toUpperCase(), x - 17, lineY - 34, 34, 34)
          }
        } catch { /* skip */ }
      }

      // Línea horizontal
      doc.setDrawColor(50, 50, 50)
      doc.setLineWidth(0.5)
      doc.line(x - 36, lineY, x + 36, lineY)

      // Nombre completo
      const nombreFirmante = `${user.nombre || ''} ${user.apellido || ''}`.trim()
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(25, 25, 25)
      doc.text(nombreFirmante, x, lineY + 7, { align: 'center' })

      // Cargo (si existe)
      if (user.cargo) {
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(80, 80, 80)
        doc.text(user.cargo, x, lineY + 13, { align: 'center' })
      }
    }

    // ── PÁGINA 1 ─────────────────────────────────────────────────────────
    const panelW = 72
    const contentW = pageWidth - panelW   // ~225mm
    const cx = contentW / 2              // ~112.5mm

    // ── PANEL LATERAL DERECHO ──

    // 1. Fondo blanco completo
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // 2. Gradiente del panel: saturado arriba (primary + 12% blanco) → muy oscuro abajo
    const gradStrips = 70
    for (let i = 0; i < gradStrips; i++) {
      const t = i / (gradStrips - 1)
      const r = Math.round(pr + (255 - pr) * 0.12 - (pr + (255 - pr) * 0.12 - dpR) * t)
      const g = Math.round(pg + (255 - pg) * 0.12 - (pg + (255 - pg) * 0.12 - dpG) * t)
      const b = Math.round(pb + (255 - pb) * 0.12 - (pb + (255 - pb) * 0.12 - dpB) * t)
      doc.setFillColor(
        Math.max(0, Math.min(255, r)),
        Math.max(0, Math.min(255, g)),
        Math.max(0, Math.min(255, b))
      )
      const sy = (i / gradStrips) * pageHeight
      doc.rect(contentW, sy, panelW, pageHeight / gradStrips + 0.5, 'F')
    }

    // 3. Ribbons diagonales rellenos (paths bezier cerrados — sin trazos, sin artefactos)
    const ribR1 = Math.round(pr + (255 - pr) * 0.28)
    const ribG1 = Math.round(pg + (255 - pg) * 0.28)
    const ribB1 = Math.round(pb + (255 - pb) * 0.28)
    doc.setFillColor(ribR1, ribG1, ribB1)
    doc.lines(
      [[21, 22, 41, 68, 60, 96], [0, 24], [-19, -12, -39, -48, -60, -96], [0, -24]],
      237, 0, [1, 1], 'F', true
    )

    const ribR2 = Math.round(pr + (255 - pr) * 0.14)
    const ribG2 = Math.round(pg + (255 - pg) * 0.14)
    const ribB2 = Math.round(pb + (255 - pb) * 0.14)
    doc.setFillColor(ribR2, ribG2, ribB2)
    doc.lines(
      [[20, 18, 41, 62, 60, 88], [0, 32], [-19, -4, -39, -42, -60, -98], [0, -22]],
      237, 90, [1, 1], 'F', true
    )

    // 4. QR esquina inferior del panel
    const qrSz = 30
    const qrX0 = contentW + (panelW - qrSz) / 2
    const qrY0 = pageHeight - qrSz - 12
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(qrX0 - 3, qrY0 - 3, qrSz + 6, qrSz + 6, 2, 2, 'F')
    doc.addImage(qrDataUrl, 'PNG', qrX0, qrY0, qrSz, qrSz)
    doc.setFontSize(5)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'normal')
    doc.text('Escanea para verificar', contentW + panelW / 2, pageHeight - 7, { align: 'center' })

    // 5. Repisar el área de contenido izquierda en blanco (cubre posibles desbordes)
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, contentW, pageHeight, 'F')

    // 6. Texto "CERTIFICADO" rotado vertical — se dibuja DESPUÉS del rect blanco
    const vtR = Math.round(pr + (255 - pr) * 0.22)
    const vtG = Math.round(pg + (255 - pg) * 0.22)
    const vtB = Math.round(pb + (255 - pb) * 0.22)
    doc.setFontSize(40)
    doc.setTextColor(vtR, vtG, vtB)
    doc.setFont('helvetica', 'bold')
    const certTxtW = doc.getTextWidth('CERTIFICADO')
    const panelCx = contentW + panelW / 2
    doc.text('CERTIFICADO', panelCx, pageHeight / 2 + certTxtW / 2, { angle: 90 })

    // ── ÁREA DE CONTENIDO ──────────────────────────────────────────────

    // ── ENCABEZADO: solo logo centrado, proporciones reales ──
    let y = 10
    const maxLogoH = 22
    const maxLogoW = 60
    let logoDisplayW = maxLogoH
    let logoDisplayH = maxLogoH

    if (logoBuffer) {
      try {
        const meta = await sharp(logoBuffer).metadata()
        if (meta.width && meta.height) {
          const ratio = meta.width / meta.height
          logoDisplayH = maxLogoH
          logoDisplayW = Math.min(logoDisplayH * ratio, maxLogoW)
          if (logoDisplayW === maxLogoW) logoDisplayH = maxLogoW / ratio
        }
      } catch { /* usar tamaño por defecto */ }
    }

    if (base64Logo) {
      try {
        const ext = logoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() ?? 'PNG'
        doc.addImage(base64Logo, ext, cx - logoDisplayW / 2, y, logoDisplayW, logoDisplayH)
      } catch { /* skip */ }
    }

    y += logoDisplayH + 8

    // ── CERTIFICADO ──
    doc.setFontSize(38)
    doc.setTextColor(18, 18, 18)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICADO', cx, y, { align: 'center' })
    y += 9

    doc.setFontSize(13)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('Otorgado a:', cx, y, { align: 'center' })
    y += 10

    // ── Nombre del alumno ──
    doc.setFontSize(26)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    const nameStr = nombreCompleto.toUpperCase()
    doc.text(nameStr, cx, y, { align: 'center' })
    y += 11

    doc.setFontSize(13)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text('Por haber concluido y aprobado con éxito el curso de especialización de:', cx, y, { align: 'center' })
    y += 10

    // ── Título del curso ──
    doc.setFontSize(17)
    doc.setTextColor(15, 15, 15)
    doc.setFont('helvetica', 'bold')
    const cursoLines = doc.splitTextToSize(cursoTitulo, contentW - 34)
    doc.text(cursoLines, cx, y, { align: 'center' })
    y += cursoLines.length * 7 + 6

    // ── Párrafo descriptivo ──
    doc.setFontSize(13)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    const fechaInicioLarga = formatDateLong(fechaInicioVal)
    const fechaFinLarga = formatDateLong(fechaFinVal)
    const descripcionTxt = `Emitido por ${nombreInstitucion}, con una duración de ${cursoDuracion || '---'} horas académicas, realizado desde el ${fechaInicioLarga} hasta el ${fechaFinLarga}.`
    const descripcionLines = doc.splitTextToSize(descripcionTxt, contentW - 40)
    doc.text(descripcionLines, cx, y, { align: 'center' })
    y += descripcionLines.length * 6 + 4

    doc.setFontSize(13)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    const porcuantoTxt = 'Por cuanto: Para que conste y sea reconocido, se otorga el presente diploma en calidad de:'
    const porcuantoLines = doc.splitTextToSize(porcuantoTxt, contentW - 40)
    doc.text(porcuantoLines, cx, y, { align: 'center' })
    y += porcuantoLines.length * 6 + 5

    // ── APROBADO ──
    doc.setFontSize(14)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    doc.text('APROBADO', cx, y, { align: 'center' })
    const aprobadoW = doc.getTextWidth('APROBADO')
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(0.4)
    doc.line(cx - aprobadoW / 2 - 10, y - 1.5, cx - aprobadoW / 2 - 2, y - 1.5)
    doc.line(cx + aprobadoW / 2 + 2, y - 1.5, cx + aprobadoW / 2 + 10, y - 1.5)
    y += 8

    const fechaFirmadaTxt = new Date(fechaEmisionVal).toLocaleDateString('es-PE', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
    doc.setFontSize(13)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(`Firmado, el ${fechaFirmadaTxt}.`, cx, y, { align: 'center' })
    y += 12

    // ── Bloques de firma ──
    const hasGerente = gerenteGeneral !== null
    const mostrarFirmaDocente = configs.CERTIFICADO_MOSTRAR_FIRMA_DOCENTE !== 'false'
    if (hasGerente && mostrarFirmaDocente) {
      await addSignatureBlock(cx - 54, y + 38, gerenteGeneral)
      await addSignatureBlock(cx + 54, y + 38, profesorSnapshot)
    } else if (hasGerente) {
      await addSignatureBlock(cx, y + 38, gerenteGeneral)
    } else if (mostrarFirmaDocente) {
      await addSignatureBlock(cx, y + 38, profesorSnapshot)
    }

    // ── Footer ──
    const footerY1 = pageHeight - 10
    const footerY2 = pageHeight - 6
    doc.setFontSize(8)
    doc.setTextColor(160, 160, 160)
    doc.setFont('helvetica', 'normal')
    doc.text(`Certificado Id: ${certificado.id}`, 16, footerY1)
    doc.text(`Fecha de Emisión: ${fechaFirmadaTxt}`, 16, footerY2)

    const preview = reqUrl.searchParams.get('preview') === 'true'

    // ── PÁGINA 2: CONTENIDO ACADÉMICO ──
    doc.addPage()
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Borde Dorado (Igual que Pág 1)
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
    doc.setLineWidth(0.5)
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

    // Cabecera de Página 2 (Minimizada pero Premium)
    if (logoBuffer) {
      try {
        const ext = logoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() ?? 'PNG'
        const base64Logo = `data:image/${ext.toLowerCase()};base64,${logoBuffer.toString('base64')}`

        doc.setFillColor(252, 252, 252)
        doc.roundedRect(14, 12, 12, 10, 1, 1, 'F')
        doc.addImage(base64Logo, 'PNG', 15, 12.5, 10, 9)
      } catch (err) { console.error('Logo Error P2:', err) }
    }

    doc.setFontSize(10)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    doc.text(nombreInstitucion.toUpperCase(), 28, 16)
    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.text('Link de Plataforma:', pageWidth - 14, 16, { align: 'right' })
    doc.setTextColor(pr, pg, pb)
    doc.text(linkInstitucion, pageWidth - 14, 20, { align: 'right' })

    // Título de la Sección
    doc.setFillColor(pr, pg, pb)
    doc.rect(14, 26, pageWidth - 28, 12, 'F')
    doc.setFontSize(16)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('CONTENIDO DEL PROGRAMA ACADÉMICO', pageWidth / 2, 34, { align: 'center' })

    doc.setFontSize(12)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    const cursoTituloLines = doc.splitTextToSize(cursoTitulo, pageWidth - 40)

    doc.text(cursoTituloLines, pageWidth / 2, 45, { align: 'center' })

    // Listado de Módulos (Grid Mejorado)
    const yPos = 55
    const modulos = certificado.curso.modulos ?? []

    if (modulos.length > 0) {
      const colWidth = (pageWidth - 40) / 2
      let col = 0
      let yLeft = yPos
      let yRight = yPos
      
      for (let mi = 0; mi < modulos.length; mi++) {
        const modulo = modulos[mi]
        const currentY = col === 0 ? yLeft : yRight
        const currentX = col === 0 ? 18 : 22 + colWidth

        // Salto de página preventivo si el módulo es muy largo
        if (currentY > 175) {
          doc.addPage()
          doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
          doc.setLineWidth(0.5)
          doc.rect(10, 10, pageWidth - 20, pageHeight - 20)
          yLeft = 20
          yRight = 20
          col = 0

          // continue // Evitar continuar para no saltar el módulo actual
        }

        // Header del Módulo
        doc.setFillColor(pr, pg, pb)
        doc.roundedRect(currentX, currentY, colWidth - 4, 8, 1, 1, 'F')
        doc.setFontSize(9)
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        const moduloTituloStr = `${modulo.orden}. ${modulo.titulo}`.toUpperCase()
        const moduloTitulo = doc.splitTextToSize(moduloTituloStr, colWidth - 12)

        doc.text(moduloTitulo, currentX + 4, currentY + 5.5)

        let yLeccion = currentY + 13

        for (const leccion of modulo.lecciones) {
          if (yLeccion > 190) break
          
          doc.setFontSize(8)
          doc.setTextColor(60, 60, 60)
          doc.setFont('helvetica', 'normal')
          
          const leccionTxt = `${modulo.orden}.${leccion.orden} ${leccion.titulo}`
          const leccionLines = doc.splitTextToSize(leccionTxt, colWidth - 16)
          
          // Bullet point
          doc.setFillColor(goldColor[0], goldColor[1], goldColor[2])
          doc.circle(currentX + 4.5, yLeccion + 1, 0.8, 'F')
          
          doc.text(leccionLines, currentX + 7, yLeccion + 2)
          yLeccion += leccionLines.length * 4.5
        }
        
        yLeccion += 4
        
        if (col === 0) yLeft = yLeccion
        else yRight = yLeccion
        
        // Alternar columnas (simple toggle)
        col = (col === 0) ? 1 : 0
      }
    }

    // Pie de Página 2
    doc.setDrawColor(230, 230, 230)
    doc.setLineWidth(0.2)
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15)

    doc.setFontSize(7)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.text(`Certificado de Finalización: ${nombreCompleto}`, 14, pageHeight - 10)
    doc.text(`Código de Verificación: ${certificado.codigo_verificacion}`, pageWidth - 14, pageHeight - 10, { align: 'right' })

    const pdfArrayBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${preview ? 'inline' : 'attachment'}; filename="certificado-${certificado.codigo_verificacion}.pdf"`,
        'Content-Length': pdfArrayBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
