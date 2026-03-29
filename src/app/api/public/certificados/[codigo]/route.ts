import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'

/**
 * GET /api/public/certificados/[codigo]
 * API pública para consultar la validez y datos de un certificado por su código.
 */
export async function GET(request: Request, { params }: { params: { codigo: string } }) {
  try {
    const { codigo } = params

    if (!codigo) {
      return NextResponse.json({ status: false, message: 'Código requerido' }, { status: 400 })
    }

    const certificado = await prisma.certificado.findUnique({
      where: { codigo_verificacion: codigo },
      include: {
        curso: {
          select: {
            titulo: true,
            duracion: true,
            nivel: true,
          }
        },
        usuario: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      }
    })

    if (!certificado) {
      return NextResponse.json({ 
        status: false, 
        message: 'Certificado no encontrado o código inválido' 
      }, { status: 404 })
    }

    // Retornamos los datos públicos del certificado
    return NextResponse.json({
      status: true,
      result: {
        codigo_verificacion: certificado.codigo_verificacion,
        emitido_en: certificado.emitido_en,
        estudiante: `${certificado.usuario.nombre} ${certificado.usuario.apellido}`,
        curso: certificado.curso.titulo,
        duracion: certificado.curso.duracion,
        nivel: certificado.curso.nivel,
        valido: true
      }
    })
  } catch (error: any) {
    return NextResponse.json({ 
      status: false, 
      message: 'Error interno del servidor',
      error: error.message
    }, { status: 500 })
  }
}
