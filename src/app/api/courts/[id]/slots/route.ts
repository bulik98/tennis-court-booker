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

    const { date, startHour = 8, endHour = 22 } = await request.json()

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    // Generate hourly slots from startHour to endHour
    const slots = []
    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`

      slots.push({
        courtId: id,
        date: new Date(date),
        startTime,
        endTime
      })
    }

    // Create slots, ignoring duplicates
    const createdSlots = []
    for (const slotData of slots) {
      try {
        const slot = await prisma.timeSlot.create({
          data: slotData
        })
        createdSlots.push(slot)
      } catch {
        // Ignore duplicate slot errors (unique constraint violation)
        console.log(`Slot ${slotData.startTime} already exists for ${date}`)
      }
    }

    return NextResponse.json({
      message: `Generated ${createdSlots.length} new time slots`,
      slots: createdSlots
    })
  } catch (error) {
    console.error('Generate slots error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    const whereClause: { courtId: string; date?: Date | { gte: Date } } = { courtId: id }

    if (date) {
      const targetDate = new Date(date)
      whereClause.date = targetDate
    } else {
      // Default to today and future dates only
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      whereClause.date = {
        gte: today
      }
    }

    const slots = await prisma.timeSlot.findMany({
      where: whereClause,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    })

    return NextResponse.json(slots)
  } catch (error) {
    console.error('Get slots error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    const { slotId } = await request.json()

    if (!slotId) {
      return NextResponse.json(
        { error: 'Slot ID is required' },
        { status: 400 }
      )
    }

    // Check if slot is already booked
    const slot = await prisma.timeSlot.findUnique({
      where: { id: slotId },
      include: { booking: true }
    })

    if (!slot) {
      return NextResponse.json(
        { error: 'Slot not found' },
        { status: 404 }
      )
    }

    if (slot.booking) {
      return NextResponse.json(
        { error: 'Cannot delete a booked slot' },
        { status: 400 }
      )
    }

    await prisma.timeSlot.delete({
      where: { id: slotId }
    })

    return NextResponse.json({ message: 'Slot deleted successfully' })
  } catch (error) {
    console.error('Delete slot error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}