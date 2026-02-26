import { createBrowserClient } from '@supabase/ssr'
import { type Session } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Browser-side Supabase client with auth session support.
 * Automatically manages auth tokens in cookies.
 */
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

/**
 * Get the current user session.
 * Returns { session, error } — check error before using session.
 */
export async function getSession(): Promise<{ session: Session | null; error: any }> {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

/**
 * Sign in with email + password.
 * Returns { data, error }.
 */
export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}

/**
 * Sign up with email + password.
 * Returns { data, error }.
 */
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password })
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  return supabase.auth.signOut()
}

/**
 * Listen for auth state changes.
 * Returns unsubscribe function.
 */
export function onAuthStateChange(
  callback: (session: Session | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session)
  })
  return data.subscription?.unsubscribe
}
