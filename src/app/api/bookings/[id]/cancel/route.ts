import { NextRequest, NextResponse } from 'next/server'
import { prisma, initializePrisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initializePrisma()

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

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        slot: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify the booking belongs to the user
    if (booking.customerId !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if booking can be cancelled (24 hours before)
    const bookingDate = new Date(booking.date)
    const now = new Date()
    const timeDiff = bookingDate.getTime() - now.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    if (hoursDiff <= 24) {
      return NextResponse.json(
        { error: 'Cannot cancel booking less than 24 hours before the scheduled time' },
        { status: 400 }
      )
    }

    // Check if booking is already cancelled or completed
    if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
      return NextResponse.json(
        { error: 'Cannot cancel this booking' },
        { status: 400 }
      )
    }

    // Update booking status and free up the time slot
    await prisma.$transaction(async (tx) => {
      // Update booking status
      await tx.booking.update({
        where: { id },
        data: { status: 'CANCELLED' }
      })

      // Free up the time slot
      await tx.timeSlot.update({
        where: { id: booking.slotId },
        data: { isBooked: false }
      })
    })

    return NextResponse.json({
      message: 'Booking cancelled successfully'
    })
  } catch (error) {
    console.error('Cancel booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}