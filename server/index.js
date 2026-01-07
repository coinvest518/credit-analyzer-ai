import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('API_KEY loaded:', !!process.env.TRUEPLAY_API_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: allow dev client (Vite default) and other origins you trust
const allowedOrigins = [process.env.VITE_DEV_ORIGIN || 'http://localhost:5173', process.env.VITE_DEV_ORIGIN || 'http://localhost:3000'];
app.use(cors({ origin: allowedOrigins }));

const API_BASE = 'https://api.enable3.io';
const OPERATOR_ID = process.env.VITE_TRUEPLAY_WIDGET_ID || '10494';
const API_KEY = process.env.TRUEPLAY_API_KEY || process.env.VITE_TRUEPLAY_API_KEY;

if (!API_KEY) {
  console.warn('Warning: TRUEPLAY API key not set. Set TRUEPLAY_API_KEY in .env for proxy to work.');
}

// Simple proxy for widget-related requests that require X-API-KEY
app.get('/api/trueplay/*', async (req, res) => {
  try {
    const forwardPath = req.path.replace('/api/trueplay', `/api/v1`);
    const url = new URL(`${API_BASE}${forwardPath.replace(/\/\/$/, '')}`);
    // copy query
    Object.entries(req.query).forEach(([k, v]) => url.searchParams.set(k, String(v)));

    const headers = {};
    if (API_KEY) headers['X-API-KEY'] = API_KEY;

    const resp = await fetch(url.toString(), { headers });

    res.status(resp.status);
    // copy headers (some may be unsafe to forward; keep minimal)
    resp.headers.forEach((value, key) => {
      if (!['content-encoding', 'transfer-encoding', 'content-length'].includes(key)) {
        res.setHeader(key, value);
      }
    });
    const body = await resp.text();
    res.send(body);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: 'Proxy failure' });
  }
});

// Get widget URL from integration endpoint
app.get('/api/widget-url', async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Generate or get user ID
    const userId = req.query.userId || `user-${Date.now()}`;
    
    // Get widget URL from Enable3 integration endpoint
    const integrationUrl = `https://integration.enable3.io/api/v1/integration/user/${encodeURIComponent(userId)}/widget`;
    
    const headers = { 'X-API-KEY': API_KEY };

    const resp = await fetch(integrationUrl, { headers });

    if (resp.ok) {
      const data = await resp.json();
      res.json({ widgetUrl: data.url });
    } else {
      const errorText = await resp.text();
      console.error('Enable3 API error:', resp.status, errorText);
      res.status(resp.status).json({ error: 'Failed to get widget URL', details: errorText });
    }
  } catch (err) {
    console.error('Widget URL fetch error', err);
    res.status(500).json({ error: 'Failed to fetch widget token' });
  }
});

app.listen(PORT, () => {
  console.log(`Trueplay proxy server listening on http://localhost:${PORT}`);
});
