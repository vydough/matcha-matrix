-- ============================================================
-- MATCHA MATRIX — Rate-Limit Migration (Anonymous Auth)
-- Run this ONCE in your Supabase SQL Editor.
--
-- Prerequisites:
--   Enable anonymous sign-ins in Supabase Dashboard:
--   Authentication → Settings → User Signups → Allow anonymous sign-ins
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Add user_id column to ratings table
--    Nullable for backward compat with existing anonymous ratings.
--    New ratings will include the anonymous user's UUID automatically.
-- ────────────────────────────────────────────────────────────
ALTER TABLE ratings ADD COLUMN IF NOT EXISTS user_id uuid;

-- ────────────────────────────────────────────────────────────
-- 2. Replace RLS policies
--    - Anyone can READ ratings (needed for realtime + aggregates)
--    - Only authenticated users (including anonymous) can INSERT
--      and must include their own user_id
-- ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Public read ratings" ON ratings;
DROP POLICY IF EXISTS "Public insert ratings" ON ratings;
DROP POLICY IF EXISTS "Users read own ratings" ON ratings;
DROP POLICY IF EXISTS "Users insert own ratings" ON ratings;
DROP POLICY IF EXISTS "Anyone can read ratings" ON ratings;
DROP POLICY IF EXISTS "Auth users insert own ratings" ON ratings;

CREATE POLICY "Anyone can read ratings"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Auth users insert own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────
-- 3. 30-day cooldown trigger
--    Prevents the same user_id from rating the same cafe_id
--    more than once within a 30-day window.
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_rating_cooldown()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM ratings
    WHERE cafe_id = NEW.cafe_id
      AND user_id = NEW.user_id
      AND created_at > NOW() - INTERVAL '30 days'
  ) THEN
    RAISE EXCEPTION 'rate_limit: You can only rate this cafe once per month.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_rating_cooldown ON ratings;
CREATE TRIGGER enforce_rating_cooldown
  BEFORE INSERT ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION check_rating_cooldown();
