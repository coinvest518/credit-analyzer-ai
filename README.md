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
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

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