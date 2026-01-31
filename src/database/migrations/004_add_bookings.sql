-- Add bookings table for handling booking requests
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    beds_requested INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')) DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_tenant_id ON bookings(tenant_id);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Add some sample booking data
INSERT INTO bookings (property_id, tenant_id, beds_requested, status, message) 
SELECT 
    p.id,
    u.id,
    1,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'confirmed'
        WHEN RANDOM() < 0.6 THEN 'pending'
        ELSE 'rejected'
    END,
    'Sample booking request'
FROM properties p
CROSS JOIN users u
WHERE u.role = 'tenant'
LIMIT 10;