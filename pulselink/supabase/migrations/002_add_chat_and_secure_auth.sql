-- ─── 002_add_chat_and_secure_auth.sql ─────────────────────────────

-- Add Unique Login Access Codes & System IDs to Hospitals, Ambulances & Profiles
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;
ALTER TABLE hospitals ADD COLUMN IF NOT EXISTS hospital_code_id TEXT UNIQUE;

ALTER TABLE ambulances ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;
ALTER TABLE ambulances ADD COLUMN IF NOT EXISTS paramedic_badge_id TEXT UNIQUE;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS access_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS doctor_license_id TEXT UNIQUE;

-- ─── Clinical Smart Chat System ──────────────────────────────────
CREATE TABLE IF NOT EXISTS case_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES emergency_cases(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('paramedic', 'doctor', 'hospital_admin', 'system')),
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'ai_summary', 'telemetry_alert')),
  content TEXT NOT NULL,
  media_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_chat_messages_case_id ON case_chat_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_case_chat_messages_created_at ON case_chat_messages(created_at ASC);

-- Add to Realtime Publication
ALTER PUBLICATION supabase_realtime ADD TABLE case_chat_messages;

-- RLS Policies for Chat
ALTER TABLE case_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view case chat" ON case_chat_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can send case chat" ON case_chat_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
