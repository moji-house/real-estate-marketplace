"use client"

// My Listings Page
// Displays and manages the current user's property listings

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, PlusCircle, Home } from "lucide-react"
import Image from "next/image"

// Define the structure of a property listing
interface Listing {
  id: string
  title: string
  description: string
  price: number
  location: string
  type: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function MyListingsPage() {
  const router = useRouter()

  // State management
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  // Check authentication and fetch listings on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchMyListings()
  }, [router])

  /**
   * Fetch user's listings from the API
   */
  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/listings/my-listings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setListings(data)
      } else if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        localStorage.removeItem("userName")
        router.push("/login")
      } else {
        setError("Failed to fetch your listings")
      }
    } catch (error) {
      console.error("Error fetching listings:", error)
      setError("An error occurred while fetching your listings")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle listing deletion
   */
  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return
    }

    setDeleteLoading(listingId)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Remove listing from state
        setListings((prev) => prev.filter((listing) => listing.id !== listingId))
      } else {
        setError("Failed to delete listing")
      }
    } catch (error) {
      console.error("Error deleting listing:", error)
      setError("An error occurred while deleting the listing")
    } finally {
      setDeleteLoading(null)
    }
  }

  /**
   * Format price from cents to dollars
   */
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(priceInCents / 100)
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your listings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Home className="h-8 w-8 mr-3 text-blue-600" />
                My Listings
              </h1>
              <p className="text-gray-600 mt-2">Manage your property listings and track their performance</p>
            </div>

            {/* Add New Listing Button */}
            <Link href="/post-listing">
              <Button size="lg">
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                {/* Listing Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={listing.images[0] || "/placeholder.svg?height=200&width=300"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  {/* Status Badge */}
                  <Badge
                    className={`absolute top-2 left-2 ${
                      listing.isActive ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    {listing.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {/* Property Type Badge */}
                  <Badge className="absolute top-2 right-2 bg-blue-600">{listing.type}</Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Property Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</span>
                      <span className="text-sm text-gray-500">{listing.location}</span>
                    </div>

                    {/* Property specs */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {listing.bedrooms && <span>{listing.bedrooms} bed</span>}
                      {listing.bathrooms && <span>{listing.bathrooms} bath</span>}
                      {listing.area && <span>{listing.area} sqft</span>}
                    </div>

                    {/* Creation date */}
                    <p className="text-xs text-gray-500">Created: {formatDate(listing.createdAt)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {/* View Details */}
                    <Link href={`/listing/${listing.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>

                    {/* Edit Listing */}
                    <Link href={`/edit-listing/${listing.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>

                    {/* Delete Listing */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(listing.id)}
                      disabled={deleteLoading === listing.id}
                      className="flex-1"
                    >
                      {deleteLoading === listing.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // No listings message
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Home className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't created any property listings yet. Start by adding your first listing!
            </p>
            <Link href="/post-listing">
              <Button size="lg">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Your First Listing
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
