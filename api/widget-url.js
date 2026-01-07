export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.TRUEPLAY_API_KEY || process.env.ENABLE3_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Generate or get user ID (you can use Firebase user ID or session ID)
    const userId = req.query.userId || `user-${Date.now()}`;
    
    // Get widget URL from Enable3 integration endpoint
    const integrationUrl = `https://integration.enable3.io/api/v1/integration/user/${encodeURIComponent(userId)}/widget`;
    
    const headers = {
      'X-API-KEY': apiKey
    };

    const resp = await fetch(integrationUrl, { headers });

    if (resp.ok) {
      const data = await resp.json();
      res.status(200).json({ widgetUrl: data.url });
    } else {
      const errorText = await resp.text();
      console.error('Enable3 API error:', resp.status, errorText);
      res.status(resp.status).json({ error: 'Failed to get widget URL', details: errorText });
    }
  } catch (err) {
    console.error('Widget URL fetch error', err);
    res.status(500).json({ error: 'Failed to fetch widget token' });
  }
}