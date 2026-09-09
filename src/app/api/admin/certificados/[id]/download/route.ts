export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { getPdfBuffer } from '@/app/api/_shared/certificados/getPdfBuffer'

/**
 * GET /api/admin/certificados/[id]/download
 * Descarga el PDF del certificado (solo ADMIN).
 * La plantilla se resuelve: override del curso > configuración global CERTIFICADO_PLANTILLA > 'clasico'.
 */
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) return auth.error

    const { id } = params
    const reqUrl = new URL(request.url)
    const previewFlag = reqUrl.searchParams.get('preview') === 'true'
    const forceDynamic = reqUrl.searchParams.get('dynamic') === 'true'

    const { buffer, filename } = await getPdfBuffer(id, reqUrl, previewFlag, forceDynamic)

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
