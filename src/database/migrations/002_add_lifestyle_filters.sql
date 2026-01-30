-- Add lifestyle filters and bed information to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS beds_available INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_beds INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS nightlife_score INTEGER CHECK (nightlife_score >= 1 AND nightlife_score <= 3) DEFAULT 2,
ADD COLUMN IF NOT EXISTS transit_score INTEGER CHECK (transit_score >= 1 AND transit_score <= 3) DEFAULT 2,
ADD COLUMN IF NOT EXISTS safety_score INTEGER CHECK (safety_score >= 1 AND safety_score <= 3) DEFAULT 2,
ADD COLUMN IF NOT EXISTS quietness_score INTEGER CHECK (quietness_score >= 1 AND quietness_score <= 3) DEFAULT 2,
ADD COLUMN IF NOT EXISTS food_score INTEGER CHECK (food_score >= 1 AND food_score <= 3) DEFAULT 2,
ADD COLUMN IF NOT EXISTS student_friendly_score INTEGER CHECK (student_friendly_score >= 1 AND student_friendly_score <= 3) DEFAULT 2;

-- Update the property_stats view to include new columns
DROP VIEW IF EXISTS property_stats;
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

-- Add indexes for lifestyle filters
CREATE INDEX IF NOT EXISTS idx_properties_lifestyle ON properties(nightlife_score, transit_score, safety_score, quietness_score, food_score, student_friendly_score);
CREATE INDEX IF NOT EXISTS idx_properties_rent ON properties(rent);
CREATE INDEX IF NOT EXISTS idx_properties_beds ON properties(beds_available, total_beds);