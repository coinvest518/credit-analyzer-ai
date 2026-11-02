// api/stripe-webhook.js — Vercel serverless function
// Stripe calls this after a successful checkout and it marks the user as paid
// in Supabase (profiles.is_paid = true).
//
// Required environment variables (Vercel → Settings → Environment Variables):
//   STRIPE_WEBHOOK_SECRET  — Stripe Dashboard → Developers → Webhooks → signing secret (whsec_...)
//   SUPABASE_URL           — or VITE_SUPABASE_URL (your https://xxxx.supabase.co URL)
//   SUPABASE_SECRET_KEY    — Supabase → Project Settings → API Keys → secret key (sb_secret_...)
//
// Stripe webhook endpoint URL: https://reportdisputer.xyz/api/stripe-webhook
// Event to send: checkout.session.completed

import Stripe from 'stripe';
import { getSupabaseAdmin } from './_supabaseAdmin.js';

export const config = {
  api: {
    // Stripe needs the raw body to verify the webhook signature
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    // Signature check only needs the webhook secret — no Stripe API key required.
    event = Stripe.webhooks.constructEvent(rawBody, req.headers['stripe-signature'], webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id; // set in redirectToPayment()

    if (!userId) {
      console.warn('checkout.session.completed missing client_reference_id', session.id);
      return res.status(200).json({ received: true });
    }

    if (session.payment_status && session.payment_status !== 'paid') {
      console.log(`Session ${session.id} not paid yet (${session.payment_status}); skipping.`);
      return res.status(200).json({ received: true });
    }

    // $9.99 = 999 cents (pro), $29.99 = 2999 cents (enterprise)
    const amount = session.amount_total ?? 0;
    const plan = amount >= 2999 ? 'enterprise' : 'pro';

    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('profiles')
        .update({
          is_paid: true,
          plan,
          payment_date: new Date().toISOString(),
          stripe_session_id: session.id,
          stripe_customer_id: typeof session.customer === 'string' ? session.customer : null,
        })
        .eq('id', userId)
        .select('id');

      if (error) throw error;
      if (!data || data.length === 0) {
        // Don't return an error here — Stripe would keep retrying for days and could
        // disable the endpoint. Log it so the payment can be matched up by hand.
        console.error(`No profile found for user ${userId} (session ${session.id}) — check Stripe + Supabase manually`);
        return res.status(200).json({ received: true, warning: 'user not found' });
      }
      console.log(`User ${userId} marked as paid — plan: ${plan}`);
    } catch (err) {
      console.error(`Failed to update Supabase for user ${userId}:`, err);
      // 500 makes Stripe retry later, so a temporary outage doesn't lose the payment.
      return res.status(500).json({ error: 'Database update failed' });
    }
  }

  return res.status(200).json({ received: true });
}
