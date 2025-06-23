// Listings API Route
// Handles CRUD operations for property listings

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/middleware"

// GET - Fetch all active listings
export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: {
        isActive: true, // Only return active listings
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recent first
      },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}

// POST - Create new listing
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = getCurrentUser(request)
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Parse request body
    const { title, description, price, location, type, bedrooms, bathrooms, area, images } = await request.json()

    // Validate required fields
    if (!title || !description || !price || !location || !type) {
      return NextResponse.json({ error: "Title, description, price, location, and type are required" }, { status: 400 })
    }

    // Convert price to cents for storage
    const priceInCents = Math.round(Number.parseFloat(price) * 100)

    // Create new listing
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: priceInCents,
        location,
        type,
        bedrooms: bedrooms ? Number.parseInt(bedrooms) : null,
        bathrooms: bathrooms ? Number.parseInt(bathrooms) : null,
        area: area ? Number.parseInt(area) : null,
        images: images || [],
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: "Listing created successfully",
      listing,
    })
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}
