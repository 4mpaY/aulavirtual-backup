import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { ApiResponse } from '@/utils/libs/apiResponse'

export async function GET(request: Request) {
  try {
    const students = await prisma.student.findMany()

    return ApiResponse.success(request, students)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email } = await request.json()

    const newStudent = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email,
      },
    })

    return ApiResponse.success(request, newStudent, 201)
  } catch (error) {
    return handleApiError(error, request)
  }
}
