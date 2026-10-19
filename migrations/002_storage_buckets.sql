-- =========================================
-- STORAGE BUCKETS SETUP
-- =========================================
-- Run this in Supabase SQL Editor after creating tables
-- This sets up storage buckets for animal profile images and health record images

-- Enable storage extension
CREATE EXTENSION IF NOT EXISTS "storage";

-- =========================================
-- CREATE STORAGE BUCKETS
-- =========================================

-- Animal profile images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('animal-profiles', 'animal-profiles', false)
ON CONFLICT (id) DO NOTHING;

-- Health record images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('health-records', 'health-records', false)
ON CONFLICT (id) DO NOTHING;

-- User avatar images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Rescue report images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('rescue-reports', 'rescue-reports', false)
ON CONFLICT (id) DO NOTHING;

-- =========================================
-- STORAGE RLS POLICIES
-- =========================================

-- Enable RLS on storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- =========================================
-- ANIMAL PROFILES BUCKET POLICIES
-- =========================================

-- Users can upload images for their own animals
CREATE POLICY "Users can upload animal profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'animal-profiles'
  AND (
    -- Extract user_id from the folder path (format: user_id/animal_id/filename)
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- Users can view their own animal images
CREATE POLICY "Users can view own animal profile images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'animal-profiles'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own animal images
CREATE POLICY "Users can delete own animal profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'animal-profiles'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =========================================
-- HEALTH RECORDS BUCKET POLICIES
-- =========================================

-- Users can upload health record images for their animals
CREATE POLICY "Users can upload health record images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'health-records'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

-- Users can view their own health record images
CREATE POLICY "Users can view own health record images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'health-records'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own health record images
CREATE POLICY "Users can delete own health record images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'health-records'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =========================================
-- USER AVATARS BUCKET POLICIES
-- =========================================

-- Users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view user avatars (public bucket)
CREATE POLICY "Anyone can view user avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-avatars');

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =========================================
-- RESCUE REPORTS BUCKET POLICIES
-- =========================================

-- Users can upload rescue report images
CREATE POLICY "Users can upload rescue report images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'rescue-reports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can view their own rescue report images
CREATE POLICY "Users can view own rescue report images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'rescue-reports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can delete their own rescue report images
CREATE POLICY "Users can delete own rescue report images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'rescue-reports'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- =========================================
-- DONE
-- =========================================
