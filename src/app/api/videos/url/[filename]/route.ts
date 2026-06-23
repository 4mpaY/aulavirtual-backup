export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { existsSync } from 'fs'
import { basename, join, normalize } from 'path'

import type { NextRequest } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { requireAuth } from '@/utils/libs/auth-helpers'
import { generateVideoUrl } from '@/utils/video-url'

type Params = Promise<{
  filename: string
}>

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const auth = await requireAuth(request)

    if (!auth.authorized) {
      return auth.error || new Response('No autorizado', { status: 401 })
    }

    const { user } = auth
    const { filename } = await params

    // Evita path traversal tipo ../../archivo
    const safeFilename = basename(filename)

    const videosDir = join(process.cwd(), 'private', 'videos')
    const filePath = normalize(join(videosDir, safeFilename))

    if (!filePath.startsWith(videosDir)) {
      return new Response('Ruta inválida', { status: 400 })
    }

    if (!existsSync(filePath)) {
      return new Response('Video no encontrado', { status: 404 })
    }

    // Seguridad por rol estudiante
    if (user.rol === 'ESTUDIANTE') {
      const streamUrlPattern = `/api/videos/stream/${safeFilename}`

      const leccion = await prisma.leccion.findFirst({
        where: {
          video_url: {
            contains: streamUrlPattern
          }
        },
        include: {
          modulo: true
        }
      })

      if (!leccion || !leccion.modulo) {
        return new Response('No tienes permiso para ver este video', {
          status: 403
        })
      }

      if (!leccion.es_vista_previa) {
        const inscripcion = await prisma.inscripcion.findFirst({
          where: {
            usuario_id: user.id,
            curso_id: leccion.modulo.curso_id,
            estado: {
              in: ['ACTIVO', 'COMPLETADO']
            }
          }
        })

        if (!inscripcion) {
          return new Response(
            'No estás inscrito en este curso o tu inscripción no está activa',
            { status: 403 }
          )
        }
      }
    }

    // Generar la URL firmada para Nginx
    const url = generateVideoUrl(safeFilename)

    return Response.json({ url })
  } catch (error) {
    console.error('❌ Error al generar URL firmada de video:', error)

    return new Response('Error interno del servidor', { status: 500 })
  }
}
