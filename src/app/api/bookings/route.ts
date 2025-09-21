import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { sendBookingConfirmation, sendBookingNotificationToOwner } from '@/lib/email'

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

    const { slotId, courtId } = await request.json()

    if (!slotId || !courtId) {
      return NextResponse.json(
        { error: 'Slot ID and Court ID are required' },
        { status: 400 }
      )
    }

    // Check if slot exists and is available
    const slot = await prisma.timeSlot.findUnique({
      where: { id: slotId },
      include: {
        court: {
          include: {
            owner: true
          }
        }
      }
    })

    if (!slot) {
      return NextResponse.json(
        { error: 'Time slot not found' },
        { status: 404 }
      )
    }

    if (slot.isBooked) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 400 }
      )
    }

    if (slot.courtId !== courtId) {
      return NextResponse.json(
        { error: 'Slot does not belong to this court' },
        { status: 400 }
      )
    }

    // Calculate total amount and commission (3-5% - let's use 4%)
    const totalAmount = slot.court.hourlyRate
    const commission = Math.round(totalAmount * 0.04)

    // Create booking and update slot in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update slot to mark as booked
      await tx.timeSlot.update({
        where: { id: slotId },
        data: { isBooked: true }
      })

      // Create booking
      const booking = await tx.booking.create({
        data: {
          customerId: decoded.userId,
          courtId: courtId,
          slotId: slotId,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          totalAmount: totalAmount,
          commission: commission,
          status: 'CONFIRMED'
        },
        include: {
          court: {
            include: {
              owner: true
            }
          },
          customer: true,
          slot: true
        }
      })

      return booking
    })

    // Send email notifications (don't await to avoid blocking the response)
    setImmediate(async () => {
      try {
        // Send confirmation to customer
        await sendBookingConfirmation(
          result.customer.email,
          result.customer.name,
          result.court.name,
          result.date.toISOString(),
          result.startTime,
          result.endTime,
          result.totalAmount
        )

        // Send notification to court owner
        await sendBookingNotificationToOwner(
          result.court.owner.email,
          result.court.owner.name,
          result.customer.name,
          result.customer.email,
          result.court.name,
          result.date.toISOString(),
          result.startTime,
          result.endTime,
          result.totalAmount,
          result.commission
        )
      } catch (emailError) {
        console.error('Failed to send emails:', emailError)
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    const bookings = await prisma.booking.findMany({
      where: { customerId: decoded.userId },
      include: {
        court: true,
        slot: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}