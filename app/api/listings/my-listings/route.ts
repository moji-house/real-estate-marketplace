// My Listings API Route
// Handles fetching listings for the authenticated user

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/middleware"

// GET - Fetch current user's listings
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = getCurrentUser(request)
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Fetch user's listings
    const listings = await prisma.listing.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc", // Most recent first
      },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error("Error fetching user listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}
