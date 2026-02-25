-- ============================================================
-- MATCHA MATRIX — Supabase SQL Schema
-- Run this in your Supabase project's SQL editor
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- TABLE: cafes
-- To add a new cafe: INSERT a row into this table.
-- sticker_url should point to /stickers/your-image.png
-- (add the PNG to public/stickers/ in the Next.js project)
-- ────────────────────────────────────────────────────────────
create table if not exists cafes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  suburb text not null,
  description text not null,
  instagram_handle text not null,
  sticker_url text not null,
  created_at timestamp default now()
);

-- ────────────────────────────────────────────────────────────
-- TABLE: ratings
-- Each row is one user's rating for a cafe.
-- sweet_bitter:     -5 (very earthy) → +5 (very creamy)   [Y-axis]
-- creamy_earthy:    -5 (very bitter) → +5 (very sweet)    [X-axis]
-- colour_richness:  -5 (dull/muted)  → +5 (vivid/rich)    [border colour]
-- ────────────────────────────────────────────────────────────
create table if not exists ratings (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid references cafes(id) on delete cascade,
  sweet_bitter integer check (sweet_bitter >= -5 and sweet_bitter <= 5),
  creamy_earthy integer check (creamy_earthy >= -5 and creamy_earthy <= 5),
  colour_richness integer check (colour_richness >= -5 and colour_richness <= 5),
  created_at timestamp default now()
);

-- ────────────────────────────────────────────────────────────
-- VIEW: cafe_averages
-- Used by the frontend to get each cafe's position on the matrix.
-- Automatically recalculates as ratings are submitted.
-- ────────────────────────────────────────────────────────────
create or replace view cafe_averages as
select
  cafes.id,
  cafes.name,
  cafes.suburb,
  cafes.description,
  cafes.instagram_handle,
  cafes.sticker_url,
  coalesce(avg(ratings.sweet_bitter), 0)    as avg_sweet_bitter,
  coalesce(avg(ratings.creamy_earthy), 0)   as avg_creative_traditional,
  coalesce(avg(ratings.colour_richness), 0) as avg_colour_richness,
  count(ratings.id) as rating_count
from cafes
left join ratings on cafes.id = ratings.cafe_id
group by cafes.id;

-- ────────────────────────────────────────────────────────────
-- RLS (Row Level Security)
-- Allow anyone to read cafes and cafe_averages (public app).
-- Allow anyone to insert ratings (anonymous voting).
-- ────────────────────────────────────────────────────────────
alter table cafes enable row level security;
alter table ratings enable row level security;

-- Anyone can read cafes
create policy "Public read cafes"
  on cafes for select
  using (true);

-- Anyone can read ratings
create policy "Public read ratings"
  on ratings for select
  using (true);

-- Anyone can submit a rating
create policy "Public insert ratings"
  on ratings for insert
  with check (true);

-- ────────────────────────────────────────────────────────────
-- REALTIME
-- Enable realtime on the ratings table so the frontend
-- receives live updates when new ratings are submitted.
-- ────────────────────────────────────────────────────────────
-- Run this in the Supabase dashboard → Database → Replication
-- OR uncomment and run here if your Supabase version supports it:
-- alter publication supabase_realtime add table ratings;
