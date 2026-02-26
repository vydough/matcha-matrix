import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Cafe = {
  id: string
  name: string
  suburb: string
  description: string
  instagram_handle: string
  sticker_url: string
  avg_sweet_bitter: number
  avg_creative_traditional: number
  avg_colour_richness: number
  rating_count: number
}

export type Rating = {
  cafe_id: string
  sweet_bitter: number
  creamy_earthy: number
  colour_richness: number
  user_id?: string
}
