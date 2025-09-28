import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializePrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await initializePrisma()

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

    // Fetch all bookings for the user
    const bookings = await prisma.booking.findMany({
      where: {
        customerId: decoded.userId
      },
      include: {
        court: {
          include: {
            owner: {
              select: {
                name: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Fetch user bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}