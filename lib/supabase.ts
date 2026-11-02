import { createClient } from '@supabase/supabase-js';

// Browser-safe keys only. The publishable key is meant to be public —
// Row Level Security in supabase/schema.sql is what protects the data.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel → Settings → Environment Variables, then redeploy.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://not-configured.supabase.co',
  supabaseKey || 'not-configured',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // finishes Google sign-in + password-reset links
      flowType: 'pkce',
    },
  }
);
