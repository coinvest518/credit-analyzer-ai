// api/send-contact.js — Vercel serverless function
// Receives booking/contact form submissions and emails them to the site owner via Resend.
//
// Required environment variables (set in Vercel dashboard + .env.local):
//   RESEND_API_KEY   — from resend.com/api-keys
//   CONTACT_TO       — destination inbox (e.g. coinvest518@gmail.com)
//   CONTACT_FROM     — verified sender (e.g. "ReportDisputer <noreply@reportdisputer.xyz>")
//                      falls back to "onboarding@resend.dev" if unset (dev only)

import { Resend } from 'resend';

const escape = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONTACT_TO || 'coinvest518@gmail.com';
  const from = process.env.CONTACT_FROM || 'ReportDisputer <onboarding@resend.dev>';

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New booking inquiry from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escape(name)}</p>
        <p><strong>Email:</strong> ${escape(email)}</p>
        <p><strong>Phone:</strong> ${escape(phone || '—')}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escape(message)}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(502).json({ error: 'Email service failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-contact error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
