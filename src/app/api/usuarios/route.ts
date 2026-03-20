export const dynamic = 'force-dynamic'

import bcrypt from 'bcryptjs'

import prisma from '@/utils/libs/prisma'
import { crearUsuarioSchema, listarUsuariosQuerySchema } from '@/schemas/usuario.schema'
import { validateRequest, handleApiError } from '@/utils/libs/validation'
import { requireAdmin } from '@/utils/libs/auth-helpers'
import { ApiResponse } from '@/utils/libs/apiResponse'

/**
 * GET /api/usuarios
 * Listar todos los usuarios (solo ADMIN)
 */
export async function GET(request: Request) {
  try {
    // Verificar que sea admin
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())

    // Validar query params
    const validation = validateRequest(listarUsuariosQuerySchema, query, request)

    if (!validation.success) {
      return validation.error
    }

    const { page, limit, rol, buscar, esta_activo } = validation.data

    // Construir filtros
    const where: any = {}

    if (rol) {
      where.rol = rol
    }

    if (esta_activo !== undefined) {
      where.esta_activo = esta_activo
    }

    if (buscar) {
      where.OR = [
        { nombre: { contains: buscar, mode: 'insensitive' } },
        { apellido: { contains: buscar, mode: 'insensitive' } },
        { correo: { contains: buscar, mode: 'insensitive' } },
        { numero_documento: { contains: buscar } }
      ]
    }

    // Calcular paginación
    const skip = (page - 1) * limit

    // Consultar usuarios
    const [usuarios, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        skip,
        take: limit,
        orderBy: { creado_en: 'desc' },
        select: {
          id: true,
          correo: true,
          nombre: true,
          apellido: true,
          numero_documento: true,
          celular: true,
          avatar: true,
          biografia: true,
          rol: true,
          esta_activo: true,
          creado_en: true,
          actualizado_en: true
        }
      }),
      prisma.usuario.count({ where })
    ])

    return ApiResponse.success(request, {
      usuarios,
      paginacion: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return handleApiError(error, request)
  }
}

/**
 * POST /api/usuarios
 * Crear un nuevo usuario (solo ADMIN)
 */
export async function POST(request: Request) {
  try {
    // Verificar que sea admin
    const auth = await requireAdmin(request)

    if (!auth.authorized) {
      return auth.error
    }

    const body = await request.json()

    // Validar datos
    const validation = validateRequest(crearUsuarioSchema, body, request)

    if (!validation.success) {
      return validation.error
    }

    const { correo, contrasena, nombre, apellido, numero_documento, celular, rol, biografia, avatar } =
      validation.data

    // Verificar si el correo ya existe
    const correoExistente = await prisma.usuario.findUnique({
      where: { correo }
    })

    if (correoExistente) {
      return ApiResponse.error(request, 'El correo ya está registrado', 409)
    }

    // Verificar si el número de documento ya existe
    const documentoExistente = await prisma.usuario.findUnique({
      where: { numero_documento }
    })

    if (documentoExistente) {
      return ApiResponse.error(request, 'El número de documento ya está registrado', 409)
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10)

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        correo,
        contrasena: hashedPassword,
        nombre,
        apellido,
        numero_documento,
        celular: celular || null,
        rol: rol || 'ESTUDIANTE',
        biografia: biografia || null,
        avatar: avatar || null
      },
      select: {
        id: true,
        correo: true,
        nombre: true,
        apellido: true,
        numero_documento: true,
        celular: true,
        avatar: true,
        biografia: true,
        rol: true,
        esta_activo: true,
        creado_en: true
      }
    })

    return ApiResponse.success(request, { usuario: nuevoUsuario }, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
