import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializePrisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Initialize database connection
    await initializePrisma()

    const { email, password, name, phone, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: role || 'CUSTOMER'
      }
    })

    const token = generateToken(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}