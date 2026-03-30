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
          usuario: { select: { nombre: true, apellido: true } },
          datos: true
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
    const colorSecundario = configs.PRIMARY_COLOR_LIGHT ?? '#242CBF'
    const logoUrl = configs.TEMPLATE_LOGO || '/images/logo-arm.png'
    const nombreInstitucion = configs.CERTIFICADO_INSTITUTION_NAME || configs.TEMPLATE_NAME || 'Aula Virtual'
    const slogan = configs.CERTIFICADO_SLOGAN || configs.TEMPLATE_SLOGAN || 'Capacitación Especializada'
    
    // OBTENCIÓN AUTOMÁTICA DEL DOMINIO: Priorizamos config manual, luego host actual
    const linkInstitucion = configs.CERTIFICADO_INSTITUTION_URL || configs.SETTINGS_INSTITUTION_URL || currentHost

    const [pr, pg, pb] = hexToRgb(colorPrimario)
    const [sr, sg, sb] = hexToRgb(colorSecundario)
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

    // ── PÁGINA 1: DISEÑO PRINCIPAL ──
    doc.setFillColor(255, 255, 255)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
    doc.setLineWidth(0.5)
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

    if (logoBuffer) {
      try {
        const ext = logoUrl.split('.').pop()?.split('?')[0]?.toUpperCase() ?? 'PNG'
        const base64Logo = `data:image/${ext.toLowerCase()};base64,${logoBuffer.toString('base64')}`
        
        doc.setFillColor(252, 252, 252)
        doc.roundedRect(14, 12, 19, 17, 1, 1, 'F')
        
        doc.setDrawColor(240, 240, 240)
        doc.setLineWidth(0.1)
        doc.roundedRect(14, 12, 19, 17, 1, 1, 'S')

        doc.addImage(base64Logo, 'PNG', 15.5, 13, 16, 15)
      } catch (err) { console.error('Logo Error:', err) }
    }

    doc.setFontSize(13)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    doc.text(nombreInstitucion.toUpperCase(), 37, 18)

    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    doc.text(slogan, 37, 22)

    doc.setFontSize(9)
    doc.setTextColor(120, 120, 120)
    doc.setFont('helvetica', 'normal')
    doc.text('LINK DE PLATAFORMA', pageWidth - 14, 18, { align: 'right' })
    doc.setTextColor(pr, pg, pb)
    doc.text(linkInstitucion, pageWidth - 14, 23, { align: 'right' })

    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
    doc.setLineWidth(0.3)
    doc.line(14, 32, pageWidth - 14, 32)

    doc.setFontSize(11)
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2])
    doc.setFont('helvetica', 'normal')
    doc.text('CERTIFICADO DE', pageWidth / 2, 42, { align: 'center' })

    doc.setFontSize(36)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    doc.text('FINALIZACIÓN', pageWidth / 2, 53, { align: 'center' })

    doc.setFontSize(14)
    doc.setTextColor(120, 120, 130)
    doc.setFont('helvetica', 'italic')
    doc.text('Otorgado con distinción académica', pageWidth / 2, 63, { align: 'center' })

    doc.setFontSize(13)
    doc.setTextColor(60, 60, 60)
    doc.setFont('helvetica', 'normal')
    doc.text('Se otorga el presente certificado a:', pageWidth / 2, 75, { align: 'center' })

    const snapshot = certificado.datos as any
    const nombreCompleto = snapshot?.usuario 
      ? `${snapshot.usuario.nombre} ${snapshot.usuario.apellido}`
      : `${certificado.usuario.nombre} ${certificado.usuario.apellido}`

    const cursoTitulo = snapshot?.curso?.titulo || certificado.curso.titulo
    const cursoNivel = snapshot?.curso?.nivel || certificado.curso.nivel
    const cursoModalidad = snapshot?.curso?.tipo_emision || certificado.curso.tipo_emision
    const cursoDuracion = snapshot?.curso?.duracion || certificado.curso.duracion

    const modalidad = cursoModalidad === 'ASINCRONO' ? 'VIRTUAL ASÍNCRONO' : 'PRESENCIAL/VIRTUAL'
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'bold')
    doc.text(`NIVEL: ${cursoNivel}    •    MODALIDAD: ${modalidad}`, pageWidth / 2, 124, { align: 'center' })

    const boxWidth = 220
    const boxX = (pageWidth - boxWidth) / 2
    const boxY = 132
    const boxHeight = 18
    doc.setFillColor(252, 251, 243)
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'F')
    doc.setDrawColor(230, 220, 180)
    doc.setLineWidth(0.2)
    doc.rect(boxX, boxY, boxWidth, boxHeight)

    const colWidth = boxWidth / 4
    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return '---'
      return new Date(date).toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' })
    }

    const fechaInicioVal = snapshot?.fechas?.inicio_curso || (certificado.curso.tipo_emision === 'SINCRONO' 
      ? certificado.curso.fecha_inicio 
      : (inscripcion?.inscrito_en || certificado.emitido_en))

    const fechaFinVal = snapshot?.fechas?.culminacion || (inscripcion?.completado_en || certificado.emitido_en)
    const fechaEmisionVal = snapshot?.fechas?.emision || certificado.emitido_en

    const fechaInicioStr = formatDate(fechaInicioVal)
    const fechaFinStr = formatDate(fechaFinVal)
    const fechaEmisionStr = formatDate(fechaEmisionVal)

    const renderColumn = (idx: number, label: string, value: string) => {
      const cx = boxX + (colWidth * idx) + (colWidth / 2)
      doc.setFontSize(9)
      doc.setTextColor(goldColor[0], goldColor[1], goldColor[2])
      doc.setFont('helvetica', 'bold')
      doc.text(label.toUpperCase(), cx, boxY + 6, { align: 'center' })
      doc.setFontSize(11)
      doc.setTextColor(60, 60, 60)
      doc.setFont('helvetica', 'bold')
      doc.text(value, cx, boxY + 14, { align: 'center' })
      if (idx < 3) {
        doc.setDrawColor(230, 220, 180)
        doc.line(boxX + colWidth * (idx + 1), boxY + 4, boxX + colWidth * (idx + 1), boxY + boxHeight - 4)
      }
    }

    renderColumn(0, 'Inicio del curso', fechaInicioStr)
    renderColumn(1, 'Culminación', fechaFinStr)
    renderColumn(2, 'Horas Lectivas', cursoDuracion || '---')
    renderColumn(3, 'Fecha de Emisión', fechaEmisionStr)

    // FOOTER (ALINEACIÓN DE CUADRÍCULA PERFECTA)
    const addSignatureBlock = async (x: number, y: number, user: any) => {
      if (!user) return
      doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
      doc.setLineWidth(0.4)
      doc.line(x - 22, y, x + 22, y)
      if (user.firma) {
        try {
          const signatureBuffer = await fetchImageBuffer(user.firma)
          if (signatureBuffer) {
            const ext = user.firma.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'png'
            doc.addImage(signatureBuffer, ext.toUpperCase(), x - 18, y - 18, 36, 15)
          }
        } catch { /* skip */ }
      }
      doc.setFontSize(8)
      doc.setTextColor(pr, pg, pb)
      doc.setFont('helvetica', 'bold')
      doc.text(`${user.nombre} ${user.apellido}`.toUpperCase(), x, y + 5, { align: 'center' })
      doc.setFontSize(7)
      doc.setTextColor(120, 120, 120)
      doc.setFont('helvetica', 'normal')
      doc.text(user.cargo || 'Funcionario', x, y + 9, { align: 'center' })
    }

    const footerY = 188
    const col1CenterX = boxX + colWidth / 2
    const col2CenterX = boxX + colWidth * 1.5
    const col3CenterX = boxX + colWidth * 2.5
    const col4CenterX = boxX + colWidth * 3.5

    const profesorSnapshot = snapshot?.profesor || certificado.curso.profesor
    await addSignatureBlock(col1CenterX, footerY, profesorSnapshot)

    const sealY = 182
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
    doc.setLineWidth(0.4)
    doc.circle(col2CenterX, sealY, 11)
    doc.circle(col2CenterX, sealY, 10)
    doc.setFontSize(5)
    doc.text('CERTIFICADO', col2CenterX, sealY - 1, { align: 'center' })
    doc.text('OFICIAL', col2CenterX, sealY + 2, { align: 'center' })

    await addSignatureBlock(col3CenterX, footerY, gerenteGeneral)

    const qrSize = 18
    const qrX = col4CenterX - (qrSize / 2)
    const qrY = 170
    doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2])
    doc.setLineWidth(0.3)
    doc.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2)
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)

    doc.setFontSize(6)
    doc.setTextColor(130, 130, 130)
    doc.text('VERIFICAR', col4CenterX, qrY + qrSize + 4, { align: 'center' })
    doc.setFontSize(7)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    doc.text(certificado.codigo_verificacion, col4CenterX, qrY + qrSize + 8, { align: 'center' })

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
