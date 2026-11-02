// Server-only Supabase client. Uses the SECRET key, which bypasses Row Level
// Security — never import this from browser code.
import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !secretKey) {
    throw new Error(
      'Supabase server keys missing: set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SECRET_KEY in Vercel.'
    );
  }

  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
