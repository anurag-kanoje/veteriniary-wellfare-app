-- =========================================
-- SAFE MIGRATION: CREATE TABLES IF NOT EXIST
-- =========================================
-- This migration creates all required tables without dropping existing data
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/your-project-id/sql

-- =========================================
-- USERS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT CHECK (role IN ('farmer','vet','admin')),
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- ANIMALS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  species TEXT,
  breed TEXT,
  date_of_birth DATE,
  health_status TEXT,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_animals_user_id ON animals(user_id);

-- =========================================
-- HEALTH RECORDS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  record_type TEXT CHECK (record_type IN ('checkup','vaccination','treatment','surgery','other')),
  title TEXT NOT NULL,
  description TEXT,
  veterinarian_name TEXT,
  clinic_name TEXT,
  cost DECIMAL,
  medications TEXT[],
  notes TEXT,
  record_date DATE,
  next_visit_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(record_date);

-- =========================================
-- RESCUE NGOs TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS rescue_ngos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT,
  email TEXT,
  location JSONB,
  service_radius INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- RESCUE REPORTS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS rescue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id),
  animal_type TEXT,
  animal_description TEXT,
  location JSONB,
  images TEXT[],
  urgency_level TEXT,
  description TEXT,
  contact_phone TEXT,
  status TEXT,
  assigned_ngo_id UUID REFERENCES rescue_ngos(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rescue_reports_reporter_id ON rescue_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_rescue_reports_status ON rescue_reports(status);

-- =========================================
-- VETERINARIANS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS veterinarians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  license_number TEXT UNIQUE,
  specialization TEXT,
  clinic_name TEXT,
  clinic_address TEXT,
  clinic_phone TEXT,
  location JSONB,
  service_radius INTEGER,
  consultation_fee DECIMAL,
  available BOOLEAN DEFAULT TRUE,
  rating DECIMAL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_veterinarians_user_id ON veterinarians(user_id);
CREATE INDEX IF NOT EXISTS idx_veterinarians_location ON veterinarians USING GIN (location);

-- =========================================
-- TELE-CONSULTATIONS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS tele_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vet_id UUID REFERENCES veterinarians(id) ON DELETE CASCADE,
  animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  images TEXT[],
  urgency_level TEXT,
  status TEXT,
  contact_phone TEXT,
  location JSONB,
  vet_response TEXT,
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tele_consultations_farmer_id ON tele_consultations(farmer_id);
CREATE INDEX IF NOT EXISTS idx_tele_consultations_vet_id ON tele_consultations(vet_id);
CREATE INDEX IF NOT EXISTS idx_tele_consultations_status ON tele_consultations(status);

-- =========================================
-- POSTS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- =========================================
-- COMMENTS TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- =========================================
-- LIKES TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);

-- =========================================
-- MEDICINE DIRECTORY TABLE
-- =========================================

CREATE TABLE IF NOT EXISTS medicine_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  manufacturer TEXT,
  dosage TEXT,
  side_effects TEXT,
  contraindications TEXT,
  storage_requirements TEXT,
  price_range TEXT,
  availability TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medicine_directory_category ON medicine_directory(category);

-- =========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rescue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Animals can only be accessed by their owner
CREATE POLICY "Users can view own animals"
  ON animals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own animals"
  ON animals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own animals"
  ON animals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own animals"
  ON animals FOR DELETE
  USING (auth.uid() = user_id);

-- Health records can only be accessed through owned animals
CREATE POLICY "Users can view health records of own animals"
  ON health_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert health records for own animals"
  ON health_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update health records of own animals"
  ON health_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete health records of own animals"
  ON health_records FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM animals
      WHERE animals.id = health_records.animal_id
      AND animals.user_id = auth.uid()
    )
  );

-- Rescue reports can only be accessed by reporter
CREATE POLICY "Users can view own rescue reports"
  ON rescue_reports FOR SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can insert own rescue reports"
  ON rescue_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can update own rescue reports"
  ON rescue_reports FOR UPDATE
  USING (auth.uid() = reporter_id);

-- Tele-consultations can be accessed by farmer or vet
CREATE POLICY "Users can view own consultations"
  ON tele_consultations FOR SELECT
  USING (auth.uid() = farmer_id OR auth.uid() = vet_id);

CREATE POLICY "Users can insert consultations"
  ON tele_consultations FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Vets can update consultations"
  ON tele_consultations FOR UPDATE
  USING (auth.uid() = vet_id);

-- Posts can be viewed by all, but only edited by owner
CREATE POLICY "Anyone can view posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

-- Comments can be viewed by all, but only edited by owner
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Likes can be viewed by all, but only edited by owner
CREATE POLICY "Anyone can view likes"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- =========================================
-- FUNCTIONS AND TRIGGERS
-- =========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON animals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rescue_reports_updated_at BEFORE UPDATE ON rescue_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tele_consultations_updated_at BEFORE UPDATE ON tele_consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================
-- DONE
-- =========================================
