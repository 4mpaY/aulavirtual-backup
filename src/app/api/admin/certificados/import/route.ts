export const dynamic = 'force-dynamic'

import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

/**
 * POST /api/admin/certificados/import
 * Importa/reemplaza uno o más archivos PDF para certificados existentes.
 * El archivo PDF se mapea al certificado mediante su código de verificación (nombre de archivo).
 */
export async function POST(request: Request) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se subieron archivos' }, { status: 400 })
    }

    let exitosos = 0
    const errores: { file: string; message: string }[] = []
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'certificados')

    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      try {
        const originalName = file.name

        if (!originalName.toLowerCase().endsWith('.pdf')) {
          errores.push({ file: originalName, message: 'Solo se permiten archivos PDF' })
          continue
        }

        // Extraer código de verificación del nombre del archivo
        // Ej: certificado-CURSO-DATE-DNI-01.pdf -> CURSO-DATE-DNI-01
        // Ej: CURSO-DATE-DNI-01.pdf -> CURSO-DATE-DNI-01
        const cleanName = originalName.replace(/\.pdf$/i, '')
        const code = cleanName.replace(/^certificado-/i, '').trim()

        const certificado = await prisma.certificado.findUnique({
          where: { codigo_verificacion: code }
        })

        if (!certificado) {
          errores.push({
            file: originalName,
            message: `No se encontró ningún certificado en la base de datos con el código: ${code}`
          })
          continue
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueFilename = `${code}-${Date.now()}.pdf`
        const absolutePath = join(uploadDir, uniqueFilename)
        const relativePath = `/uploads/certificados/${uniqueFilename}`

        // Guardar archivo físico en el servidor
        await writeFile(absolutePath, buffer)

        // Manejar historial en el campo datos JSON
        const oldDatos = (certificado.datos as Record<string, any>) || {}
        const currentPdf = oldDatos.archivo_pdf
        const pdfHistory = Array.isArray(oldDatos.pdf_history) ? [...oldDatos.pdf_history] : []

        if (currentPdf) {
          pdfHistory.push({
            url: currentPdf,
            fecha: new Date().toISOString()
          })
        }

        const newDatos = {
          ...oldDatos,
          archivo_pdf: relativePath,
          pdf_history: pdfHistory
        }

        // Actualizar en BD sin tocar otros campos
        await prisma.certificado.update({
          where: { id: certificado.id },
          data: {
            datos: newDatos
          }
        })

        exitosos++
      } catch (err: any) {
        console.error(`Error procesando archivo ${file.name}:`, err)
        errores.push({ file: file.name, message: err.message || 'Error interno al procesar el archivo' })
      }
    }

    return NextResponse.json({
      exitosos,
      errores
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
