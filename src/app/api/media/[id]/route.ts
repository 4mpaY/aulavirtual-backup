import { unlink } from 'fs/promises'
import { join } from 'path'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import { requireAuth } from '@/utils/libs/auth-helpers'

/**
 * DELETE /api/media/[id]
 * Eliminar un archivo y su registro en la base de datos
 */
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const { id } = params

    // 🔐 SEGURIDAD: Requiere autenticación
    const auth = await requireAuth(request)

    if (!auth.authorized) return auth.error

    // 1. Buscar el registro en la base de datos
    const media = await prisma.media.findUnique({
      where: { id }
    })

    if (!media) {
      return ApiResponse.error(request, 'Archivo no encontrado', 404)
    }


    // 2. Eliminar el archivo físico
    let absolutePath = ''

    if (media.url.startsWith('/api/videos/stream/')) {
      const filename = media.url.split('/').pop()

      absolutePath = join(process.cwd(), 'private', 'videos', filename || '')
    } else {
      const relativePath = media.url.startsWith('/') ? media.url.substring(1) : media.url

      absolutePath = join(process.cwd(), 'public', relativePath)
    }

    try {
      await unlink(absolutePath)
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        console.error(`Error al eliminar archivo físico: ${absolutePath}`, err)

        return ApiResponse.error(request, 'No se pudo eliminar el archivo del servidor', 500)
      }

      // Si es ENOENT (No tales archivos), simplemente ignoramos el error y borramos de la DB
      console.warn(`Aviso: El archivo no existía en el servidor: ${absolutePath}`)
    }

    // 3. Eliminar el registro de la base de datos
    await prisma.media.delete({
      where: { id }
    })

    return ApiResponse.success(request, { message: 'Archivo eliminado correctamente' })
  } catch (error) {
    return handleApiError(error, request)
  }
}
