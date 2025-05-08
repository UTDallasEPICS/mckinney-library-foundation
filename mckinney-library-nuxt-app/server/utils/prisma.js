// server/utils/prisma.js
import { PrismaClient } from '@prisma/client'

// Create a singleton Prisma instance
let prisma

// Check if we're in development and need to handle hot module reloading
if (process.env.NODE_ENV === 'development') {
    // In development, use global object to store the instance
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'], // Add logging for debugging
        })
    }
    prisma = global.prisma
} else {
    // In production, just create a new instance (it will be reused across requests)
    prisma = new PrismaClient()
}

export default prisma