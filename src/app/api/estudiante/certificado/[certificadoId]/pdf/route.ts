export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { getPdfBuffer } from '@/app/api/_shared/certificados/getPdfBuffer'

/**
 * GET /api/estudiante/certificado/[certificadoId]/pdf
 * Descarga el PDF del certificado (Estudiante).
 * La plantilla se resuelve: override del curso > configuración global CERTIFICADO_PLANTILLA > 'clasico'.
 * Si tiene un PDF estático importado, lo sirve; si no, lo genera dinámicamente.
 */
export async function GET(request: Request, { params }: { params: { certificadoId: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const { certificadoId } = params
    const reqUrl = new URL(request.url)
    const previewFlag = reqUrl.searchParams.get('preview') === 'true'

    // Verificar ownership
    const certificado = await prisma.certificado.findUnique({
      where: { id: certificadoId },
      select: { usuario_id: true }
    })

    if (!certificado) {
      return NextResponse.json({ error: 'Certificado no encontrado' }, { status: 404 })
    }

    if (certificado.usuario_id !== auth.user.id && auth.user.rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const { buffer, filename } = await getPdfBuffer(certificadoId, reqUrl, previewFlag)

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${previewFlag ? 'inline' : 'attachment'}; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString()
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}
