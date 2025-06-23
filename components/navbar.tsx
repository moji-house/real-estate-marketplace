"use client"

// Navigation Bar Component
// This component provides site navigation and user authentication status

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, User, PlusCircle, LogOut } from "lucide-react"
import { useEffect, useState } from "react"

export default function Navbar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    const name = localStorage.getItem("userName")

    if (token && name) {
      setIsLoggedIn(true)
      setUserName(name)
    }
  }, [])

  // Handle user logout
  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")

    // Update component state
    setIsLoggedIn(false)
    setUserName("")

    // Redirect to home page
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">RealEstate Hub</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              // Authenticated user navigation
              <>
                <span className="text-gray-700">Welcome, {userName}!</span>
                <Link href="/my-listings">
                  <Button variant="ghost" size="sm">
                    My Listings
                  </Button>
                </Link>
                <Link href="/post-listing">
                  <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Post Listing
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              // Guest user navigation
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
