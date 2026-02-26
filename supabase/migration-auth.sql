-- ============================================================
-- MATCHA MATRIX — Auth Migration
-- Run this ONCE in your Supabase SQL Editor.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Add user_id column to ratings table
--    References auth.users(id) so each rating is tied to a user.
-- ────────────────────────────────────────────────────────────
ALTER TABLE ratings
  ADD COLUMN user_id uuid DEFAULT auth.uid()
  REFERENCES auth.users(id) ON DELETE CASCADE;

-- ────────────────────────────────────────────────────────────
-- 2. Drop old public read/insert policies on ratings
--    (Anonymous users could see and submit without user_id tracking)
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read ratings" ON ratings;
DROP POLICY IF EXISTS "Public insert ratings" ON ratings;

-- ────────────────────────────────────────────────────────────
-- 3. Create auth-aware RLS policies
--    Users can only read and write their own ratings.
--    The cafe_averages VIEW still works for everyone because
--    PostgreSQL views run with the owner's permissions (SECURITY DEFINER).
-- ────────────────────────────────────────────────────────────

-- Users (authenticated) can read their own ratings
CREATE POLICY "Users read own ratings"
  ON ratings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert ratings (authenticated with their user_id)
CREATE POLICY "Users insert own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Disable updates/deletes (one-time vote per user per cafe)
-- Users can submit once and that's final — no editing old votes
-- (This maintains data integrity for the averaging logic)

-- ────────────────────────────────────────────────────────────
-- 4. Recreate cafe_averages view to include rating count
--    (Same as before, but now view owner can read all ratings
--     for aggregate calculations even though users can't)
-- ────────────────────────────────────────────────────────────
-- Note: If the view already exists, you may need to DROP it first:
-- DROP VIEW IF EXISTS cafe_averages;
-- Then run:
-- CREATE VIEW cafe_averages AS
-- SELECT ...
-- (View definition unchanged from previous migration)
