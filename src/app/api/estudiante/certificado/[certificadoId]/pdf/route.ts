export const dynamic = 'force-dynamic'

import { readFile } from 'fs/promises'
import { join } from 'path'

import { NextResponse } from 'next/server'

import * as QRCode from 'qrcode'

import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
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
 * GET /api/estudiante/certificado/[certificadoId]/pdf
 * Genera y descarga el PDF del certificado (Estudiante)
 */
export async function GET(request: Request, { params }: { params: { certificadoId: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { certificadoId } = params

    const reqUrl = new URL(request.url)
    const currentHost = reqUrl.host

    // Cargar en paralelo
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

    if (certificado.usuario_id !== auth.user.id && auth.user.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

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

      // Imagen de firma encima de la línea
      if (user.firma) {
        try {
          const signatureBuffer = await fetchImageBuffer(user.firma)
          if (signatureBuffer) {
            const sigExt = user.firma.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'png'
            doc.addImage(signatureBuffer, sigExt.toUpperCase(), x - 22, lineY - 14, 44, 12)
          }
        } catch { /* skip */ }
      }

      // Línea horizontal
      doc.setDrawColor(50, 50, 50)
      doc.setLineWidth(0.5)
      doc.line(x - 36, lineY, x + 36, lineY)

      // Cargo en negrita
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(25, 25, 25)
      doc.text(user.cargo || 'Funcionario', x, lineY + 7, { align: 'center' })

      // Institución
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      const instSigLines = doc.splitTextToSize(nombreInstitucion, 72)
      instSigLines.forEach((ln: string, i: number) => {
        doc.setTextColor(120, 120, 120)
        doc.text(ln, x, lineY + 14 + i * 4, { align: 'center' })
      })
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
    //    para que esté siempre visible dentro del panel
    const vtR = Math.round(pr + (255 - pr) * 0.22)
    const vtG = Math.round(pg + (255 - pg) * 0.22)
    const vtB = Math.round(pb + (255 - pb) * 0.22)
    const panelCx = contentW + panelW / 2   // centro horizontal del panel = 261mm
    doc.setFontSize(40)
    doc.setTextColor(vtR, vtG, vtB)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICADO', panelCx, pageHeight * 0.52, { angle: 90, align: 'center' })

    // ── ÁREA DE CONTENIDO ──────────────────────────────────────────────

    // Borde interior decorativo (marco premium)
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(0.35)
    doc.rect(8, 8, contentW - 16, pageHeight - 16)
    // Línea interior doble (offset 2mm)
    doc.setLineWidth(0.15)
    doc.rect(10, 10, contentW - 20, pageHeight - 20)

    // ── ENCABEZADO: logo superior izquierda + nombre institución ──
    let y = 15
    const logoW = 15, logoH = 15
    const logoX = 16
    const hTextX = logoX + logoW + 4  // texto a la derecha del logo

    if (base64Logo) {
      try {
        doc.addImage(base64Logo, 'PNG', logoX, y, logoW, logoH)
      } catch { /* skip */ }
    }

    // Nombre institución (en negro/oscuro, no primary)
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'bold')
    const instHLines = doc.splitTextToSize(nombreInstitucion, contentW - hTextX - 12)
    instHLines.forEach((ln: string, i: number) => {
      doc.text(ln, hTextX, y + 5 + i * 4.2)
    })

    // Slogan
    doc.setFontSize(7.5)
    doc.setTextColor(140, 140, 140)
    doc.setFont('helvetica', 'normal')
    doc.text(slogan, hTextX, y + 5 + instHLines.length * 4.2 + 2)

    y += Math.max(logoH, instHLines.length * 4.2 + 5 + 6) + 4

    // ── Línea divisoria horizontal debajo del encabezado ──
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(1.0)
    doc.line(14, y, contentW - 14, y)
    // segunda línea fina decorativa
    doc.setLineWidth(0.2)
    doc.line(14, y + 1.5, contentW - 14, y + 1.5)
    y += 13

    // ── CERTIFICADO ──
    doc.setFontSize(38)
    doc.setTextColor(18, 18, 18)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICADO', cx, y, { align: 'center' })
    y += 5

    // Línea ornamental bajo "CERTIFICADO"
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(1.2)
    doc.line(cx - 30, y, cx + 30, y)
    y += 8

    // "Otorgado a:"
    doc.setFontSize(8.5)
    doc.setTextColor(160, 160, 160)
    doc.setFont('helvetica', 'italic')
    doc.text('Otorgado a:', cx, y, { align: 'center' })
    y += 9

    // ── Nombre del alumno ── grande, color primario
    doc.setFontSize(22)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    const nameStr = nombreCompleto.toUpperCase()
    doc.text(nameStr, cx, y, { align: 'center' })
    y += 4

    // Línea decorativa bajo el nombre
    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(0.6)
    const nw = Math.min(doc.getTextWidth(nameStr) + 8, contentW - 42)
    doc.line(cx - nw / 2, y, cx + nw / 2, y)
    y += 9

    // "Por haber concluido..."
    doc.setFontSize(8.5)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    doc.text('Por haber concluido y aprobado con éxito el curso de especialización de:', cx, y, { align: 'center' })
    y += 9

    // ── Título del curso — negro bold ──
    doc.setFontSize(17)
    doc.setTextColor(15, 15, 15)
    doc.setFont('helvetica', 'bold')
    const cursoLines = doc.splitTextToSize(cursoTitulo, contentW - 34)
    doc.text(cursoLines, cx, y, { align: 'center' })
    y += cursoLines.length * 7.5 + 3

    // Línea de info: duración · modalidad · nivel
    doc.setFontSize(7.5)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `${cursoDuracion || '---'} horas lectivas  ·  ${modalidad}  ·  Nivel: ${cursoNivel}`,
      cx, y, { align: 'center' }
    )
    y += 7

    // ── Párrafo descriptivo ──
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(110, 110, 110)
    const fechaInicioLarga = formatDateLong(fechaInicioVal)
    const fechaFinLarga = formatDateLong(fechaFinVal)
    const descripcionTxt = `Emitido por ${nombreInstitucion}, con una duración de ${cursoDuracion || '---'} horas académicas, realizado desde el ${fechaInicioLarga} hasta el ${fechaFinLarga}.`
    const descripcionLines = doc.splitTextToSize(descripcionTxt, contentW - 40)
    doc.setTextColor(110, 110, 110)
    doc.text(descripcionLines, cx, y, { align: 'center' })
    y += descripcionLines.length * 4 + 4

    // "Por cuanto..."
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(110, 110, 110)
    const porcuantoTxt = 'Por cuanto: Para que conste y sea reconocido, se otorga el presente diploma en calidad de:'
    const porcuantoLines = doc.splitTextToSize(porcuantoTxt, contentW - 40)
    doc.setTextColor(110, 110, 110)
    doc.text(porcuantoLines, cx, y, { align: 'center' })
    y += porcuantoLines.length * 4 + 6

    // ── APROBADO — destacado, con líneas decorativas a los lados ──
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

    // "Firmado, el..."
    const fechaFirmadaTxt = new Date(fechaEmisionVal).toLocaleDateString('es-PE', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
    doc.setFontSize(8.5)
    doc.setTextColor(120, 120, 120)
    doc.setFont('helvetica', 'normal')
    doc.text(`Firmado, el ${fechaFirmadaTxt}.`, cx, y, { align: 'center' })
    y += 15

    // ── Bloques de firma ── centrado si uno solo, simétrico si dos
    const hasGerente = gerenteGeneral !== null
    const s1x = hasGerente ? cx - 54 : cx
    const s2x = cx + 54
    await addSignatureBlock(s1x, y + 16, profesorSnapshot)
    if (hasGerente) await addSignatureBlock(s2x, y + 16, gerenteGeneral)

    // ── Footer: Certificado ID + Fecha apilados en esquina inferior izquierda ──
    const footerY1 = pageHeight - 10
    const footerY2 = pageHeight - 6
    doc.setFontSize(6.5)
    doc.setTextColor(160, 160, 160)
    doc.setFont('helvetica', 'normal')
    doc.text(`Certificado Id: ${certificado.id}`, 16, footerY1)
    doc.text(`Fecha de Emisión: ${fechaFirmadaTxt}`, 16, footerY2)

    const previewFlag = reqUrl.searchParams.get('preview') === 'true'

    // ── PÁGINA 2: CONTENIDO ACADÉMICO ──
    doc.addPage()
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // Borde Dorado (Igual que Pág 1)
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
    doc.setLineWidth(0.5)
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

    // Cabecera de Página 2 (Minimizada pero Premium)
    if (base64Logo) {
      try {
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
        
        // Alternar columnas
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
        'Content-Disposition': `${previewFlag ? 'inline' : 'attachment'}; filename="certificado-${certificado.codigo_verificacion}.pdf"`,
        'Content-Length': pdfArrayBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
