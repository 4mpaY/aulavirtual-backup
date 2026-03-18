import { NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'

import prisma from '@/utils/libs/prisma'
import { authOptions } from '@/utils/configs/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ status: false, message: 'No autorizado' }, { status: 401 })
    }

    const user = await prisma.usuario.findUnique({
      where: { correo: session.user.email },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        correo: true,
        numero_documento: true,
        celular: true,
        biografia: true,
        avatar: true,
        rol: true
      }
    })

    if (!user) {
      return NextResponse.json({ status: false, message: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ status: true, result: user })
  } catch (error: any) {
    return NextResponse.json({ status: false, message: error.message || 'Error interno' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ status: false, message: 'No autorizado' }, { status: 401 })
    }

    const { nombre, apellido, celular, numero_documento, biografia, contrasena, avatar } = await req.json()

    if (!nombre || !apellido || !numero_documento) {
      return NextResponse.json({ status: false, message: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const currentUser = await prisma.usuario.findUnique({
      where: { correo: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json({ status: false, message: 'Usuario no encontrado' }, { status: 404 })
    }

    const updateData: any = {
      nombre,
      apellido,
      celular,
      numero_documento,
      biografia,
      avatar
    }

    // Verify document uniqueness if changed
    if (numero_documento !== currentUser.numero_documento) {
      const existingDoc = await prisma.usuario.findUnique({ where: { numero_documento } })

      if (existingDoc) {
        return NextResponse.json(
          { status: false, message: 'El número de documento ya está en uso por otro usuario.' },
          { status: 400 }
        )
      }
    }

    // Change password logic if provided
    if (contrasena && contrasena.trim() !== '') {
      const hashedPassword = await bcrypt.hash(contrasena, 10)

      updateData.contrasena = hashedPassword
    }

    const updatedUser = await prisma.usuario.update({
      where: { correo: session.user.email },
      data: updateData
    })

    return NextResponse.json({ status: true, message: 'Perfil actualizado exitosamente', result: updatedUser })
  } catch (error: any) {
    console.error('API Perfil Error:', error)

    return NextResponse.json({ status: false, message: error.message || 'Error interno del servidor' }, { status: 500 })
  }
}
