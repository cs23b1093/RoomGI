-- Sample data for testing the lifestyle filters feature
-- Run this after the database is connected

-- Sample users
INSERT INTO users (id, email, password_hash, role) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'owner1@example.com', 'password123', 'owner'),
('550e8400-e29b-41d4-a716-446655440002', 'owner2@example.com', 'password123', 'owner'),
('550e8400-e29b-41d4-a716-446655440003', 'tenant1@example.com', 'password123', 'tenant'),
('550e8400-e29b-41d4-a716-446655440004', 'tenant2@example.com', 'password123', 'tenant');

-- Sample properties with lifestyle scores
INSERT INTO properties (id, owner_id, location, rent, property_type, beds_available, total_beds, nightlife_score, transit_score, safety_score, quietness_score, food_score, student_friendly_score, verified) VALUES 
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Koramangala, Bangalore', 25000, 'apartment', 2, 3, 3, 3, 2, 2, 3, 3, true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Indiranagar, Bangalore', 30000, 'apartment', 1, 2, 3, 2, 2, 2, 3, 2, true),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Whitefield, Bangalore', 20000, 'house', 3, 4, 1, 1, 3, 3, 2, 1, false),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'HSR Layout, Bangalore', 28000, 'apartment', 1, 2, 2, 3, 3, 2, 3, 3, true),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Electronic City, Bangalore', 18000, 'studio', 1, 1, 1, 2, 3, 3, 2, 2, false),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'MG Road, Bangalore', 35000, 'condo', 2, 2, 3, 3, 2, 1, 3, 2, true);

-- Sample reviews
INSERT INTO reviews (user_id, property_id, deposit_status, reality_rating, comment) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'yes', 5, 'Great property, got full deposit back!'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', 'yes', 4, 'Good experience overall'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'partial', 3, 'Only got 70% deposit back'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', 'yes', 5, 'Excellent landlord, highly recommended'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', 'no', 2, 'Did not return deposit, avoid this property');

-- Sample flags
INSERT INTO flags (user_id, property_id, reason, description) VALUES 
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', 'deposit_scam', 'Owner refused to return deposit without valid reason'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005', 'maintenance_issues', 'Multiple maintenance issues not addressed');