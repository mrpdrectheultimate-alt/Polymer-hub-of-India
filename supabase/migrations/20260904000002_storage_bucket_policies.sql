-- ==============================================================================
-- POLYMERHUB SUPABASE STORAGE BUCKET RLS POLICIES
-- Run in Supabase SQL Editor to secure project-images and resumes buckets
-- ==============================================================================

-- 1. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. PROJECT-IMAGES BUCKET (Public Read, Authenticated User Upload)
DROP POLICY IF EXISTS "Public view for project images" ON storage.objects;
CREATE POLICY "Public view for project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update their own project images" ON storage.objects;
CREATE POLICY "Users can update their own project images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-images' 
    AND auth.uid() = owner
  );

DROP POLICY IF EXISTS "Users can delete their own project images" ON storage.objects;
CREATE POLICY "Users can delete their own project images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-images' 
    AND auth.uid() = owner
  );

-- 3. RESUMES BUCKET (Private: Only owner can Read & Upload)
DROP POLICY IF EXISTS "Users can read own resume" ON storage.objects;
CREATE POLICY "Users can read own resume"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'resumes' 
    AND auth.uid() = owner
  );

DROP POLICY IF EXISTS "Users can upload own resume" ON storage.objects;
CREATE POLICY "Users can upload own resume"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'resumes' 
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Users can update own resume" ON storage.objects;
CREATE POLICY "Users can update own resume"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'resumes' 
    AND auth.uid() = owner
  );

DROP POLICY IF EXISTS "Users can delete own resume" ON storage.objects;
CREATE POLICY "Users can delete own resume"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'resumes' 
    AND auth.uid() = owner
  );
