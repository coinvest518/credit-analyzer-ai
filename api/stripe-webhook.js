// api/stripe-webhook.js — Vercel serverless function
// Stripe calls this endpoint after a successful checkout.
// It updates the user's Firestore doc to isPaid: true.
//
// Required environment variables (set in Vercel dashboard):
//   STRIPE_WEBHOOK_SECRET        — from Stripe Dashboard > Webhooks > signing secret
//   FIREBASE_PROJECT_ID          — your Firebase project ID
//   FIREBASE_CLIENT_EMAIL        — service account email
//   FIREBASE_PRIVATE_KEY         — service account private key (with \n escaped as \\n)

import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export const config = {
  api: {
    // Stripe needs the raw body to verify the webhook signature
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  // Handle checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const uid = session.client_reference_id; // set in redirectToPayment()

    if (!uid) {
      console.warn('checkout.session.completed missing client_reference_id');
      return res.status(200).json({ received: true });
    }

    // Determine plan from amount_total (in cents)
    // $9.99 = 999, $29.99 = 2999
    const amount = session.amount_total ?? 0;
    const plan = amount >= 2999 ? 'enterprise' : 'pro';

    try {
      await db.collection('users').doc(uid).set(
        {
          isPaid: true,
          plan,
          paymentDate: new Date().toISOString(),
          stripeSessionId: session.id,
          stripeCustomerId: session.customer ?? null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      console.log(`User ${uid} marked as paid — plan: ${plan}`);
    } catch (err) {
      console.error(`Failed to update Firestore for user ${uid}:`, err);
      return res.status(500).json({ error: 'Database update failed' });
    }
  }

  res.status(200).json({ received: true });
}
