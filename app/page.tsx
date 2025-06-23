"use client"

import type React from "react"

// Home Page - Property Search and Listings
// This is the main landing page where users can search for properties

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PropertyCard from "@/components/property-card"
import { Search, Filter } from "lucide-react"

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

export default function HomePage() {
  // State management for search functionality
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [propertyType, setPropertyType] = useState("all")

  // Fetch all listings when component mounts
  useEffect(() => {
    fetchListings()
  }, [])

  // Apply filters whenever search criteria change
  useEffect(() => {
    applyFilters()
  }, [listings, searchTerm, priceRange, propertyType])

  /**
   * Fetch all property listings from the API
   */
  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings")
      if (response.ok) {
        const data = await response.json()
        setListings(data)
      } else {
        console.error("Failed to fetch listings")
      }
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Apply search and filter criteria to listings
   */
  const applyFilters = () => {
    let filtered = listings

    // Filter by search term (title, description, location)
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by property type
    if (propertyType !== "all") {
      filtered = filtered.filter((listing) => listing.type === propertyType)
    }

    // Filter by price range
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((listing) => {
        const price = listing.price / 100 // Convert from cents to dollars
        if (max) {
          return price >= min && price <= max
        } else {
          return price >= min // For "500000+" range
        }
      })
    }

    setFilteredListings(filtered)
  }

  /**
   * Handle search form submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters() // Filters are already applied via useEffect, but this ensures immediate response
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find Your Perfect Home</h1>
            <p className="text-xl text-blue-100">Discover amazing properties in your desired location</p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <Input
                    type="text"
                    placeholder="Search by location, title, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Property Type Filter */}
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                  </SelectContent>
                </Select>

                {/* Price Range Filter */}
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Price</SelectItem>
                    <SelectItem value="0-100000">Under $100k</SelectItem>
                    <SelectItem value="100000-250000">$100k - $250k</SelectItem>
                    <SelectItem value="250000-500000">$250k - $500k</SelectItem>
                    <SelectItem value="500000-1000000">$500k - $1M</SelectItem>
                    <SelectItem value="1000000">$1M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="mt-4 text-center">
                <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-5 w-5 mr-2" />
                  Search Properties
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Properties</h2>
            <p className="text-gray-600 mt-1">{filteredListings.length} properties found</p>
          </div>

          {/* Filter indicator */}
          {(searchTerm || priceRange || propertyType !== "all") && (
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-1" />
              Filters applied
            </div>
          )}
        </div>

        {/* Property Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          // No results message
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all available properties.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setPriceRange("")
                setPropertyType("all")
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
