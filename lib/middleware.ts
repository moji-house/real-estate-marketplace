// Authentication middleware
// This file contains middleware to protect routes that require authentication

import type { NextRequest } from "next/server"
import { verifyToken } from "./auth"

/**
 * Get current user from request headers
 * Extracts JWT token from Authorization header and returns user ID
 * @param request - Next.js request object
 * @returns User ID if authenticated, null otherwise
 */
export function getCurrentUser(request: NextRequest): string | null {
  try {
    // Get Authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null
    }

    // Extract token (remove 'Bearer ' prefix)
    const token = authHeader.substring(7)

    // Verify token and extract user ID
    const decoded = verifyToken(token)
    return decoded?.userId || null
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated
 * @param request - Next.js request object
 * @returns Boolean indicating authentication status
 */
export function isAuthenticated(request: NextRequest): boolean {
  return getCurrentUser(request) !== null
}
