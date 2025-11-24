# 🎯 Blog Admin Quick Reference

## Access Admin Panel
**Keyboard Shortcut:** `Ctrl + Shift + B`

## Default Credentials
- **Development:** `admin123`
- **Production:** Set in `VITE_ADMIN_PASSWORD`

## Security Features

### ✅ What's Protected:
- Password-required access
- Session-based authentication (expires on browser close)
- Hidden keyboard shortcut
- Environment-based password configuration
- No persistent login tokens

### ⚠️ What's NOT Protected (Intentional):
- Blog content (public by design)
- Read-only blog viewing
- Main app features

## Agent Control

### Start Agent:
1. `Ctrl + Shift + B` → Enter password
2. Click "▶️ Start Agent"
3. Agent runs every 2 hours

### Stop Agent:
1. Access admin panel
2. Click "⏸️ Pause Agent"

### Agent State:
- Persists across page reloads
- Persists across browser restarts
- Stored in `localStorage`

## Production Deployment

### Environment Variables Needed:
```env
VITE_ADMIN_PASSWORD=YourSecurePassword!
VITE_AUTO_START_BLOG_AGENT=false
VITE_GOOGLE_AI_API_KEY=your_key
```

### Deployment Steps:
1. Set environment variables in hosting platform
2. Deploy app
3. Test admin access
4. Manually start agent (if desired)

### Agent Auto-Start:
- **Default:** OFF (manual start required)
- **To enable:** Set `VITE_AUTO_START_BLOG_AGENT=true`
- **Recommended:** Keep OFF, start manually

## Common Tasks

### Generate Blog Manually:
1. Admin panel → "✨ Generate New Blog"
2. Enter topic and keywords
3. Review and publish

### Export Blogs:
1. Admin panel → "📥 Export"
2. Downloads JSON file

### Delete Blog:
1. Find blog in list
2. Click "🗑️" button
3. Confirm deletion

### Feature Blog:
1. Find blog in list
2. Click "⭐" button
3. Toggles featured status

## Monitoring

### Check Agent Status:
- Look at "Status" card in admin panel
- Check "Activity Log" for recent actions

### View Statistics:
- Total Posts
- Featured Posts
- Categories
- Average Read Time

## Troubleshooting

### Can't Access Admin:
- Verify password is correct
- Check `VITE_ADMIN_PASSWORD` is set
- Try incognito window
- Clear sessionStorage

### Agent Not Running:
- Check if started (green button)
- Verify API key is set
- Check activity log for errors
- Try "🚀 Run Now" button

### No Blogs Generated:
- Check API quota
- Verify internet connection
- Check activity log
- Test manual generation

## Security Best Practices

### DO:
- ✅ Use strong passwords (12+ chars)
- ✅ Different passwords for dev/prod
- ✅ Rotate passwords periodically
- ✅ Monitor API usage
- ✅ Export backups regularly

### DON'T:
- ❌ Share admin password
- ❌ Commit `.env.local` to git
- ❌ Use weak passwords
- ❌ Leave agent running unmonitored
- ❌ Ignore activity log errors

## Emergency Actions

### Stop Everything:
```javascript
// Browser console:
localStorage.setItem('blog_agent_active', 'false')
location.reload()
```

### Clear All Data:
```javascript
// Browser console:
localStorage.removeItem('ai_generated_blogs')
localStorage.removeItem('blog_agent_active')
sessionStorage.removeItem('blog_admin_auth')
location.reload()
```

### Force Logout:
```javascript
// Browser console:
sessionStorage.removeItem('blog_admin_auth')
location.reload()
```

## Cost Management

### Estimated Costs:
- **Per blog:** ~5,000 tokens
- **Per day (2hr interval):** ~60,000 tokens
- **Per month:** ~1.8M tokens
- **Cost:** $5-10/month

### Reduce Costs:
- Increase interval (4-6 hours)
- Pause agent when not needed
- Use manual generation only
- Monitor Google Cloud Console

## Support Contacts

### Documentation:
- `AI_BLOG_SYSTEM.md` - Full system docs
- `PRODUCTION_DEPLOYMENT.md` - Deployment guide
- `README.md` - App overview

### Quick Links:
- Google AI Studio: https://aistudio.google.com
- Firebase Console: https://console.firebase.google.com
- Stripe Dashboard: https://dashboard.stripe.com

---

**Remember:** Agent does NOT auto-start in production. You must manually start it after deployment!
