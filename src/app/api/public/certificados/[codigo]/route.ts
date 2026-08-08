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
        ruta: {
          select: {
            titulo: true
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

    const isRuta = !certificado.curso_id
    const cursoTitulo = isRuta ? (certificado.ruta?.titulo || 'Ruta de Aprendizaje') : (certificado.curso?.titulo || '')
    const cursoDuracion = isRuta ? 'Completo' : (certificado.curso?.duracion || null)
    const cursoNivel = isRuta ? 'Todos' : (certificado.curso?.nivel || null)

    // Retornamos los datos públicos del certificado
    return NextResponse.json({
      status: true,
      result: {
        codigo_verificacion: certificado.codigo_verificacion,
        emitido_en: certificado.emitido_en,
        estudiante: `${certificado.usuario.nombre} ${certificado.usuario.apellido}`,
        curso: cursoTitulo,
        duracion: cursoDuracion,
        nivel: cursoNivel,
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
