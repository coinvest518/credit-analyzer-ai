import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

// Check if Firebase config is properly loaded
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('Firebase configuration is missing. Please check your environment variables.');
  console.log('Current config:', firebaseConfig);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and provider instances
export const auth = getAuth(app);
// autoDetectLongPolling: falls back from streaming WebChannel to long-polling
// when the streaming transport stalls (extensions, corporate proxies, etc.),
// which is what causes the "client is offline" error on otherwise-online users.
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
export const googleProvider = new GoogleAuthProvider();

// Optional: Add additional scopes if needed
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Optional: Set custom parameters
// googleProvider.setCustomParameters({
//   'login_hint': 'user@example.com'
// });
