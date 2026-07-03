export const dynamic = 'force-dynamic'

import { join } from 'path'
import { mkdir } from 'fs/promises'
import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { randomUUID } from 'crypto'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'
import { requireProfesorOrAdmin } from '@/utils/libs/auth-helpers'

const ALLOWED_MIMES: Record<string, string> = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/ogg': 'ogg',
  'video/quicktime': 'mov',
  'video/x-matroska': 'mkv',
  'video/mkv': 'mkv'
}

const MAX_FILE_SIZE = 3 * 1024 * 1024 * 1024 // 3 GB max for private videos

export async function POST(request: Request) {
  try {
    // 🔐 SEGURIDAD: Requiere ser Profesor o Administrador
    const auth = await requireProfesorOrAdmin(request)

    if (!auth.authorized) return auth.error

    // 🔐 SEGURIDAD: Verificar tamaño antes de leer el body completo
    const contentLength = parseInt(request.headers.get('content-length') || '0', 10)

    if (contentLength > MAX_FILE_SIZE) {
      return ApiResponse.error(
        request,
        `El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        413
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return ApiResponse.error(request, 'No se proporcionó ningún archivo', 400)
    }

    // 🔐 SEGURIDAD: Verificar tamaño real del archivo
    if (file.size > MAX_FILE_SIZE) {
      return ApiResponse.error(
        request,
        `El archivo supera el tamaño máximo permitido (${MAX_FILE_SIZE / 1024 / 1024}MB)`,
        413
      )
    }

    // 🔐 SEGURIDAD: Validar MIME type contra lista blanca u obtener por extensión
    let safeExtension = ALLOWED_MIMES[file.type]
    let detectedMime = file.type

    if (!safeExtension && file.name) {
      const extension = file.name.split('.').pop()?.toLowerCase() || ''

      const extToMime: Record<string, { ext: string, mime: string }> = {
        'mp4': { ext: 'mp4', mime: 'video/mp4' },
        'webm': { ext: 'webm', mime: 'video/webm' },
        'ogg': { ext: 'ogg', mime: 'video/ogg' },
        'mov': { ext: 'mov', mime: 'video/quicktime' },
        'mkv': { ext: 'mkv', mime: 'video/x-matroska' }
      }

      const matched = extToMime[extension]

      if (matched) {
        safeExtension = matched.ext
        detectedMime = matched.mime
      }
    }

    if (!safeExtension) {
      return ApiResponse.error(
        request,
        `Tipo de archivo no permitido. Solo se aceptan formatos de video (.mp4, .webm, .ogg, .mov, .mkv)`,
        400
      )
    }

    const id = randomUUID()
    const nombreArchivo = `${id}.${safeExtension}`
    const nombreOriginal = file.name.replace(/[^a-zA-Z0-9._-]/g, '_') // Sanitizar nombre original

    const uploadDir = join(process.cwd(), 'private', 'videos')
    const absolutePath = join(uploadDir, nombreArchivo)
    const relativePath = `/api/videos/stream/${nombreArchivo}`

    try {
      // Asegurar que el directorio existe
      await mkdir(uploadDir, { recursive: true })

      // Escribir el archivo usando Web Streams para ahorrar memoria RAM
      const writeStream = createWriteStream(absolutePath)
      const fileStream = Readable.fromWeb(file.stream() as any)

      await new Promise<void>((resolve, reject) => {
        fileStream.pipe(writeStream)
        writeStream.on('finish', resolve)
        writeStream.on('error', (err) => {
          writeStream.close()
          reject(err)
        })
      })
    } catch (fsError: any) {
      console.error('❌ Error de sistema de archivos en subida de video privado:', fsError)
      
      return ApiResponse.error(request, 'No se pudo guardar el archivo en el servidor', 500)
    }

    // Crear registro en la tabla Media
    const mediaResult = await prisma.media.create({
      data: {
        id,
        nombre: nombreOriginal,
        url: relativePath,
        tipo: 'VIDEO',
        mimetype: detectedMime,
        peso: file.size
      }
    })

    return ApiResponse.success(request, mediaResult, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
