import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// Hardcoded payment links — these are public URLs, not secrets
const PAYMENT_LINKS = {
  pro:        'https://buy.stripe.com/8x2bJ1e2ucr8cdl8rKew80p',  // $9.99
  enterprise: 'https://buy.stripe.com/aFa00je2ufDk4KTbDWew80r',  // $29.99
};

export type UserPlan = 'free' | 'pro' | 'enterprise';

interface PaymentContextType {
  isPaid: boolean;
  userPlan: UserPlan;
  hasUsedFreeDownload: boolean;
  canDownload: boolean;
  checkPaymentStatus: () => Promise<void>;
  redirectToPayment: (plan: 'pro' | 'enterprise') => void;
  markFreeDownloadUsed: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isPaid, setIsPaid] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [hasUsedFreeDownload, setHasUsedFreeDownload] = useState(false);
  const [loading, setLoading] = useState(true);

  // checkPaymentStatus is kept for manual refreshes
  const checkPaymentStatus = async () => {
    // The real-time listener below handles all updates automatically.
    // This is a no-op kept for API compatibility.
  };

  const redirectToPayment = (plan: 'pro' | 'enterprise') => {
    if (!currentUser) return;
    const link = PAYMENT_LINKS[plan];
    const url = `${link}?client_reference_id=${currentUser.uid}&prefilled_email=${encodeURIComponent(currentUser.email || '')}`;
    window.open(url, '_blank');
  };

  // Real-time Firestore listener — updates UI instantly when isPaid changes
  // (e.g. after Stripe webhook updates the doc)
  useEffect(() => {
    if (!currentUser) {
      setIsPaid(false);
      setUserPlan('free');
      const anonymousFreeUsed = localStorage.getItem('anonymous_free_download');
      setHasUsedFreeDownload(anonymousFreeUsed === 'used');
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setIsPaid(data.isPaid === true);
        setUserPlan((data.plan as UserPlan) || (data.isPaid ? 'pro' : 'free'));
        setHasUsedFreeDownload(data.hasUsedFreeDownload === true);
        localStorage.setItem(`payment_${currentUser.uid}`, data.isPaid ? 'paid' : 'unpaid');
      } else {
        // Doc doesn't exist yet — seed it
        setDoc(userDocRef, {
          email: currentUser.email,
          isPaid: false,
          hasUsedFreeDownload: false,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        setIsPaid(false);
      }
      setLoading(false);
    }, (error) => {
      console.error('Payment status listener error:', error);
      // Fallback to localStorage on permission error
      const paymentStatus = localStorage.getItem(`payment_${currentUser.uid}`);
      setIsPaid(paymentStatus === 'paid');
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // Listen for payment success (when user returns from Stripe)
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'success' && currentUser) {
        // Update Local State
        setIsPaid(true);
        
        // Update LocalStorage
        localStorage.setItem(`payment_${currentUser.uid}`, 'paid');
        
        // Update Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userDocRef, {
            isPaid: true,
            paymentDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error updating payment in Firestore:", error);
          // If update fails (e.g. doc doesn't exist), try setDoc
          const userDocRef = doc(db, 'users', currentUser.uid);
          await setDoc(userDocRef, {
            email: currentUser.email,
            isPaid: true,
            paymentDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }, { merge: true });
        }

        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handlePaymentSuccess();
  }, [currentUser]);

  const markFreeDownloadUsed = async () => {
    setHasUsedFreeDownload(true);
    
    if (currentUser) {
      localStorage.setItem(`free_download_${currentUser.uid}`, 'used');
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          hasUsedFreeDownload: true,
          updatedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error("Error marking free download in Firestore:", error);
        // Fallback to setDoc if update fails
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          hasUsedFreeDownload: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } else {
      localStorage.setItem('anonymous_free_download', 'used');
    }
  };

  const canDownload = isPaid || !hasUsedFreeDownload;

  const value = {
    isPaid,
    userPlan,
    hasUsedFreeDownload,
    canDownload,
    checkPaymentStatus,
    redirectToPayment,
    markFreeDownloadUsed,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};