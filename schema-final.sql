-- =========================================
-- RESET DATABASE
-- =========================================

DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
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
-- ANIMALS
-- =========================================

CREATE TABLE animals (
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

CREATE INDEX idx_animals_user_id ON animals(user_id);

-- =========================================
-- HEALTH RECORDS
-- =========================================

CREATE TABLE health_records (
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

CREATE INDEX idx_health_records_animal_id ON health_records(animal_id);
CREATE INDEX idx_health_records_date ON health_records(record_date);

-- =========================================
-- RESCUE NGOs
-- =========================================

CREATE TABLE rescue_ngos (
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
-- RESCUE REPORTS
-- =========================================

CREATE TABLE rescue_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id),
  animal_type TEXT,
  animal_description TEXT,
  location JSONB,
  images TEXT[],
  urgency_level TEXT,
  description TEXT,
  contact_phone TEXT,
  status TEXT DEFAULT 'reported',
  assigned_ngo_id UUID REFERENCES rescue_ngos(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rescue_status ON rescue_reports(status);

-- =========================================
-- DISEASE DATABASE
-- =========================================

CREATE TABLE diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT,
  name_hi TEXT,
  animal_type TEXT,
  category TEXT,
  severity TEXT,
  description_en TEXT,
  description_hi TEXT,
  symptoms JSONB,
  causes JSONB,
  first_aid JSONB,
  prevention_tips TEXT[],
  common_medications TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- VET PROFILES
-- =========================================

CREATE TABLE vet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  specialization TEXT[],
  experience_years INTEGER,
  consultation_fee DECIMAL,
  languages TEXT[],
  available_for_teleconsultation BOOLEAN DEFAULT TRUE,
  rating DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- TELE CONSULTATIONS
-- =========================================

CREATE TABLE tele_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES users(id),
  vet_id UUID REFERENCES users(id),
  animal_id UUID REFERENCES animals(id),
  title TEXT,
  description TEXT,
  images TEXT[],
  urgency_level TEXT,
  status TEXT DEFAULT 'pending',
  contact_phone TEXT,
  location JSONB,
  vet_response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_consult_farmer ON tele_consultations(farmer_id);

-- =========================================
-- MEDICINES
-- =========================================

CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT,
  name_hi TEXT,
  generic_name TEXT,
  category TEXT,
  dosage_form TEXT,
  manufacturer TEXT,
  description_en TEXT,
  description_hi TEXT,
  price_range JSONB,
  animal_types TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_medicine_name ON medicines(name_en);

-- =========================================
-- MEDICINE STORES
-- =========================================

CREATE TABLE medicine_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type TEXT,
  phone TEXT,
  address TEXT,
  location JSONB,
  delivery_available BOOLEAN DEFAULT FALSE,
  emergency_service BOOLEAN DEFAULT FALSE,
  rating DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- GAUSHALAS
-- =========================================

CREATE TABLE gaushalas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  address TEXT,
  phone TEXT,
  location JSONB,
  capacity INTEGER,
  current_animal_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- GAUSHALA ANIMALS
-- =========================================

CREATE TABLE gaushala_animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gaushala_id UUID REFERENCES gaushalas(id),
  name TEXT,
  breed TEXT,
  gender TEXT,
  date_of_birth DATE,
  health_status TEXT,
  tag_number TEXT,
  qr_code TEXT UNIQUE,
  images TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gaushala_animals ON gaushala_animals(gaushala_id);

-- =========================================
-- SOCIAL POSTS
-- =========================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id,user_id)
);

-- =========================================
-- ENABLE RLS
-- =========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE rescue_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_consultations ENABLE ROW LEVEL SECURITY;

-- =========================================
-- POLICIES
-- =========================================

CREATE POLICY users_read_profile
ON users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY users_update_profile
ON users
FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY animals_manage
ON animals
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY health_records_manage
ON health_records
FOR ALL
USING (
  animal_id IN (
    SELECT id FROM animals WHERE user_id = auth.uid()
  )
);

CREATE POLICY rescue_view
ON rescue_reports
FOR SELECT
USING (true);

CREATE POLICY rescue_insert
ON rescue_reports
FOR INSERT
WITH CHECK (reporter_id = auth.uid());

-- =========================================
-- STORAGE BUCKETS
-- =========================================

INSERT INTO storage.buckets (id,name,public)
VALUES
('rescue-images','rescue-images',true),
('consultation-images','consultation-images',true),
('gaushala-animal-images','gaushala-animal-images',true),
('post-images','post-images',true),
('profile-images','profile-images',true)
ON CONFLICT (id) DO NOTHING;
