// Database Seeding Script
// This script populates the database with sample data for development and testing

import { PrismaClient } from "@prisma/client"
import { hashPassword } from "../lib/auth"

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create sample users
    console.log('👥 Creating sample users...')
    
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-0101',
        password: await hashPassword('password123')
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1-555-0102',
        password: await hashPassword('password123')
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1-555-0103',
        password: await hashPassword('password123')
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1-555-0104',
        password: await hashPassword('password123')
      },
      {
        name: 'David Brown',
        email: 'david@example.com',
        phone: '+1-555-0105',
        password: await hashPassword('password123')
      }
    ]

    // Create users and store their IDs
    const createdUsers = []
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      })
      createdUsers.push(user)
      console.log(`✅ Created user: ${user.name} (${user.email})`)
    }

    // Create sample listings
    console.log('🏠 Creating sample listings...')
    
    const listings = [
      {
        title: 'Modern 2BR Apartment in Downtown',
        description: 'Beautiful modern apartment with city views, updated kitchen, hardwood floors, and in-unit laundry. Walking distance to restaurants, shopping, and public transportation. Perfect for young professionals or students.\n\nFeatures:\n• Hardwood floors throughout\n• Stainless steel appliances\n• In-unit washer/dryer\n• City skyline views\n• 24/7 doorman\n• Fitness center access',
        price: 250000, // $2,500.00 in cents
        location: 'New York, NY',
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop'
        ],
        authorId: createdUsers[0].id
      },
      {
        title: 'Cozy Studio Near University',
        description: 'Perfect studio apartment for students! Located just 5 minutes from campus. Includes all utilities, high-speed internet, and access to building amenities including gym and study rooms.\n\nIncludes:\n• All utilities paid\n• High-speed WiFi\n• Furnished option available\n• Study room access\n• Gym membership\n• Laundry facilities',
        price: 120000, // $1,200.00 in cents
        location: 'Boston, MA',
        type: 'studio',
        bedrooms: 0,
        bathrooms: 1,
        area: 500,
        images: [
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'
        ],
        authorId: createdUsers[1].id
      },
      {
        title: 'Spacious 4BR Family House',
        description: 'Beautiful family home in quiet neighborhood. Features large backyard, updated kitchen, master suite, and 2-car garage. Great schools nearby and close to parks and shopping centers.\n\nHighlights:\n• Large backyard with deck\n• Updated gourmet kitchen\n• Master suite with walk-in closet\n• 2-car attached garage\n• Near top-rated schools\n• Quiet family neighborhood',
        price: 450000, // $4,500.00 in cents
        location: 'Austin, TX',
        type: 'house',
        bedrooms: 4,
        bathrooms: 3,
        area: 2500,
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
        ],
        authorId: createdUsers[2].id
      },
      {
        title: 'Luxury Condo with Ocean View',
        description: 'Stunning luxury condominium with panoramic ocean views. Features high-end finishes, gourmet kitchen, spa-like bathrooms, and access to resort-style amenities including pool, fitness center, and concierge services.\n\nLuxury Features:\n• Panoramic ocean views\n• High-end finishes throughout\n• Gourmet kitchen with island\n• Spa-like master bathroom\n• Resort-style amenities\n• 24/7 concierge service',
        price: 750000, // $7,500.00 in\
