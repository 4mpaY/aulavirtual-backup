export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

import prisma from '@/utils/libs/prisma'
import { requireAdmin } from '@/utils/libs/auth-helpers'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { homologacion } = await request.json()

    if (typeof homologacion !== 'boolean') {
      return NextResponse.json(
        { status: false, message: 'El valor de homologacion debe ser un booleano' },
        { status: 400 }
      )
    }

    const certificadoId = params.id

    const certificado = await prisma.certificado.findUnique({
      where: { id: certificadoId }
    })

    if (!certificado) {
      return NextResponse.json(
        { status: false, message: 'Certificado no encontrado' },
        { status: 404 }
      )
    }

    // El campo `datos` es un JSON
    const datos = certificado.datos as Record<string, any>

    datos.homologacion = homologacion

    const certificadoActualizado = await prisma.certificado.update({
      where: { id: certificadoId },
      data: {
        datos: datos
      }
    })

    return NextResponse.json({
      status: true,
      message: 'Homologación actualizada correctamente',
      result: certificadoActualizado
    })
  } catch (error: any) {
    console.error('Error al actualizar homologación:', error)
    
return NextResponse.json(
      { status: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
