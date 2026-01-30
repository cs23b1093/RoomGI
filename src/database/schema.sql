-- Rental Truth Platform Database Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) CHECK (role IN ('tenant', 'owner')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    location VARCHAR(500) NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    property_type VARCHAR(20) CHECK (property_type IN ('apartment', 'house', 'condo', 'studio')) NOT NULL,
    beds_available INTEGER DEFAULT 1,
    total_beds INTEGER DEFAULT 1,
    verified BOOLEAN DEFAULT FALSE,
    -- Lifestyle scores (1-3: low/medium/high)
    nightlife_score INTEGER CHECK (nightlife_score >= 1 AND nightlife_score <= 3) DEFAULT 2,
    transit_score INTEGER CHECK (transit_score >= 1 AND transit_score <= 3) DEFAULT 2,
    safety_score INTEGER CHECK (safety_score >= 1 AND safety_score <= 3) DEFAULT 2,
    quietness_score INTEGER CHECK (quietness_score >= 1 AND quietness_score <= 3) DEFAULT 2,
    food_score INTEGER CHECK (food_score >= 1 AND food_score <= 3) DEFAULT 2,
    student_friendly_score INTEGER CHECK (student_friendly_score >= 1 AND student_friendly_score <= 3) DEFAULT 2,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    deposit_status VARCHAR(10) CHECK (deposit_status IN ('yes', 'partial', 'no')) NOT NULL,
    reality_rating INTEGER CHECK (reality_rating >= 1 AND reality_rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id) -- One review per user per property
);

-- Flags table (for scam/red-flag reporting)
CREATE TABLE flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_properties_owner_id ON properties(owner_id);
CREATE INDEX idx_reviews_property_id ON reviews(property_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_flags_property_id ON flags(property_id);
CREATE INDEX idx_properties_location ON properties USING gin(to_tsvector('english', location));

-- Views for common queries
CREATE VIEW property_stats AS
SELECT 
    p.id,
    p.location,
    p.rent,
    p.property_type,
    p.beds_available,
    p.total_beds,
    p.verified,
    p.nightlife_score,
    p.transit_score,
    p.safety_score,
    p.quietness_score,
    p.food_score,
    p.student_friendly_score,
    COUNT(r.id) as review_count,
    AVG(r.reality_rating) as avg_reality_rating,
    AVG(CASE 
        WHEN r.deposit_status = 'yes' THEN 100
        WHEN r.deposit_status = 'partial' THEN 50
        WHEN r.deposit_status = 'no' THEN 0
    END) as deposit_score,
    COUNT(f.id) as flag_count
FROM properties p
LEFT JOIN reviews r ON p.id = r.property_id
LEFT JOIN flags f ON p.id = f.property_id
GROUP BY p.id, p.location, p.rent, p.property_type, p.beds_available, p.total_beds, p.verified,
         p.nightlife_score, p.transit_score, p.safety_score, p.quietness_score, p.food_score, p.student_friendly_score;