/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_AI_API_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  readonly VITE_ENABLE_GOOGLE_AUTH?: string
  readonly VITE_STRIPE_PAYMENT_LINK: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_BUY_BUTTON_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}