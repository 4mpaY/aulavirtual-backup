import prisma from '@/utils/libs/prisma'

import { NextResponse } from 'next/server'

import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/estudiante/certificado/[certificadoId]/pdf
 * Genera y descarga el PDF del certificado
 */
export async function GET(
  request: Request,
  { params }: { params: { certificadoId: string } }
) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { certificadoId } = params

    const certificado = await prisma.certificado.findUnique({
      where: { id: certificadoId },
      include: {
        curso: { select: { titulo: true } },
        usuario: { select: { nombre: true, apellido: true } }
      }
    })

    if (!certificado) {
      return NextResponse.json({ error: 'Certificado no encontrado' }, { status: 404 })
    }

    if (certificado.usuario_id !== auth.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Importar jsPDF dinámicamente para server-side
    const { jsPDF } = await import('jspdf')

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // ===== Fondo =====
    doc.setFillColor(250, 250, 252)
    doc.rect(0, 0, pageWidth, pageHeight, 'F')

    // ===== Borde decorativo =====
    doc.setDrawColor(30, 120, 70)
    doc.setLineWidth(2)
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

    doc.setDrawColor(40, 150, 90)
    doc.setLineWidth(0.5)
    doc.rect(14, 14, pageWidth - 28, pageHeight - 28)

    // ===== Ícono de graduación (texto decorativo) =====
    doc.setFontSize(40)
    doc.setTextColor(30, 120, 70)
    doc.text('🎓', pageWidth / 2, 40, { align: 'center' })

    // ===== Título =====
    doc.setFontSize(32)
    doc.setTextColor(30, 60, 40)
    doc.setFont('helvetica', 'bold')
    doc.text('CERTIFICADO DE FINALIZACIÓN', pageWidth / 2, 60, { align: 'center' })

    // ===== Línea decorativa =====
    doc.setDrawColor(30, 120, 70)
    doc.setLineWidth(1)
    doc.line(pageWidth / 2 - 60, 65, pageWidth / 2 + 60, 65)

    // ===== Texto introductorio =====
    doc.setFontSize(14)
    doc.setTextColor(80, 80, 80)
    doc.setFont('helvetica', 'normal')
    doc.text('Se otorga el presente certificado a:', pageWidth / 2, 82, { align: 'center' })

    // ===== Nombre del estudiante =====
    const nombreCompleto = `${certificado.usuario.nombre} ${certificado.usuario.apellido}`

    doc.setFontSize(28)
    doc.setTextColor(20, 50, 30)
    doc.setFont('helvetica', 'bold')
    doc.text(nombreCompleto.toUpperCase(), pageWidth / 2, 100, { align: 'center' })

    // ===== Línea bajo el nombre =====
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.5)
    doc.line(pageWidth / 2 - 70, 105, pageWidth / 2 + 70, 105)

    // ===== Texto del curso =====
    doc.setFontSize(13)
    doc.setTextColor(80, 80, 80)
    doc.setFont('helvetica', 'normal')
    doc.text('Por haber completado satisfactoriamente el curso:', pageWidth / 2, 120, { align: 'center' })

    doc.setFontSize(20)
    doc.setTextColor(30, 120, 70)
    doc.setFont('helvetica', 'bold')

    // Manejar títulos largos
    const tituloLineas = doc.splitTextToSize(certificado.curso.titulo, 200)

    doc.text(tituloLineas, pageWidth / 2, 135, { align: 'center' })

    // ===== Fecha de emisión =====
    const fecha = new Date(certificado.emitido_en).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    doc.setFontSize(11)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(`Fecha de emisión: ${fecha}`, pageWidth / 2, 160, { align: 'center' })

    // ===== Código de verificación =====
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Código de verificación: ${certificado.codigo_verificacion}`,
      pageWidth / 2,
      pageHeight - 22,
      { align: 'center' }
    )

    // Generar buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificado-${certificado.codigo_verificacion}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
