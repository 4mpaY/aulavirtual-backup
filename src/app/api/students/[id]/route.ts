import prisma from '@/utils/libs/prisma'
import { handleApiError } from '@/utils/libs/validation'
import { ApiResponse } from '@/utils/libs/apiResponse'

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const student = await prisma.student.findUnique({
      where: {
        id: Number(params.id),
      },
    })

    if (!student) {
      return ApiResponse.error(request, 'Student not found', 404)
    }

    return ApiResponse.success(request, student)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const { firstName, lastName, email } = await request.json()
    const updatedStudent = await prisma.student.update({
      where: {
        id: Number(params.id),
      },
      data: {
        firstName,
        lastName,
        email,
      },
    })

    return ApiResponse.success(request, updatedStudent)
  } catch (error) {
    return handleApiError(error, request)
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const deletedStudent = await prisma.student.delete({
      where: {
        id: Number(params.id),
      },
    })

    if (!deletedStudent) {
      return ApiResponse.error(request, 'Student not found', 404)
    }

    return ApiResponse.success(request, deletedStudent)
  } catch (error) {
    return handleApiError(error, request)
  }
}
