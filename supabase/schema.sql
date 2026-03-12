-- NOTE: Run these commands in your Supabase SQL Editor to set up the database schema

-- 1. Enable pgcrypto for UUIDs if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  video_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('ai', 'fullstack', 'in-progress', 'featured')),
  ai_system_prompt TEXT,
  view_count INTEGER DEFAULT 0,
  modal_open_count INTEGER DEFAULT 0,
  ai_chat_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create payments table for Stripe webhooks
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create feature flags table for easy toggling
CREATE TABLE feature_flags (
  flag_name TEXT PRIMARY KEY,
  enabled BOOLEAN DEFAULT true,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial feature flags
INSERT INTO feature_flags (flag_name, description) VALUES
('ai_chat_enabled', 'Toggle the AI chat functionality globally'),
('smart_contact_enabled', 'Toggle the Smart Contact / Match feature');

-- 5. Create ai_chat_sessions table to store conversation history
CREATE TABLE ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  messages JSONB DEFAULT '[]'::jsonb,
  rating INTEGER CHECK (rating IN (-1, 1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create analytics_events table for tracking behavior
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Storage Bucket for Project Images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Enable RLS on Storage so only the admin can upload through the Service Role Key
CREATE POLICY "Public Read Access to Project Images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'project-images');

CREATE POLICY "Service Role Upload Access" ON storage.objects
  FOR INSERT TO service_role WITH CHECK (bucket_id = 'project-images');


-- 8. Stored Procedures (RPCs) for atomic increments

-- Increment Project Views
CREATE OR REPLACE FUNCTION increment_project_views(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET view_count = view_count + 1
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment Chat Count
CREATE OR REPLACE FUNCTION increment_project_chat_count(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE projects
  SET ai_chat_count = ai_chat_count + 1
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 9. Row Level Security (RLS) Policies on standard tables

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Projects: Anyone can read, only Service Role (Server API) can write
CREATE POLICY "Public read projects" ON projects FOR SELECT TO public USING (true);
CREATE POLICY "Service Role full access projects" ON projects FOR ALL TO service_role USING (true);

-- Feature Flags: Anyone can read, only Service Role can write
CREATE POLICY "Public read feature_flags" ON feature_flags FOR SELECT TO public USING (true);
CREATE POLICY "Service Role full access feature_flags" ON feature_flags FOR ALL TO service_role USING (true);

-- Analytics & Chats & Payments: Only Service Role can access directly, clients use Edge Functions
CREATE POLICY "Service Role full access AI sessions" ON ai_chat_sessions FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access Analytics" ON analytics_events FOR ALL TO service_role USING (true);
CREATE POLICY "Service Role full access Payments" ON payments FOR ALL TO service_role USING (true);
