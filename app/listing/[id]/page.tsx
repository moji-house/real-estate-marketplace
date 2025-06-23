"use client"

// Property Details Page
// Displays detailed information about a specific property listing

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Bed, Bath, Square, User, Phone, Mail, ArrowLeft, Heart, Share2 } from "lucide-react"

// Define the structure of a detailed listing
interface DetailedListing {
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
  author: {
    id: string
    name: string
    email: string
    phone?: string
  }
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const listingId = params.id as string

  // State management
  const [listing, setListing] = useState<DetailedListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isOwner, setIsOwner] = useState(false)

  // Fetch listing details on component mount
  useEffect(() => {
    if (listingId) {
      fetchListingDetails()
    }
  }, [listingId])

  // Check if current user is the owner of this listing
  useEffect(() => {
    if (listing) {
      const userId = localStorage.getItem("userId")
      setIsOwner(userId === listing.author.id)
    }
  }, [listing])

  /**
   * Fetch detailed listing information from the API
   */
  const fetchListingDetails = async () => {
    try {
      const response = await fetch(`/api/listings/${listingId}`)

      if (response.ok) {
        const data = await response.json()
        setListing(data)
      } else if (response.status === 404) {
        setError("Property listing not found")
      } else {
        setError("Failed to load property details")
      }
    } catch (error) {
      console.error("Error fetching listing details:", error)
      setError("An error occurred while loading the property details")
    } finally {
      setLoading(false)
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
      month: "long",
      day: "numeric",
    })
  }

  /**
   * Handle sharing the listing
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: listing?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Alert variant="destructive">
            <AlertDescription>{error || "Property not found"}</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => router.back()} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listings
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96 w-full">
                <Image
                  src={listing.images[currentImageIndex] || "/placeholder.svg?height=400&width=600"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />

                {/* Image Navigation */}
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                      {listing.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Type Badge */}
                <Badge className="absolute top-4 left-4 bg-blue-600">{listing.type}</Badge>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="sm" variant="secondary" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-lg">{listing.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{formatPrice(listing.price)}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Property Features */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {listing.bedrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bed className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{listing.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Bath className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{listing.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathrooms</div>
                    </div>
                  )}
                  {listing.area && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Square className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <div className="font-semibold">{listing.area}</div>
                      <div className="text-sm text-gray-600">Sq Ft</div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>

                <Separator className="my-6" />

                {/* Listing Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Listing Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Listed on:</span>
                      <div className="font-medium">{formatDate(listing.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Last updated:</span>
                      <div className="font-medium">{formatDate(listing.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Information
                </CardTitle>
                <CardDescription>Get in touch with the property owner</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <div className="font-medium text-lg">{listing.author.name}</div>
                  <div className="text-gray-600">Property Owner</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <a href={`mailto:${listing.author.email}`} className="text-blue-600 hover:underline">
                      {listing.author.email}
                    </a>
                  </div>

                  {listing.author.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      <a href={`tel:${listing.author.phone}`} className="text-blue-600 hover:underline">
                        {listing.author.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Contact Buttons */}
                <div className="space-y-2 pt-4">
                  <Button className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>

                  {listing.author.phone && (
                    <Button variant="outline" className="w-full" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Owner Actions */}
            {isOwner && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Listing</CardTitle>
                  <CardDescription>You are the owner of this property</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                  <Link href={`/edit-listing/${listing.id}`}>
                    <Button variant="outline" className="w-full">
                      Edit Listing
                    </Button>
                  </Link>

                  <Link href="/my-listings">
                    <Button variant="outline" className="w-full">
                      View All My Listings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium capitalize">{listing.type}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">{formatPrice(listing.price)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{listing.location}</span>
                </div>

                {listing.bedrooms && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-medium">{listing.bedrooms}</span>
                  </div>
                )}

                {listing.bathrooms && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-medium">{listing.bathrooms}</span>
                  </div>
                )}

                {listing.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area</span>
                    <span className="font-medium">{listing.area} sq ft</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
