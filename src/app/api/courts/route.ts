import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializePrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    // Initialize database connection
    await initializePrisma()

    const courts = await prisma.court.findMany({
      where: { isActive: true },
      include: {
        owner: {
          select: { name: true, phone: true }
        }
      }
    })

    return NextResponse.json(courts)
  } catch (error) {
    console.error('Get courts error:', error)

    // Return empty array instead of error to prevent frontend crash
    if (error instanceof Error && (
      error.message.includes('relation') ||
      error.message.includes('table') ||
      error.message.includes('does not exist') ||
      error.message.includes('P2021') // Prisma error for missing table
    )) {
      console.log('Database tables not found, returning empty array')
      return NextResponse.json([])
    }

    // If it's a connection error, also return empty array
    if (error instanceof Error && (
      error.message.includes('connection') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('timeout')
    )) {
      console.log('Database connection failed, returning empty array')
      return NextResponse.json([])
    }

    return NextResponse.json(
      { error: 'Database error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { name, description, address, hourlyRate, indoor, amenities } = await request.json()

    if (!name || !address || !hourlyRate) {
      return NextResponse.json(
        { error: 'Name, address, and hourly rate are required' },
        { status: 400 }
      )
    }

    const court = await prisma.court.create({
      data: {
        name,
        description,
        address,
        hourlyRate: parseInt(hourlyRate),
        indoor: indoor || false,
        amenities: amenities ? JSON.stringify(amenities) : null,
        ownerId: decoded.userId
      }
    })

    return NextResponse.json(court)
  } catch (error) {
    console.error('Create court error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}