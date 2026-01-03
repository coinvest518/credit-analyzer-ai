# 🚀 Production Deployment Guide

## Security Setup

### 1. Admin Password Configuration

**Local Development:**
```env
# .env.local
VITE_ADMIN_PASSWORD=YourSecurePassword123!
```

**Production (Vercel/Netlify):**
Add environment variable in your hosting dashboard:
- Variable: `VITE_ADMIN_PASSWORD`
- Value: `YourStrongProductionPassword!`

⚠️ **IMPORTANT**: Use a strong, unique password for production!

### 2. Blog Agent Auto-Start

**Control whether the agent starts automatically on deployment:**

```env
# Set to 'true' to auto-start agent in production
VITE_AUTO_START_BLOG_AGENT=false
```

**Recommended Settings:**
- Development: `false` (manual control)
- Production: `false` (start manually after deployment)

## Deployment Steps

### Option 1: Vercel Deployment

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Set Environment Variables:**
```bash
vercel env add VITE_ADMIN_PASSWORD
# Enter your secure password when prompted

vercel env add VITE_AUTO_START_BLOG_AGENT
# Enter: false
```

3. **Deploy:**
```bash
vercel --prod
```

4. **Access Admin Panel:**
- Navigate to: `https://yourdomain.com`
- Press `Ctrl + Shift + B`
- Enter admin password
- Start blog agent manually

### Option 2: Netlify Deployment

1. **Build the project:**
```bash
npm run build
```

2. **Set Environment Variables in Netlify Dashboard:**
   - Go to: Site Settings → Environment Variables
   - Add:
     - `VITE_ADMIN_PASSWORD` = `YourSecurePassword`
     - `VITE_AUTO_START_BLOG_AGENT` = `false`
     - `VITE_MISTRAL_API_KEY` = `your_api_key`
     - (All other existing env vars)

3. **Deploy:**
   - Drag and drop `dist/` folder to Netlify
   - Or connect GitHub repo for auto-deployment

4. **Verify:**
   - Test admin access with `Ctrl + Shift + B`
   - Verify password protection works

## Security Best Practices

### 1. Password Security
- ✅ Use strong passwords (12+ characters, mixed case, numbers, symbols)
- ✅ Different password for production vs development
- ✅ Store passwords in environment variables, never in code
- ✅ Rotate passwords periodically

### 2. Access Control
- ✅ Admin panel requires password authentication
- ✅ Session expires when browser closes (sessionStorage)
- ✅ No persistent login tokens
- ✅ Hidden keyboard shortcut (`Ctrl + Shift + B`)

### 3. API Key Protection
- ✅ Mistral AI API key in environment variables
- ✅ Never commit `.env.local` to git
- ✅ Use different API keys for dev/prod
- ✅ Monitor API usage in Mistral Console

### 4. Blog Agent Safety
- ✅ Agent doesn't auto-start by default
- ✅ Requires admin authentication to control
- ✅ Activity logs for monitoring
- ✅ Manual pause/start controls

## Post-Deployment Checklist

### Immediate Actions:
- [ ] Test admin login with production password
- [ ] Verify blog agent doesn't auto-start
- [ ] Check API key is working
- [ ] Test manual blog generation
- [ ] Review activity logs

### First Week:
- [ ] Monitor API usage (Mistral Console)
- [ ] Check generated blog quality
- [ ] Adjust agent interval if needed
- [ ] Backup blog data (export JSON)

### Ongoing:
- [ ] Weekly blog quality review
- [ ] Monthly password rotation
- [ ] Monitor API costs
- [ ] Export blog backups monthly

## Agent Control in Production

### Starting the Agent:
1. Press `Ctrl + Shift + B`
2. Enter admin password
3. Click "▶️ Start Agent"
4. Monitor activity log
5. Agent will run every 2 hours (configurable)

### Stopping the Agent:
1. Access admin panel
2. Click "⏸️ Pause Agent"
3. Agent stops immediately
4. State persists across page reloads

### Agent State Persistence:
- Agent state saved in `localStorage`
- Survives page reloads
- Survives browser restarts
- Cleared only when:
  - User clears browser data
  - Admin manually pauses agent

## Monitoring & Maintenance

### Check Agent Status:
```javascript
// In browser console:
localStorage.getItem('blog_agent_active')
// Returns: 'true' or 'false'
```

### View Generated Blogs:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('ai_generated_blogs'))
```

### Clear All Data (Emergency):
```javascript
// In browser console:
localStorage.removeItem('ai_generated_blogs')
localStorage.removeItem('blog_agent_active')
sessionStorage.removeItem('blog_admin_auth')
```

## API Usage Estimates

### Per Blog Post:
- Analysis: ~1,000 tokens
- Generation: ~4,000 tokens
- **Total: ~5,000 tokens**

### Daily Usage (2-hour interval):
- 12 posts per day
- ~60,000 tokens per day
- ~1.8M tokens per month

### Cost Estimate (Mistral Large):
- Input: $1.25 per 1M tokens
- Output: $5.00 per 1M tokens
- **Estimated: $5-10 per month**

## Troubleshooting

### Agent Not Running:
1. Check admin panel activity log
2. Verify API key is set
3. Check browser console for errors
4. Ensure agent is started (green button)

### Authentication Issues:
1. Clear sessionStorage
2. Verify VITE_ADMIN_PASSWORD is set
3. Check for typos in password
4. Try incognito/private window

### No Blogs Generated:
1. Check activity log for errors
2. Verify API quota not exceeded
3. Check localStorage isn't full
4. Test manual generation first

### Agent Keeps Running After Pause:
1. Hard refresh page (Ctrl + F5)
2. Check localStorage state
3. Clear browser cache
4. Restart browser

## Environment Variables Reference

```env
# Required for Blog Admin
VITE_ADMIN_PASSWORD=YourSecurePassword123!
VITE_AUTO_START_BLOG_AGENT=false

# Required for AI Features
VITE_MISTRAL_API_KEY=your_api_key_here

# Required for Auth
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# Required for Payments
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your_link
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
```

## Support & Updates

### Getting Help:
- Check activity logs first
- Review browser console
- Test in incognito mode
- Export data before troubleshooting

### Updating the System:
1. Pause agent before updates
2. Export blog data
3. Deploy new version
4. Verify admin access
5. Restart agent if needed

---

## Quick Start Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

## Admin Access

**Keyboard Shortcut:** `Ctrl + Shift + B`

**Default Password (Dev):** `admin123`

**Production Password:** Set via `VITE_ADMIN_PASSWORD`

---

**Remember:** The agent will NOT auto-start unless you explicitly set `VITE_AUTO_START_BLOG_AGENT=true` and start it manually in the admin panel!
