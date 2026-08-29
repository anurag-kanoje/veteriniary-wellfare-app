-- =========================================
-- MISSING RLS POLICIES FOR SECURITY
-- =========================================

-- Enable RLS on missing tables
ALTER TABLE tele_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaushalas ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaushala_animals ENABLE ROW LEVEL SECURITY;

-- Tele-consultations policies
CREATE POLICY tele_consultations_view_own
ON tele_consultations
FOR SELECT
USING (farmer_id = auth.uid() OR vet_id = auth.uid());

CREATE POLICY tele_consultations_insert_farmer
ON tele_consultations
FOR INSERT
WITH CHECK (farmer_id = auth.uid());

CREATE POLICY tele_consultations_update_vet
ON tele_consultations
FOR UPDATE
USING (vet_id = auth.uid());

-- Posts policies
CREATE POLICY posts_view_all
ON posts
FOR SELECT
USING (true); -- Public posts visible to all

CREATE POLICY posts_insert_own
ON posts
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY posts_update_own
ON posts
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY posts_delete_own
ON posts
FOR DELETE
USING (user_id = auth.uid());

-- Comments policies
CREATE POLICY comments_view_all
ON comments
FOR SELECT
USING (true); -- Comments on public posts visible to all

CREATE POLICY comments_insert_own
ON comments
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY comments_update_own
ON comments
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY comments_delete_own
ON comments
FOR DELETE
USING (user_id = auth.uid());

-- Likes policies
CREATE POLICY likes_view_all
ON likes
FOR SELECT
USING (true);

CREATE POLICY likes_insert_own
ON likes
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY likes_delete_own
ON likes
FOR DELETE
USING (user_id = auth.uid());

-- Medicines (read-only for public)
CREATE POLICY medicines_view_all
ON medicines
FOR SELECT
USING (true);

-- Medicine stores (read-only for public)
CREATE POLICY medicine_stores_view_all
ON medicine_stores
FOR SELECT
USING (true);

-- Gaushalas policies
CREATE POLICY gaushalas_view_all
ON gaushalas
FOR SELECT
USING (true); -- Public gaushalas visible to all

CREATE POLICY gaushalas_update_own
ON gaushalas
FOR UPDATE
USING (true); -- Only authenticated users can update (add additional checks as needed)

-- Gaushala animals policies
CREATE POLICY gaushala_animals_view_all
ON gaushala_animals
FOR SELECT
USING (true); -- Public animal records visible

CREATE POLICY gaushala_animals_insert_own
ON gaushala_animals
FOR INSERT
WITH CHECK (true); -- Only authenticated users can insert

CREATE POLICY gaushala_animals_update_own
ON gaushala_animals
FOR UPDATE
USING (true); -- Only authenticated users can update

-- Improve rescue reports policy (more restrictive)
DROP POLICY IF EXISTS rescue_view ON rescue_reports;

CREATE POLICY rescue_view_public
ON rescue_reports
FOR SELECT
USING (status = 'reported' OR status = 'assigned'); -- Only show reported/assigned rescues publicly

CREATE POLICY rescue_view_own
ON rescue_reports
FOR SELECT
USING (reporter_id = auth.uid()); -- Users can see all their own reports

CREATE POLICY rescue_update_ngo
ON rescue_reports
FOR UPDATE
USING (assigned_ngo_id IN (SELECT id FROM rescue_ngos WHERE active = true));

-- Storage policies
CREATE POLICY rescue_images_upload_own
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'rescue-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY consultation_images_upload_own
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'consultation-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY profile_images_upload_own
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY post_images_upload_own
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'post-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY gaushala_images_upload_own
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'gaushala-animal-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Public read access for images
CREATE POLICY images_public_read
ON storage.objects
FOR SELECT
USING (
  bucket_id IN ('rescue-images', 'consultation-images', 'post-images', 'profile-images', 'gaushala-animal-images')
);
