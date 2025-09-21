import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const court = await prisma.court.findUnique({
      where: { id },
      include: {
        owner: {
          select: { name: true, phone: true }
        },
        slots: {
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
        }
      }
    })

    if (!court) {
      return NextResponse.json(
        { error: 'Court not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(court)
  } catch (error) {
    console.error('Get court error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const court = await prisma.court.findUnique({
      where: { id }
    })

    if (!court || court.ownerId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Court not found or unauthorized' },
        { status: 404 }
      )
    }

    const { name, description, address, hourlyRate, indoor, amenities, isActive } = await request.json()

    const updatedCourt = await prisma.court.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(address && { address }),
        ...(hourlyRate && { hourlyRate: parseInt(hourlyRate) }),
        ...(indoor !== undefined && { indoor }),
        ...(amenities && { amenities: JSON.stringify(amenities) }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(updatedCourt)
  } catch (error) {
    console.error('Update court error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}