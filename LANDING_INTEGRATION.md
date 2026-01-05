# Landing Page Integration Guide

## Architecture

```
Landing Page (/) → Main App (/app)
├── New Design System (Lime/Fresh Fintech)
└── Routes to AI Workflow on CTA clicks
```

## Files Modified

### 1. **AppRouter.tsx** (NEW)
- Root routing component
- Handles `/` → Landing page
- Handles `/app` → Main AI workflow
- Fallback redirects to `/`

### 2. **index.tsx** (UPDATED)
- Changed from `<App />` to `<AppRouter />`
- Maintains auth/payment context providers
- Wraps entire app with routing

### 3. **Landing Page Components** (UPDATED)
- **HeroSection.tsx**: `navigate('/app')` on "Start Free Analysis"
- **Navbar.tsx**: `navigate('/app')` on "Log In" & "Get Started"
- **CTASection.tsx**: `navigate('/app')` on "Get Your Free Analysis"

## How It Works

1. **User lands on `/`** → Sees landing page with new lime/fintech design
2. **User clicks CTA button** → Routes to `/app`
3. **At `/app`** → Existing AI workflow loads with current dark theme
4. **Auth/Payment context** → Available across both pages

## Design System

- **Landing Page**: New lime green primary (`#84 81% 44%`), fresh light theme
- **Main App**: Keep existing dark theme (update later)
- **Colors defined in**: `cpy colors/index.css`

## Next Steps

1. Install dependencies: `npm install`
2. Run dev: `npm run dev`
3. Test routing: `/` and `/app`
4. Later: Update main app colors to match landing design

## Key Points

✅ Landing page is separate entry point
✅ CTA buttons route to `/app` workflow
✅ Auth context available on both pages
✅ No breaking changes to existing app
✅ Colors kept separate (update main app later)
