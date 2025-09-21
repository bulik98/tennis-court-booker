import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
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

    // Verify court ownership
    const court = await prisma.court.findUnique({
      where: { id }
    })

    if (!court || court.ownerId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Court not found or unauthorized' },
        { status: 404 }
      )
    }

    const { date, startTime, endTime } = await request.json()

    if (!date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Date, start time, and end time are required' },
        { status: 400 }
      )
    }

    // Validate time format and logic
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    // Check for overlapping slots
    const targetDate = new Date(date)
    const existingSlots = await prisma.timeSlot.findMany({
      where: {
        courtId: id,
        date: targetDate
      }
    })

    // Check for time conflicts
    for (const existingSlot of existingSlots) {
      const existingStart = existingSlot.startTime
      const existingEnd = existingSlot.endTime

      // Check if new slot overlaps with existing slot
      if (
        (startTime >= existingStart && startTime < existingEnd) ||
        (endTime > existingStart && endTime <= existingEnd) ||
        (startTime <= existingStart && endTime >= existingEnd)
      ) {
        return NextResponse.json(
          { error: `Time slot conflicts with existing slot ${existingStart}-${existingEnd}` },
          { status: 400 }
        )
      }
    }

    // Create the custom slot
    const slot = await prisma.timeSlot.create({
      data: {
        courtId: id,
        date: targetDate,
        startTime,
        endTime
      }
    })

    return NextResponse.json({
      message: 'Custom slot created successfully',
      slot
    })
  } catch (error) {
    console.error('Create custom slot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}