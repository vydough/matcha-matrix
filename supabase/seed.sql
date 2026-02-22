-- ============================================================
-- MATCHA MATRIX — Seed Data
-- Run AFTER schema.sql in your Supabase SQL editor.
-- ============================================================
--
-- HOW TO ADD A NEW CAFE:
-- 1. Add a PNG sticker image to public/stickers/ in the Next.js project
-- 2. Copy one of the INSERT blocks below and fill in the details
-- 3. Run the INSERT in Supabase SQL editor (or use the Table Editor)
--
-- ============================================================

insert into cafes (name, suburb, description, instagram_handle, sticker_url) values
(
  'Matcha Kona',
  'Melbourne CBD',
  'Minimalist matcha bar with ceremonial-grade focus. Clean, precise preparation with beans sourced direct from Uji, Japan.',
  '@matchakona',
  '/stickers/matcha-kona.png'
),
(
  'Hikari',
  'Fitzroy',
  'Modern Japanese cafe blending traditional whisking with latte art. The perfect bridge between ceremony and contemporary coffee culture.',
  '@hikari.matcha',
  '/stickers/hikari.png'
),
(
  'Tori''s',
  'Brunswick',
  'Playful dessert-driven matcha with creative seasonal flavors. Think matcha soft-serve with yuzu, mochi waffles, and rotating specials.',
  '@toris.matcha',
  '/stickers/toris.png'
);

-- ============================================================
-- TEMPLATE — copy this block to add a new cafe:
-- ============================================================
-- insert into cafes (name, suburb, description, instagram_handle, sticker_url) values
-- (
--   'Cafe Name Here',
--   'Suburb Here',
--   'A short description of the cafe (1-2 sentences).',
--   '@instagramhandle',
--   '/stickers/your-filename.png'
-- );
