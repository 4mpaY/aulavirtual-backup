export const dynamic = 'force-dynamic'

import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { randomUUID } from 'crypto'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { handleApiError } from '@/utils/libs/validation'

const ALLOWED_IMAGE_MIMES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

/**
 * POST /api/pedidos/[id]/voucher
 * Sube la imagen del comprobante de pago para un pedido PENDIENTE (solo el dueño del pedido)
 */
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    const pedido = await prisma.pedido.findUnique({
      where: { id: params.id },
      select: { id: true, usuario_id: true, estado: true }
    })

    if (!pedido) {
      return ApiResponse.error(request, 'Pedido no encontrado', 404)
    }

    if (pedido.usuario_id !== auth.user.id) {
      return ApiResponse.error(request, 'No tienes permiso para modificar este pedido', 403)
    }

    if (pedido.estado !== 'PENDIENTE') {
      return ApiResponse.error(request, 'Solo se puede subir comprobante a pedidos pendientes', 400)
    }

    const contentLength = parseInt(request.headers.get('content-length') || '0', 10)

    if (contentLength > MAX_SIZE) {
      return ApiResponse.error(request, 'La imagen supera el tamaño máximo permitido (5MB)', 413)
    }

    const formData = await request.formData()
    const file = formData.get('voucher') as File | null

    if (!file) {
      return ApiResponse.error(request, 'No se proporcionó ninguna imagen', 400)
    }

    if (file.size > MAX_SIZE) {
      return ApiResponse.error(request, 'La imagen supera el tamaño máximo permitido (5MB)', 413)
    }

    if (!ALLOWED_IMAGE_MIMES[file.type]) {
      return ApiResponse.error(request, 'Solo se permiten imágenes JPG, PNG o WEBP', 400)
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = ALLOWED_IMAGE_MIMES[file.type]
    const fileName = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'vouchers')
    const absolutePath = join(uploadDir, fileName)
    const relativePath = `/uploads/vouchers/${fileName}`

    await mkdir(uploadDir, { recursive: true })
    await writeFile(absolutePath, buffer)

    await prisma.pedido.update({
      where: { id: params.id },
      data: {
        comprobante_url: relativePath,
        comprobante_subido_en: new Date()
      }
    })

    return ApiResponse.success(request, { comprobante_url: relativePath })
  } catch (error) {
    return handleApiError(error, request)
  }
}
