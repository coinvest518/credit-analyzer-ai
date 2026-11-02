// api/delete-account.js — lets a signed-in user permanently delete their account.
// Their profile and disputes are removed automatically (ON DELETE CASCADE).
//
// Required environment variables: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SECRET_KEY

import { getSupabaseAdmin } from './_supabaseAdmin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Please sign in again.' });
  }

  try {
    const supabase = getSupabaseAdmin();

    // Confirm the token really belongs to a signed-in user — only they can delete themselves.
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(userData.user.id);
    if (deleteError) throw deleteError;

    return res.status(200).json({ deleted: true });
  } catch (err) {
    console.error('Delete account failed:', err);
    return res.status(500).json({ error: 'Could not delete your account. Please try again.' });
  }
}
