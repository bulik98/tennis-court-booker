import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check environment variables
    const dbUrl = process.env.DATABASE_URL
    const jwtSecret = process.env.JWT_SECRET
    const nodeEnv = process.env.NODE_ENV

    const envStatus = {
      DATABASE_URL: dbUrl ? 'Set' : 'Missing',
      JWT_SECRET: jwtSecret ? 'Set' : 'Missing',
      NODE_ENV: nodeEnv || 'Not set'
    }

    // Test database connection
    let dbStatus = 'Unknown'
    let dbError = null

    try {
      await prisma.$connect()
      await prisma.$executeRaw`SELECT 1`
      dbStatus = 'Connected'
    } catch (error) {
      dbStatus = 'Failed'
      dbError = error instanceof Error ? error.message : 'Unknown error'
    }

    // Test if tables exist
    let tablesExist = false
    try {
      await prisma.user.findFirst()
      tablesExist = true
    } catch {
      tablesExist = false
    }

    return NextResponse.json({
      environment: envStatus,
      database: {
        status: dbStatus,
        error: dbError,
        tablesExist
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug endpoint failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}