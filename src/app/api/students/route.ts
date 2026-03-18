import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { ApiResponse } from '@/utils/libs/apiResponse'

export async function GET(request: Request) {
  try {
    const students = await prisma.usuario.findMany({
      where: { rol: 'ESTUDIANTE' }
    })

    return ApiResponse.success(request, students)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request) {
  try {
    const { nombre, apellido, correo } = await request.json()

    const newStudent = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        correo,
        rol: 'ESTUDIANTE'
      },
    })

    return ApiResponse.success(request, newStudent, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
