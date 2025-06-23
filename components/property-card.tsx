// Property Card Component
// Displays individual property information in a card format

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square } from "lucide-react"

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
  author: {
    name: string
  }
}

interface PropertyCardProps {
  listing: Listing
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  // Format price from cents to dollars
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(priceInCents / 100)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative h-48 w-full">
        <Image
          src={listing.images[0] || "/placeholder.svg?height=200&width=300"}
          alt={listing.title}
          fill
          className="object-cover"
        />
        {/* Property Type Badge */}
        <Badge className="absolute top-2 left-2 bg-blue-600">{listing.type}</Badge>
      </div>

      <CardContent className="p-4">
        {/* Property Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{listing.title}</h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{listing.location}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          {listing.bedrooms && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{listing.bedrooms} bed</span>
            </div>
          )}
          {listing.bathrooms && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{listing.bathrooms} bath</span>
            </div>
          )}
          {listing.area && (
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{listing.area} sqft</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>

        {/* Posted by */}
        <p className="text-xs text-gray-500">Posted by {listing.author.name}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {/* Price */}
        <div className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</div>

        {/* View Details Link */}
        <Link href={`/listing/${listing.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          View Details →
        </Link>
      </CardFooter>
    </Card>
  )
}
