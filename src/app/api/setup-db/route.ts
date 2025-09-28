import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🚀 Starting database setup...')

    // Test connection first
    await prisma.$connect()
    console.log('✅ Database connected')

    // Create tables using raw SQL based on our Prisma schema
    console.log('📝 Creating tables...')

    // Create enums first
    await prisma.$executeRaw`
      CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'COURT_OWNER', 'ADMIN');
    `
    await prisma.$executeRaw`
      CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
    `

    // Create users table
    await prisma.$executeRaw`
      CREATE TABLE "users" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "phone" TEXT,
        "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      );
    `

    // Create courts table
    await prisma.$executeRaw`
      CREATE TABLE "courts" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "address" TEXT NOT NULL,
        "latitude" DOUBLE PRECISION,
        "longitude" DOUBLE PRECISION,
        "hourlyRate" INTEGER NOT NULL,
        "indoor" BOOLEAN NOT NULL DEFAULT false,
        "amenities" TEXT,
        "images" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "ownerId" TEXT NOT NULL,
        CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
      );
    `

    // Create time_slots table
    await prisma.$executeRaw`
      CREATE TABLE "time_slots" (
        "id" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "startTime" TEXT NOT NULL,
        "endTime" TEXT NOT NULL,
        "isBooked" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "courtId" TEXT NOT NULL,
        CONSTRAINT "time_slots_pkey" PRIMARY KEY ("id")
      );
    `

    // Create bookings table
    await prisma.$executeRaw`
      CREATE TABLE "bookings" (
        "id" TEXT NOT NULL,
        "date" TIMESTAMP(3) NOT NULL,
        "startTime" TEXT NOT NULL,
        "endTime" TEXT NOT NULL,
        "totalAmount" INTEGER NOT NULL,
        "commission" INTEGER NOT NULL,
        "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
        "notes" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        "customerId" TEXT NOT NULL,
        "courtId" TEXT NOT NULL,
        "slotId" TEXT NOT NULL,
        CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
      );
    `

    // Add unique constraints and indexes
    await prisma.$executeRaw`CREATE UNIQUE INDEX "users_email_key" ON "users"("email");`
    await prisma.$executeRaw`CREATE UNIQUE INDEX "time_slots_courtId_date_startTime_key" ON "time_slots"("courtId", "date", "startTime");`
    await prisma.$executeRaw`CREATE UNIQUE INDEX "bookings_slotId_key" ON "bookings"("slotId");`

    // Add foreign key constraints
    await prisma.$executeRaw`ALTER TABLE "courts" ADD CONSTRAINT "courts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
    await prisma.$executeRaw`ALTER TABLE "time_slots" ADD CONSTRAINT "time_slots_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;`
    await prisma.$executeRaw`ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`
    await prisma.$executeRaw`ALTER TABLE "bookings" ADD CONSTRAINT "bookings_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "courts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`
    await prisma.$executeRaw`ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "time_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`

    console.log('✅ All tables created successfully')

    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      tables: ['users', 'courts', 'time_slots', 'bookings'],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Database setup failed:', error)

    // If tables already exist, that's okay
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json({
        success: true,
        message: 'Database tables already exist',
        error: error.message
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}