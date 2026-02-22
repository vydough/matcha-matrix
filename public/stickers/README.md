# Sticker Images

Place your sticker PNG files in this directory.

## File Naming Convention
- `matcha-kona.png` → Matcha Kona cafe
- `hikari.png` → Hikari cafe
- `toris.png` → Tori's cafe

## How to Add a New Cafe Sticker
1. Add the PNG file here (e.g., `new-cafe.png`)
2. Use a 1:1 aspect ratio (square), minimum 100×100px, ideally 200×200px
3. PNGs with transparent backgrounds look best on the matrix
4. Update the `sticker_url` in Supabase to `/stickers/new-cafe.png`

## Placeholder Files
SVG placeholders (`.svg`) are included for development. Replace them with real PNGs before launch.
Note: The sticker_url in seed.sql uses `.png` — change it to `.svg` if you want to use the placeholders during development.
