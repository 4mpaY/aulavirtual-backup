import { join } from 'path'
import { writeFile } from 'fs/promises'
import { randomUUID } from 'crypto'

import prisma from '@/utils/libs/prisma'
import { ApiResponse } from '@/utils/libs/apiResponse'
import { handleApiError } from '@/utils/libs/validation'

/**
 * GET /api/media
 * Listar todos los archivos subidos
 */
export async function GET(request: Request) {
  try {
    const media = await prisma.$queryRaw`
      SELECT * FROM "media"
      ORDER BY "creado_en" DESC
    `

    return ApiResponse.success(request, media)
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/media
 * Subir un nuevo archivo
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return ApiResponse.error(request, 'No se proporcionó ningún archivo', 400)
    }

    // Validar tipo de archivo (opcional, por ahora permitimos imágenes y otros)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes as ArrayBuffer)

    // Generar nombre único
    const extension = file.name.split('.').pop()
    const nombreOriginal = file.name
    const id = randomUUID()
    const nombreArchivo = `${id}.${extension}`

    // Ruta relativa para la URL y ruta absoluta para guardar
    const relativePath = `/uploads/cursos/${nombreArchivo}`
    const absolutePath = join(process.cwd(), 'public', 'uploads', 'cursos', nombreArchivo)

    // Guardar en el sistema de archivos
    await writeFile(absolutePath, buffer as any)

    // Registrar en la base de datos usando SQL crudo
    const tipo = file.type.startsWith('image/') ? 'IMAGEN' : 'OTRO'
    const peso = file.size
    const mimetype = file.type
    const ahora = new Date()

    await prisma.$executeRaw`
      INSERT INTO "media" ("id", "nombre", "url", "tipo", "mimetype", "peso", "creado_en", "actualizado_en")
      VALUES (${id}, ${nombreOriginal}, ${relativePath}, ${tipo}, ${mimetype}, ${peso}, ${ahora}, ${ahora})
    `

    // Recuperar el objeto creado para devolverlo
    const mediaResult = await prisma.$queryRaw<any[]>`
      SELECT * FROM "media" WHERE "id" = ${id} LIMIT 1
    `

    return ApiResponse.success(request, mediaResult[0], 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
