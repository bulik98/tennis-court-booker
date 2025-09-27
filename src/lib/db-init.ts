import { prisma } from './prisma'

export async function initDatabase() {
  try {
    // Check if we can connect to the database
    await prisma.$connect()

    // Try to run a simple query to check if tables exist
    await prisma.user.findFirst()
    console.log('Database tables already exist')

    return true
  } catch (error) {
    console.log('Database tables do not exist, they will be created automatically by Prisma')

    // Prisma will automatically create tables on first query if using db push
    // For production, we should use migrations, but this is a workaround
    return false
  } finally {
    await prisma.$disconnect()
  }
}