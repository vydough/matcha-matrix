-- ============================================================
-- MATCHA MATRIX — Migration: Add colour_richness dimension
-- Run this ONCE in your Supabase SQL Editor.
-- ============================================================

-- 1. Add colour_richness column to ratings table
--    -5 = very dull/muted green
--    +5 = very vivid/rich green
ALTER TABLE ratings
  ADD COLUMN IF NOT EXISTS colour_richness integer
  CHECK (colour_richness >= -5 AND colour_richness <= 5);

-- 2. Recreate cafe_averages view to include avg_colour_richness
CREATE OR REPLACE VIEW cafe_averages AS
SELECT
  cafes.id,
  cafes.name,
  cafes.suburb,
  cafes.description,
  cafes.instagram_handle,
  cafes.sticker_url,
  coalesce(avg(ratings.sweet_bitter), 0)      AS avg_sweet_bitter,
  coalesce(avg(ratings.creamy_earthy), 0)     AS avg_creative_traditional,
  coalesce(avg(ratings.colour_richness), 0)   AS avg_colour_richness,
  count(ratings.id)                           AS rating_count
FROM cafes
LEFT JOIN ratings ON cafes.id = ratings.cafe_id
GROUP BY cafes.id;
