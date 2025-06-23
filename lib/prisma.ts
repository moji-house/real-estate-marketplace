// Prisma Client Configuration
// This file sets up our database connection using the singleton pattern
// to prevent multiple instances in development

import { PrismaClient } from "@prisma/client"

// Global variable to store Prisma instance in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client instance
// In production, create new instance
// In development, reuse existing instance to prevent connection issues
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // Log database queries in development
  })

// Store instance globally in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
