-- Add latitude and longitude columns to properties table
ALTER TABLE properties 
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Add some sample coordinates for existing properties (Bangalore area)
UPDATE properties SET 
  latitude = 12.9716 + (RANDOM() * 0.1 - 0.05),
  longitude = 77.5946 + (RANDOM() * 0.1 - 0.05)
WHERE latitude IS NULL;

-- Create index for geospatial queries
CREATE INDEX idx_properties_coordinates ON properties(latitude, longitude);