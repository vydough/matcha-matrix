import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Single Supabase client for the whole app.
 * Uses @supabase/ssr to handle auth sessions in cookies automatically.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

/**
 * Ensure the visitor has an anonymous session.
 * Called once on app mount — invisible to the user.
 * If the browser already has a session (from a previous visit),
 * this is a no-op. Otherwise creates a new anonymous user.
 */
export async function ensureAnonymousSession() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    await supabase.auth.signInAnonymously()
  }
}

/**
 * Get the current auth session (anonymous or otherwise).
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

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
