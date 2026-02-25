-- ============================================================
-- MATCHA MATRIX — Cafe Seed Data (Run in Supabase SQL Editor)
-- This script updates existing cafe descriptions and adds new cafes.
-- Run once. Safe to re-run (uses ON CONFLICT to skip duplicates).
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. Update existing cafe descriptions
-- ────────────────────────────────────────────────────────────
UPDATE cafes SET description = 'High matcha and hojicha quality. Small interior but very aesthetically pleasing.'
WHERE name = 'Hikari';

UPDATE cafes SET description = 'Premium artisan bakery with vintage vibe. Selected seasonal drinks but their standouts are standard matcha lattes, strawberry matchas and their seasonal Basque cheesecakes cabinet.'
WHERE name = 'Tori''s';

UPDATE cafes SET description = 'A new concept of matcha cafe where you choose your own blend! Futuristic and minimalistic interior setting that elevates the matcha cafe experience. ALSO our matcha supplier/partner!'
WHERE name = 'Matcha Mate';

UPDATE cafes SET description = 'Hand-whisked matcha drinks made to order. Their menu offers some traditional as well as creative drinks related to ube. The standard matcha latte is the highlight! Limited seating and not very photogenic.'
WHERE name = 'Matcha Kona';

-- ────────────────────────────────────────────────────────────
-- 2. Insert new cafes
-- ────────────────────────────────────────────────────────────
INSERT INTO cafes (name, suburb, description, instagram_handle, sticker_url) VALUES
  ('Sneaker Laundry Lab', 'Melbourne CBD', 'A cafe doubling as sneaker cleaning store. Love the vibes here, so friendly and welcoming. They are the forefront of creative matcha/hojicha drinks, always the first to create something outstanding.', '@sneakerlaundrylabau', '/stickers/sneaker-laundry-lab.png'),
  ('Itteki', 'South Yarra', 'Creative matcha latte drinks especially geared towards the fruity kind. Very quiet and tucked away.', '@itteki_matcha_coffee_melbourne', '/stickers/itteki.png'),
  ('Matcha Kobo', 'Melbourne CBD', 'Seasonal drink and cake selection. Beautiful indoor setting but very busy.', '@matchakobo', '/stickers/matcha-kobo.png'),
  ('OSOI', 'Brunswick', 'Unique matcha and coffee with refreshing and fruity twist on usual classics. Strawberry matcha and matcha affogato is a standout. Quiet and calm vibe for studying. Indoor/outdoor seating.', '@osoi.brunswick', '/stickers/osoi.png'),
  ('Meet Forest', 'South Yarra', 'Small cozy spot for sweetened matcha drinks and desserts. Very small interior.', '@meetforest_mel', '/stickers/meet-forest.png'),
  ('Ichigo', 'Melbourne CBD', 'Gorgeous cafe with high quality presentation for drinks and brunch food. Strawberry matcha is their standout. Interior is such a vibe with the sunlight.', '@ichigoau', '/stickers/ichigo.png'),
  ('Tami Sweet', 'Melbourne CBD', 'Vietnamese-inspired cafe with lots of unique dessert options. Well known for their matcha drinks, especially strawberry matchas.', '@tamisweet_melbourne', '/stickers/tami-sweet.png'),
  ('BaliBola', 'Melbourne CBD', 'Pink-themed adorable cafe has creative drink options with their cheesecakes. Most well known for their coconut cloud and matchamisu.', '@balibolaofficial', '/stickers/balibola.png'),
  ('Cru+', 'Hawthorn East', 'Cute cafe outside the CBD, their standout being strawberry matchas. They also have sandwiches, brownies and a cozy interior for study.', '@cruplus', '/stickers/cru+.png'),
  ('Groove', 'Abbotsford', 'Very very cozy spot, minimal and clean interior. Vietnamese-inspired take on hojicha and matcha drinks. Some pastries but not much. Conversational spot.', '@groove.mel', '/stickers/groove.png'),
  ('Lovey Patisserie', 'Melbourne CBD', 'Dessert focused cafe. Matchas known to come in a can! Known for their figurines and trinkets. Plenty of seating and photogenic areas.', '@lovey_patisserie_cafe', '/stickers/lovey-patisserie-cafe.png'),
  ('Miyama', 'Melbourne CBD', 'Blend of French and Japanese flavours. Lots of fruity drinks as well as lunch options. Matcha is okay for location but could be stronger! Cozy for studying or working with plenty of indoor seating.', '@miyamamelbourne', '/stickers/miyama.png'),
  ('Nimbo', 'Melbourne CBD', 'Retro, futuristic cafe with the most eye-catching desserts selection. Very innovative with their menu. Their matchas and hojichas are super strong and well made, worth the value.', '@hereisnimbo', '/stickers/nimbo.png')
;
