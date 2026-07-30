export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import JSZip from 'jszip'

import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getPdfBuffer } from '@/app/api/_shared/certificados/getPdfBuffer'

/**
 * GET /api/admin/certificados/download-zip
 * Descarga todos los certificados filtrados por fecha en un archivo ZIP.
 */
export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { searchParams } = new URL(request.url)
    const fechaInicio = searchParams.get('fechaInicio') || ''
    const fechaFin = searchParams.get('fechaFin') || ''

    const conditions: any[] = []

    if (fechaInicio) {
      conditions.push({
        emitido_en: { gte: new Date(`${fechaInicio}T00:00:00.000Z`) }
      })
    }

    if (fechaFin) {
      conditions.push({
        emitido_en: { lte: new Date(`${fechaFin}T23:59:59.999Z`) }
      })
    }

    const where = conditions.length > 0 ? { AND: conditions } : {}

    const certificados = await prisma.certificado.findMany({
      where,
      select: {
        id: true,
        codigo_verificacion: true
      }
    })

    if (certificados.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron certificados en el rango seleccionado' },
        { status: 404 }
      )
    }

    const zip = new JSZip()
    const reqUrl = new URL(request.url)

    // Generar/obtener el PDF para cada certificado e incluirlo en el ZIP
    for (const cert of certificados) {
      try {
        const { buffer, filename } = await getPdfBuffer(cert.id, reqUrl, false)

        zip.file(filename, buffer)
      } catch (err) {
        console.error(`Error al procesar certificado ${cert.codigo_verificacion} para el ZIP:`, err)
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="certificados.zip"',
        'Content-Length': zipBuffer.byteLength.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
