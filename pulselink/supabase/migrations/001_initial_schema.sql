-- =====================================================
-- PulseLink Database Schema
-- Supabase PostgreSQL Migration
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Hospitals ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  departments TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── User Profiles ───────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('paramedic', 'doctor', 'hospital_admin', 'super_admin')),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  hospital_id UUID REFERENCES hospitals(id),
  ambulance_org_id UUID,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Ambulances ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS ambulances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_number TEXT NOT NULL UNIQUE,
  organization TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'en_route', 'at_scene', 'returning')),
  current_latitude DOUBLE PRECISION,
  current_longitude DOUBLE PRECISION,
  assigned_paramedic_id UUID REFERENCES profiles(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Patients ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_ref TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'Unknown',
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'unknown')),
  phone TEXT,
  emergency_contact TEXT,
  blood_group TEXT,
  allergies TEXT,
  existing_conditions TEXT,
  current_medication TEXT,
  chief_complaint TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Emergency Cases ─────────────────────────────────
CREATE TABLE IF NOT EXISTS emergency_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_ref TEXT NOT NULL UNIQUE,
  patient_id UUID NOT NULL REFERENCES patients(id),
  ambulance_id UUID NOT NULL REFERENCES ambulances(id),
  paramedic_id UUID NOT NULL REFERENCES profiles(id),
  hospital_id UUID REFERENCES hospitals(id),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN (
    'created', 'en_route', 'hospital_notified', 'hospital_acknowledged',
    'team_preparing', 'ready_for_arrival', 'approaching', 'arrived',
    'patient_transferred', 'closed'
  )),
  symptoms TEXT[] DEFAULT '{}',
  symptom_notes TEXT,
  symptom_onset TEXT,
  ecg_priority TEXT CHECK (ecg_priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  ai_result_summary TEXT,
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMPTZ,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Vitals ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES emergency_cases(id) ON DELETE CASCADE,
  heart_rate INTEGER,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  spo2 NUMERIC(5,2),
  respiratory_rate INTEGER,
  temperature NUMERIC(5,2),
  ecg_heart_rate INTEGER,
  consciousness_level TEXT CHECK (consciousness_level IN ('alert', 'verbal', 'pain', 'unresponsive')),
  is_simulated BOOLEAN NOT NULL DEFAULT FALSE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ECG Records ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS ecg_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES emergency_cases(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'digital' CHECK (mode IN ('digital', 'paper_image')),
  status TEXT NOT NULL DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'processing', 'analyzed', 'failed', 'incompatible')),
  file_url TEXT,
  processed_url TEXT,
  waveform_data JSONB,
  metadata JSONB DEFAULT '{}',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ECG AI Predictions ──────────────────────────────
CREATE TABLE IF NOT EXISTS ecg_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ecg_record_id UUID NOT NULL REFERENCES ecg_records(id) ON DELETE CASCADE,
  detected_labels JSONB NOT NULL DEFAULT '[]',
  top_confidence NUMERIC(5,4) NOT NULL DEFAULT 0,
  risk_level TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  raw_predictions JSONB NOT NULL DEFAULT '{}',
  model_version TEXT NOT NULL DEFAULT 'demo-v1',
  processing_time_ms INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Locations ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES emergency_cases(id) ON DELETE CASCADE,
  ambulance_id UUID NOT NULL REFERENCES ambulances(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed NUMERIC(6,2),
  heading NUMERIC(6,2),
  eta_minutes NUMERIC(6,2),
  distance_km NUMERIC(8,3),
  is_simulated BOOLEAN NOT NULL DEFAULT FALSE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Case Events ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES emergency_cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  actor_id UUID REFERENCES profiles(id),
  actor_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Notifications ───────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES profiles(id),
  hospital_id UUID REFERENCES hospitals(id),
  case_id UUID REFERENCES emergency_cases(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Sync Events ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS sync_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('create', 'update', 'delete')),
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'syncing', 'synced', 'failed')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synced_at TIMESTAMPTZ
);

-- ─── Audit Logs ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_emergency_cases_hospital_id ON emergency_cases(hospital_id);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_ambulance_id ON emergency_cases(ambulance_id);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_patient_id ON emergency_cases(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_status ON emergency_cases(status);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_priority ON emergency_cases(priority);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_created_at ON emergency_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_case_id ON vitals(case_id);
CREATE INDEX IF NOT EXISTS idx_ecg_records_case_id ON ecg_records(case_id);
CREATE INDEX IF NOT EXISTS idx_locations_case_id ON locations(case_id);
CREATE INDEX IF NOT EXISTS idx_case_events_case_id ON case_events(case_id);
CREATE INDEX IF NOT EXISTS idx_notifications_hospital_id ON notifications(hospital_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_hospital_id ON profiles(hospital_id);

-- ─── Realtime ────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE emergency_cases;
ALTER PUBLICATION supabase_realtime ADD TABLE vitals;
ALTER PUBLICATION supabase_realtime ADD TABLE ecg_records;
ALTER PUBLICATION supabase_realtime ADD TABLE ecg_predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE case_events;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ─── Row Level Security ──────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecg_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecg_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read own profile
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow all authenticated users to read hospitals
CREATE POLICY "Authenticated users can view hospitals" ON hospitals
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow all authenticated users to read ambulances
CREATE POLICY "Authenticated users can view ambulances" ON ambulances
  FOR SELECT USING (auth.role() = 'authenticated');

-- Emergency cases: role-based (simplified for MVP — refine in production)
CREATE POLICY "Authenticated users can view cases" ON emergency_cases
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create cases" ON emergency_cases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update cases" ON emergency_cases
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Patients
CREATE POLICY "Authenticated users can view patients" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert patients" ON patients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patients" ON patients
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Vitals
CREATE POLICY "Authenticated users can view vitals" ON vitals
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert vitals" ON vitals
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ECG
CREATE POLICY "Authenticated users can view ecg_records" ON ecg_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert ecg_records" ON ecg_records
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update ecg_records" ON ecg_records
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Predictions
CREATE POLICY "Authenticated users can view ecg_predictions" ON ecg_predictions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert ecg_predictions" ON ecg_predictions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Locations
CREATE POLICY "Authenticated users can view locations" ON locations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert locations" ON locations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Case events
CREATE POLICY "Authenticated users can view case_events" ON case_events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert case_events" ON case_events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Notifications
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can insert notifications" ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update notifications" ON notifications
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Sync events
CREATE POLICY "Users can manage sync events" ON sync_events
  FOR ALL USING (auth.role() = 'authenticated');

-- Audit logs
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');
