// Individual Listing API Route
// Handles operations on specific listings (GET, PUT, DELETE)

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/middleware"

// GET - Fetch specific listing by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: params.id,
        isActive: true, // Only return active listings
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

// PUT - Update specific listing
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const userId = getCurrentUser(request)
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if listing exists and belongs to user
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (existingListing.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized to update this listing" }, { status: 403 })
    }

    // Parse request body
    const { title, description, price, location, type, bedrooms, bathrooms, area, images } = await request.json()

    // Convert price to cents for storage
    const priceInCents = price ? Math.round(Number.parseFloat(price) * 100) : existingListing.price

    // Update listing
    const updatedListing = await prisma.listing.update({
      where: { id: params.id },
      data: {
        title: title || existingListing.title,
        description: description || existingListing.description,
        price: priceInCents,
        location: location || existingListing.location,
        type: type || existingListing.type,
        bedrooms: bedrooms ? Number.parseInt(bedrooms) : existingListing.bedrooms,
        bathrooms: bathrooms ? Number.parseInt(bathrooms) : existingListing.bathrooms,
        area: area ? Number.parseInt(area) : existingListing.area,
        images: images || existingListing.images,
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
      message: "Listing updated successfully",
      listing: updatedListing,
    })
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}

// DELETE - Delete specific listing
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const userId = getCurrentUser(request)
    if (!userId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Check if listing exists and belongs to user
    const existingListing = await prisma.listing.findUnique({
      where: { id: params.id },
    })

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    if (existingListing.authorId !== userId) {
      return NextResponse.json({ error: "Unauthorized to delete this listing" }, { status: 403 })
    }

    // Delete listing
    await prisma.listing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: "Listing deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting listing:", error)
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 })
  }
}
