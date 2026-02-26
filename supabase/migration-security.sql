-- ============================================================
-- MATCHA MATRIX — Security Hardening Migration
-- Run this ONCE in your Supabase SQL Editor.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. REVOKE dangerous table operations at the ROLE level
--    (Defence in depth — RLS already blocks these via missing
--     policies, but REVOKE at the role level adds a second
--     layer so even a misconfigured policy can't allow them)
-- ────────────────────────────────────────────────────────────

-- ratings: anon may SELECT + INSERT only, never UPDATE or DELETE
REVOKE UPDATE, DELETE ON ratings FROM anon;
REVOKE UPDATE, DELETE ON ratings FROM authenticated;

-- cafes: anon may SELECT only, never modify cafe data
REVOKE INSERT, UPDATE, DELETE ON cafes FROM anon;

-- ────────────────────────────────────────────────────────────
-- 2. Verify existing RLS policies are active
--    (These should already exist from initial schema.sql,
--     but re-affirm them here for safety.)
-- ────────────────────────────────────────────────────────────

-- Ensure RLS is enabled on both tables
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- 3. FUTURE: Auth-ready RLS policies
--    When you add Supabase Auth (e.g. email/password, OAuth,
--    or anonymous sign-in), uncomment these to restrict
--    individual rating reads to the user who submitted them.
--
--    Prerequisites:
--    a) Add a user_id column:
--       ALTER TABLE ratings
--         ADD COLUMN user_id uuid DEFAULT auth.uid()
--         REFERENCES auth.users(id);
--
--    b) Drop the current open read policy:
--       DROP POLICY "Public read ratings" ON ratings;
--
--    c) Create user-scoped policies:
--       CREATE POLICY "Users read own ratings"
--         ON ratings FOR SELECT
--         USING (auth.uid() = user_id);
--
--       CREATE POLICY "Users insert own ratings"
--         ON ratings FOR INSERT
--         WITH CHECK (auth.uid() = user_id);
--
--    The cafe_averages VIEW will continue to work for all
--    users because PostgreSQL views run with the view owner's
--    permissions by default (SECURITY DEFINER behaviour),
--    which bypasses RLS on the underlying tables.
-- ────────────────────────────────────────────────────────────
