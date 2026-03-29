export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'

/**
 * GET /api/web/docentes/[slug]
 * Retorna el perfil público de un docente: nombre, cargo, biografía, avatar y sus cursos publicados.
 */
export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const docente = await prisma.usuario.findUnique({
      where: { slug },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        avatar: true,
        biografia: true,
        cargo: true,
        cursos_dictados: {
          where: { estado: 'PUBLICADO' },
          select: {
            id: true,
            titulo: true,
            slug: true,
            miniatura: true,
            precio: true,
            moneda: true,
            es_gratis: true,
            nivel: true,
            tipo_emision: true,
            categoria: {
              select: { nombre: true }
            }
          },
          orderBy: { creado_en: 'desc' }
        }
      }
    })

    if (!docente) {
      return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 })
    }

    // Solo retornar si tiene al menos un curso publicado (protege perfiles privados)
    if (docente.cursos_dictados.length === 0) {
      return NextResponse.json({ error: 'Docente no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ docente })
  } catch (error: any) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
