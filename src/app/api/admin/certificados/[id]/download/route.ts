import { NextResponse } from 'next/server'

import { requireAdmin } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'
import { getPdfBuffer } from '@/app/api/_shared/certificados/getPdfBuffer'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/certificados/[id]/download
 * Descarga el PDF del certificado (solo ADMIN).
 * La plantilla se resuelve: override del curso > configuración global CERTIFICADO_PLANTILLA > 'clasico'.
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { id } = params
    const reqUrl = new URL(request.url)
    const previewFlag = reqUrl.searchParams.get('preview') === 'true'
    const forceDynamic = reqUrl.searchParams.get('dynamic') === 'true'

    const { buffer, filename } = await getPdfBuffer(id, reqUrl, previewFlag, forceDynamic)

    return new NextResponse(new Uint8Array(buffer), {
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
