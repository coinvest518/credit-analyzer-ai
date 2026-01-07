# AI Credit Repair Agent

An intelligent credit repair application that uses AI to analyze credit reports, identify violations, and generate dispute letters automatically.

## Features

- 🤖 **AI-Powered Analysis**: Uses Mistral AI to analyze credit documents
- 🔍 **Violation Detection**: Identifies FCRA, FDCPA, and other legal violations
- 📝 **Automated Letter Generation**: Creates professional dispute letters
- 🔐 **Firebase Authentication**: Secure Google sign-in
- 💳 **Stripe Payment Integration**: Premium subscription model
- 📊 **Progress Tracking**: Step-by-step workflow management

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: Firebase Auth
- **AI**: Mistral AI API
- **Payments**: Stripe Payment Links
- **Hosting**: Ready for Vercel/Netlify deployment

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/coinvest518/credit-analyzer-ai.git
cd credit-analyzer-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Mistral AI API Key
VITE_MISTRAL_API_KEY=your_mistral_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

# Stripe Configuration
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your_payment_link
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 4. Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication → Google sign-in method
3. Add your domain to authorized domains
4. Copy configuration values to `.env.local`

### 5. Mistral AI Setup
1. Get API key from [Mistral AI Console](https://console.mistral.ai)
2. Add to `.env.local` as `VITE_MISTRAL_API_KEY`

### 6. Stripe Setup
1. Create Stripe account and payment link
2. Set success URL to: `https://yourdomain.com/?payment=success`
3. Add payment link and publishable key to `.env.local`

### 7. Run Development Server
```bash
npm run dev
```

## User Flow

1. **Free Access**: Users can explore steps 1-2 without signing in
2. **Authentication**: Required for step 3+ (Google sign-in)
3. **Payment**: Premium subscription required for AI analysis
4. **Full Access**: Complete credit repair workflow

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Set environment variables in Vercel dashboard:
   - `TRUEPLAY_API_KEY` (server-side API key for Enable3 integration)
   - All other env vars from `.env.local`
4. Deploy

The Enable3 widget will work automatically using Vercel's serverless functions.

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

Note: For Netlify, you'll need to set up serverless functions separately or use a different approach for the Enable3 API calls.

## Trueplay / Enable3 local proxy
The Trueplay/Enable3 integration requires `X-API-KEY` for backend endpoints and **server IP whitelisting** for security.

### Important: IP Whitelisting Required
Enable3 validates requests based on the **server IP address**, not the domain. You must whitelist your server IPs in the Trueplay Admin panel.

### Local Development Setup

1. **Find your public IP address:**
   ```bash
   # Windows PowerShell
   (Invoke-WebRequest -Uri "https://api.ipify.org").Content
   
   # Or visit: https://whatismyipaddress.com/
   ```

2. **Whitelist your IP in Enable3 Admin:**
   - Log in to https://app.enable3.io
   - Go to Admin Panel → Integration Settings → IP Whitelist
   - Add your public IP address
   - Wait ~5 minutes for changes to apply

3. **Add API key to `.env.local`:**

```env
TRUEPLAY_API_KEY=7f2fe04d-cdf8-4b96-9fa0-c14c0bb1e4ef
```

4. **Start both servers:**

```bash
npm run dev:all
```

### Vercel Deployment

**Important:** Vercel uses dynamic IP addresses, which makes IP whitelisting challenging. You have two options:

**Option A: Contact Enable3 Support (Recommended)**
- Request to whitelist Vercel's IP ranges or disable IP restrictions for your operator
- Vercel IPs: https://vercel.com/docs/concepts/edge-network/overview

**Option B: Use a Static IP Proxy**
- Deploy a small proxy service with a static IP (e.g., on AWS EC2, DigitalOcean, Railway)
- Whitelist that static IP in Enable3 Admin
- Point your Vercel function to call this proxy instead of Enable3 directly

### Testing

After whitelisting your IP and setting the API key:

1. Open http://localhost:3000
2. Click the "🎮 Play & Earn" button
3. Widget should load in a modal overlay

**If you get 403 errors:**
- Verify your API key is correct
- Confirm your public IP is whitelisted in Enable3 Admin
- Wait 5 minutes after adding IP to whitelist
- Check server logs for detailed error messages

Notes:
- The proxy listens on port `3001` by default
- Widget opens in a modal overlay with close button
- User IDs are automatically generated (can integrate with Firebase auth later)

## Project Structure

```
src/
├── components/          # React components
│   ├── AuthModal.tsx   # Authentication modal
│   ├── PaymentModal.tsx # Payment upgrade modal
│   ├── Header.tsx      # App header with auth status
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Firebase authentication
│   └── PaymentContext.tsx # Stripe payment handling
├── firebase.ts         # Firebase configuration
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details