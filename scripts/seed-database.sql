-- Database Seeding Script
-- This script creates sample data for testing the Real Estate Marketplace

-- First, let's create some sample users
-- Note: In a real application, passwords would be hashed
-- These are sample users for development/testing purposes

-- Sample Users (passwords will be hashed by the application)
-- User 1: John Doe (john@example.com, password: password123)
-- User 2: Jane Smith (jane@example.com, password: password123)
-- User 3: Mike Johnson (mike@example.com, password: password123)

-- The application will handle user creation through the registration API
-- This script focuses on creating sample listings once users are registered

-- Sample Property Listings
-- These will be inserted after users are created through the application

-- Apartment Listings
INSERT INTO listings (
  id,
  title,
  description,
  price,
  location,
  type,
  bedrooms,
  bathrooms,
  area,
  images,
  "authorId",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES 
-- Modern Downtown Apartment
(
  'listing_1',
  'Modern 2BR Apartment in Downtown',
  'Beautiful modern apartment with city views, updated kitchen, hardwood floors, and in-unit laundry. Walking distance to restaurants, shopping, and public transportation. Perfect for young professionals or students.',
  250000, -- $2,500.00 in cents
  'New York, NY',
  'apartment',
  2,
  2,
  1200,
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
  'user_id_placeholder', -- This will need to be replaced with actual user ID
  true,
  NOW(),
  NOW()
),

-- Cozy Studio
(
  'listing_2',
  'Cozy Studio Near University',
  'Perfect studio apartment for students! Located just 5 minutes from campus. Includes all utilities, high-speed internet, and access to building amenities including gym and study rooms.',
  120000, -- $1,200.00 in cents
  'Boston, MA',
  'studio',
  0,
  1,
  500,
  ARRAY['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
  'user_id_placeholder',
  true,
  NOW(),
  NOW()
),

-- Family House
(
  'listing_3',
  'Spacious 4BR Family House',
  'Beautiful family home in quiet neighborhood. Features large backyard, updated kitchen, master suite, and 2-car garage. Great schools nearby and close to parks and shopping centers.',
  450000, -- $4,500.00 in cents
  'Austin, TX',
  'house',
  4,
  3,
  2500,
  ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
  'user_id_placeholder',
  true,
  NOW(),
  NOW()
),

-- Luxury Condo
(
  'listing_4',
  'Luxury Condo with Ocean View',
  'Stunning luxury condominium with panoramic ocean views. Features high-end finishes, gourmet kitchen, spa-like bathrooms, and access to resort-style amenities including pool, fitness center, and concierge services.',
  750000, -- $7,500.00 in cents
  'Miami, FL',
  'condo',
  3,
  2,
  1800,
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  'user_id_placeholder',
  true,
  NOW(),
  NOW()
),

-- Affordable Townhouse
(
  'listing_5',
  'Affordable 3BR Townhouse',
  'Great starter home! This townhouse offers 3 bedrooms, 2.5 bathrooms, and a small patio. Recently updated with new paint and flooring. Located in a family-friendly community with playground and walking trails.',
  180000, -- $1,800.00 in cents
  'Phoenix, AZ',
  'townhouse',
  3,
  2,
  1400,
  ARRAY['https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800', 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800'],
  'user_id_placeholder',
  true,
  NOW(),
  NOW()
);

-- Note: The 'user_id_placeholder' values above need to be replaced with actual user IDs
-- after users are created through the application registration process.

-- To use this script:
-- 1. First register users through the application
-- 2. Get their actual user IDs from the database
-- 3. Replace 'user_id_placeholder' with real user IDs
-- 4. Run this script to create sample listings

-- Example of how to update with real user IDs:
-- UPDATE listings SET "authorId" = 'actual_user_id_1' WHERE id = 'listing_1';
-- UPDATE listings SET "authorId" = 'actual_user_id_2' WHERE id = 'listing_2';
-- etc.
