import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET() {
  try {
    const students = await prisma.student.findMany()
    return NextResponse.json(students)
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
    return NextResponse.json(newStudent)
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
