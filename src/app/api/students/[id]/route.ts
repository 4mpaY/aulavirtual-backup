import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

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
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(student)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      )
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

    return NextResponse.json(updatedStudent)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      )
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
      return NextResponse.json(
        { message: 'Student not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(deletedStudent)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      )
  }
}
