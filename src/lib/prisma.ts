import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Initialize database tables on first connection
let isInitialized = false

export async function initializePrisma() {
  if (isInitialized) return

  try {
    // Test connection
    await prisma.$connect()

    // Check if tables exist by trying a simple query
    try {
      await prisma.user.findFirst()
      console.log('✅ Database tables exist')
    } catch (error) {
      console.log('⚠️ Database tables do not exist, they will be created on first use')
    }

    isInitialized = true
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    throw error
  }
}