import { createClient } from '@supabase/supabase-js';

// Browser-safe keys only. The publishable key is meant to be public —
// Row Level Security in supabase/schema.sql is what protects the data.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/** Google sign-in stays hidden until it's set up in Supabase and this is "true". */
export const isGoogleAuthEnabled = import.meta.env.VITE_ENABLE_GOOGLE_AUTH === 'true';

if (!isSupabaseConfigured) {
  console.error(
    'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in Vercel → Settings → Environment Variables, then redeploy.'
  );
}

/**
 * Snapshot of the URL's query + hash parameters taken BEFORE the Supabase client
 * starts (it removes `?code=` once it has used it). The auth provider reads this
 * to tell people what happened when they come back from an email link.
 */
function readUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const out: Record<string, string> = {};
  const url = new URL(window.location.href);
  try {
    new URLSearchParams(url.hash.replace(/^#/, '')).forEach((value, key) => { out[key] = value; });
  } catch { /* hash isn't key=value */ }
  url.searchParams.forEach((value, key) => { out[key] = value; });
  return out;
}

export const initialUrlParams = readUrlParams();

/** Auth-related keys we remove from the address bar once they've been handled. */
const AUTH_URL_KEYS = [
  'code', 'token_hash', 'type', 'auth', 'auth_flow',
  'error', 'error_code', 'error_description', 'sb',
  'access_token', 'refresh_token', 'expires_in', 'expires_at', 'token_type', 'provider_token',
];

export function cleanAuthParamsFromUrl() {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  AUTH_URL_KEYS.forEach((key) => url.searchParams.delete(key));
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
  const hashHasAuth = AUTH_URL_KEYS.some((key) => hash.has(key));
  const clean = url.pathname + (url.searchParams.toString() ? `?${url.searchParams}` : '') + (hashHasAuth ? '' : url.hash);
  window.history.replaceState(window.history.state, '', clean);
}

export const supabase = createClient(
  supabaseUrl || 'https://not-configured.supabase.co',
  supabaseKey || 'not-configured',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // finishes email-link sign-ins (same browser)
      flowType: 'pkce',
    },
  }
);
