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
    return [30, 120, 70] // Fallback verde si el hex es inválido
  }
}

/** Intenta cargar una imagen (local o remota) y devuelve Buffer */
async function fetchImageBuffer(url: string | null): Promise<Buffer | null> {
  try {
    if (!url) return null

    // Si es ruta local /public
    if (url.startsWith('/')) {
      const cleanUrl = url.replace(/\/+/g, '/')
      const filePath = join(process.cwd(), 'public', cleanUrl)

      return await readFile(filePath)
    }

    // Si es URL remota
    const response = await fetch(url)

    if (!response.ok) return null

    return Buffer.from(await response.arrayBuffer())
  } catch {
    return null
  }
}

/**
 * GET /api/estudiante/certificado/[certificadoId]/pdf
 * Genera y descarga el PDF del certificado
 */
export async function GET(request: Request, { params }: { params: { certificadoId: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { certificadoId } = params

    // Cargar datos en paralelo
    const [certificado, configs] = await Promise.all([
      prisma.certificado.findUnique({
        where: { id: certificadoId },
        include: {
          curso: {
            select: {
              titulo: true,
              duracion: true,
              nivel: true,
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

    if (certificado.usuario_id !== auth.user.id && auth.user.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // ── Branding desde la Configuración ──
    const colorPrimario = configs.PRIMARY_COLOR_MAIN || '#131FF2'
    const colorSecundario = configs.PRIMARY_COLOR_LIGHT || '#242CBF'
    const logoUrl = configs.TEMPLATE_LOGO || '/images/logo-arm.png'
    const nombreInstitucion = configs.TEMPLATE_NAME || 'Aula Virtual'
    const [pr, pg, pb] = hexToRgb(colorPrimario)
    const [sr, sg, sb] = hexToRgb(colorSecundario)

    // URL de verificación
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verifyUrl = `${appUrl}/verificar-certificado/${certificado.codigo_verificacion}`

    // Generar QR
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 120,
      margin: 1,
      color: { dark: colorPrimario, light: '#ffffff' }
    })

    // Logo
    const logoBuffer = logoUrl ? await fetchImageBuffer(logoUrl) : null

    // Gerente General
    const gerenteGeneralId = configs.CERTIFICADO_GERENTE_GENERAL_ID

    console.log('PDF: Gerente General ID:', gerenteGeneralId)

    const gerenteGeneral = gerenteGeneralId
      ? await prisma.usuario.findUnique({
          where: { id: gerenteGeneralId },
          select: { nombre: true, apellido: true, cargo: true, firma: true }
        })
      : null

    console.log('PDF: Gerente General Data:', !!gerenteGeneral, gerenteGeneral?.nombre)

    // ================================================================
    const { jsPDF } = await import('jspdf')

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // ============================================================
    // PÁGINA 1 – CERTIFICADO
    // ============================================================

    doc.setFillColor(248, 250, 252)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(3)
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16)

    doc.setDrawColor(sr, sg, sb)
    doc.setLineWidth(0.8)
    doc.rect(13, 13, pageWidth - 26, pageHeight - 26)
    doc.setLineWidth(0.3)
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

    // Banda superior
    doc.setFillColor(pr, pg, pb)
    doc.rect(8, 8, pageWidth - 16, 22, 'F')

    // Logo en la banda
    if (logoBuffer) {
      try {
        const ext = logoUrl.split('.').pop()?.toUpperCase() ?? 'PNG'
        const mimeExt = ext === 'JPG' ? 'JPEG' : ext === 'SVG' ? 'PNG' : ext
        const base64Logo = `data:image/${ext.toLowerCase()};base64,${logoBuffer.toString('base64')}`

        doc.addImage(base64Logo, mimeExt, 14, 10, 40, 16)
      } catch {
        // fail silent
      }
    }

    // Nombre institución en la banda
    doc.setFontSize(11)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text(nombreInstitucion.toUpperCase(), pageWidth - 20, 21, { align: 'right' })

    // Títulos
    doc.setFontSize(30)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICADO DE FINALIZACIÓN', pageWidth / 2, 52, { align: 'center' })

    doc.setDrawColor(pr, pg, pb)
    doc.setLineWidth(1.2)
    doc.line(pageWidth / 2 - 70, 57, pageWidth / 2 + 70, 57)
    doc.setLineWidth(0.3)
    doc.line(pageWidth / 2 - 55, 59.5, pageWidth / 2 + 55, 59.5)

    doc.setFontSize(13)
    doc.setTextColor(90, 90, 90)
    doc.setFont('helvetica', 'italic')
    doc.text('Se otorga el presente certificado a:', pageWidth / 2, 74, { align: 'center' })

    const nombreCompleto = `${certificado.usuario.nombre} ${certificado.usuario.apellido}`

    doc.setFontSize(32)
    doc.setTextColor(30, 40, 50)
    doc.setFont('helvetica', 'bold')
    doc.text(nombreCompleto.toUpperCase(), pageWidth / 2, 91, { align: 'center' })

    doc.setDrawColor(180, 180, 180)
    doc.setLineWidth(0.5)
    doc.line(pageWidth / 2 - 90, 97, pageWidth / 2 + 90, 97)

    doc.setFontSize(12)
    doc.setTextColor(90, 90, 90)
    doc.setFont('helvetica', 'normal')
    doc.text('Por haber completado satisfactoriamente el curso:', pageWidth / 2, 109, { align: 'center' })

    doc.setFontSize(20)
    doc.setTextColor(sr, sg, sb)
    doc.setFont('helvetica', 'bold')
    const tituloLineas = doc.splitTextToSize(certificado.curso.titulo, 180)

    doc.text(tituloLineas, pageWidth / 2, 122, { align: 'center' })

    const info: string[] = []

    if (certificado.curso.nivel) info.push(`Nivel: ${certificado.curso.nivel}`)
    if (certificado.curso.duracion) info.push(`Duración: ${certificado.curso.duracion}`)

    if (info.length > 0) {
      doc.setFontSize(10)
      doc.setTextColor(120, 120, 120)
      doc.setFont('helvetica', 'normal')
      doc.text(info.join('  •  '), pageWidth / 2, 138, { align: 'center' })
    }

    const fecha = new Date(certificado.emitido_en).toLocaleDateString('es-PE', {
      year: 'numeric', month: 'long', day: 'numeric'
    })

    doc.setFontSize(11)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha de emisión: ${fecha}`, pageWidth / 2, 153, { align: 'center' })

    // ── FIRMAS ──
    const addSignatureBlock = async (x: number, y: number, user: any) => {
      if (!user) return

      // Línea
      doc.setDrawColor(180, 180, 180)
      doc.setLineWidth(0.5)
      doc.line(x - 30, y, x + 30, y)

      // Imagen firma
      if (user.firma) {
        try {
          console.log(`PDF: Cargando firma para ${user.nombre}: ${user.firma}`)
          const signatureBuffer = await fetchImageBuffer(user.firma)

          if (signatureBuffer) {
            console.log(`PDF: Firma cargada exitosamente (${signatureBuffer.length} bytes)`)
            const ext = user.firma.split('.').pop()?.split('?')[0]?.toLowerCase() ?? 'png'
            const mime = ext === 'jpg' ? 'JPEG' : ext.toUpperCase()

            doc.addImage(signatureBuffer, mime, x - 25, y - 22, 50, 20)
          } else {
            console.log(`PDF: Falló la carga de la firma del buffer para ${user.nombre}`)
          }
        } catch (e) {
          console.error('Error al cargar firma:', e)
        }
      }

      // Nombre
      doc.setFontSize(10)
      doc.setTextColor(30, 40, 50)
      doc.setFont('helvetica', 'bold')
      doc.text(`${user.nombre} ${user.apellido}`.toUpperCase(), x, y + 6, { align: 'center' })

      // Cargo
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.setFont('helvetica', 'normal')
      doc.text(user.cargo || 'Funcionario', x, y + 10, { align: 'center' })
    }

    // Renderizar bloques de firmas (Instructor a la izquierda, Gerente a la derecha)
    await addSignatureBlock(pageWidth / 2 - 60, 178, certificado.curso.profesor)
    await addSignatureBlock(pageWidth / 2 + 60, 178, gerenteGeneral)

    // QR
    const qrSize = 32
    const qrX = pageWidth - qrSize - 22
    const qrY = pageHeight - qrSize - 22

    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize)
    doc.setFontSize(7)
    doc.setTextColor(140, 140, 140)
    doc.text('Verificar', qrX + qrSize / 2, qrY + qrSize + 4, { align: 'center' })
    doc.text('certificado', qrX + qrSize / 2, qrY + qrSize + 8, { align: 'center' })

    // Pie
    doc.setFontSize(8)
    doc.setTextColor(160, 160, 160)
    doc.text(`Código: ${certificado.codigo_verificacion}`, pageWidth / 2, pageHeight - 14, { align: 'center' })
    doc.setFontSize(7)
    doc.text(verifyUrl, pageWidth / 2, pageHeight - 9, { align: 'center' })

    // ============================================================
    // PÁGINA 2 – CONTENIDO
    // ============================================================
    doc.addPage()

    doc.setFillColor(248, 250, 252)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    doc.setFillColor(pr, pg, pb)
    doc.rect(0, 0, pageWidth, 22, 'F')

    doc.setFontSize(14)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('CONTENIDO DEL PROGRAMA', pageWidth / 2, 14, { align: 'center' })

    doc.setFontSize(10)
    doc.setTextColor(pr, pg, pb)
    doc.setFont('helvetica', 'bold')
    const cursoTituloLines = doc.splitTextToSize(certificado.curso.titulo, pageWidth - 40)

    doc.text(cursoTituloLines, pageWidth / 2, 30, { align: 'center' })

    const yPos = 42
    const modulos = certificado.curso.modulos ?? []

    if (modulos.length === 0) {
      doc.setFontSize(11)
      doc.setTextColor(120, 120, 120)
      doc.setFont('helvetica', 'italic')
      doc.text('Este curso no tiene módulos registrados.', pageWidth / 2, yPos + 10, { align: 'center' })
    } else {
      const colWidth = (pageWidth - 40) / 2
      const leftX = 20
      const rightX = 20 + colWidth + 5
      let col = 0
      let yLeft = yPos
      let yRight = yPos

      for (let mi = 0; mi < modulos.length; mi++) {
        const modulo = modulos[mi]
        const currentY = col === 0 ? yLeft : yRight
        const currentX = col === 0 ? leftX : rightX

        // Módulo
        doc.setFillColor(pr, pg, pb)
        doc.roundedRect(currentX, currentY, colWidth - 5, 8, 2, 2, 'F')
        doc.setFontSize(9)
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        const moduloTitulo = doc.splitTextToSize(`${modulo.orden}. ${modulo.titulo}`, colWidth - 12)

        doc.text(moduloTitulo, currentX + 4, currentY + 5.5)

        let yLeccion = currentY + 11

        for (const leccion of modulo.lecciones) {
          if (yLeccion > pageHeight - 20) {
            if (col === 0) {
              col = 1
              yLeft = yLeccion
              yLeccion = yRight
            } else {
              doc.addPage()
              doc.setFillColor(248, 250, 252)
              doc.rect(0, 0, pageWidth, pageHeight, 'F')
              doc.setFillColor(pr, pg, pb)
              doc.rect(0, 0, pageWidth, 22, 'F')
              doc.text('CONTENIDO DEL PROGRAMA (Cont.)', pageWidth / 2, 14, { align: 'center' })
              col = 0
              yLeft = 30
              yRight = 30
              yLeccion = 30
            }
          }

          const xLeccion = col === 0 ? leftX : rightX

          doc.setFontSize(8)
          doc.setTextColor(60, 60, 60)
          doc.setFont('helvetica', 'normal')

          const leccionTitulo = doc.splitTextToSize(
            `  ${modulo.orden}.${leccion.orden} ${leccion.titulo}`,
            colWidth - 16
          )

          doc.setFillColor(sr, sg, sb)
          doc.circle(xLeccion + 3.5, yLeccion + 1.5, 1, 'F')
          doc.text(leccionTitulo, xLeccion + 6, yLeccion + 2.5)
          yLeccion += leccionTitulo.length * 4.5 + 1.5
        }

        yLeccion += 4

        if (col === 0) {
          yLeft = yLeccion
        } else {
          yRight = yLeccion
        }

        col = mi % 2 === 0 ? 0 : 1
      }
    }

    doc.setFontSize(8)
    doc.setTextColor(160, 160, 160)
    doc.text(
      `Certificado emitido a: ${nombreCompleto}  •  Código: ${certificado.codigo_verificacion}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    )

    const pdfArrayBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificado-${certificado.codigo_verificacion}.pdf"`,
        'Content-Length': pdfArrayBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
