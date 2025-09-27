import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    // Check if database is connected and tables exist
    await prisma.$connect()

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
    if (error instanceof Error && error.message.includes('relation') || error instanceof Error && error.message.includes('table')) {
      console.log('Database tables not found, returning empty array')
      return NextResponse.json([])
    }

    return NextResponse.json(
      { error: 'Database connection failed' },
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