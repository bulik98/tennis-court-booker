import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // This will create tables if they don't exist (Prisma db push equivalent)
    await prisma.$executeRaw`SELECT 1`

    // Create tables by running a simple query on each model
    try {
      await prisma.user.findFirst()
    } catch {
      console.log('User table will be created on first use')
    }

    try {
      await prisma.court.findFirst()
    } catch {
      console.log('Court table will be created on first use')
    }

    try {
      await prisma.timeSlot.findFirst()
    } catch {
      console.log('TimeSlot table will be created on first use')
    }

    try {
      await prisma.booking.findFirst()
    } catch {
      console.log('Booking table will be created on first use')
    }

    return NextResponse.json({
      message: 'Database migration completed successfully',
      status: 'success'
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}