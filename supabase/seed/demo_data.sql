-- =====================================================
-- PulseLink Seed / Demo Data
-- =====================================================

-- Demo Hospital
INSERT INTO hospitals (id, name, address, city, state, phone, latitude, longitude, departments)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'City General Hospital', '12 MG Road, Central District', 'Bengaluru', 'Karnataka', '+91-80-1234-5678', 12.9716, 77.5946, ARRAY['Emergency', 'Cardiology', 'Neurology', 'Trauma', 'ICU', 'Radiology']),
  ('22222222-2222-2222-2222-222222222222', 'Apollo Emergency Centre', '56 NH-48, Electronics City', 'Bengaluru', 'Karnataka', '+91-80-9876-5432', 12.8399, 77.6770, ARRAY['Emergency', 'Cardiology', 'Orthopaedics', 'ICU'])
ON CONFLICT (id) DO NOTHING;

-- Demo Ambulances
INSERT INTO ambulances (id, vehicle_number, organization, status)
VALUES
  ('aaaa0001-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'KA-01-A-0001', 'PulseLink Emergency Services', 'available'),
  ('aaaa0002-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'KA-01-A-0002', 'PulseLink Emergency Services', 'available'),
  ('aaaa0003-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'KA-01-A-0003', 'City Ambulance Network', 'available')
ON CONFLICT (id) DO NOTHING;
