// Authentication utilities
// This file contains helper functions for password hashing and JWT operations

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Secret key for JWT signing (should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

/**
 * Hash a plain text password
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12 // Higher number = more secure but slower
  return bcrypt.hash(password, saltRounds)
}

/**
 * Compare plain text password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns Boolean indicating if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Generate JWT token for user
 * @param userId - User's unique identifier
 * @returns JWT token string
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
}

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}
