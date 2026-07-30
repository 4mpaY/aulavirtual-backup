export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import { handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { getPdfBuffer } from '@/app/api/_shared/certificados/getPdfBuffer'

/**
 * GET /api/admin/certificados/[id]/download
 * Descarga el PDF del certificado (solo ADMIN).
 * Si tiene un PDF estático importado, lo sirve; si no, lo genera dinámicamente.
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
