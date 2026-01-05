import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface PaymentContextType {
  isPaid: boolean;
  hasUsedFreeDownload: boolean;
  canDownload: boolean;
  checkPaymentStatus: () => Promise<void>;
  redirectToPayment: () => void;
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
  const [hasUsedFreeDownload, setHasUsedFreeDownload] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkPaymentStatus = async () => {
    if (!currentUser) {
      setIsPaid(false);
      // Check anonymous free download usage
      const anonymousFreeUsed = localStorage.getItem('anonymous_free_download');
      setHasUsedFreeDownload(anonymousFreeUsed === 'used');
      setLoading(false);
      return;
    }
    
    try {
      // 1. Check Firestore first (Source of Truth)
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setIsPaid(data.isPaid === true);
        setHasUsedFreeDownload(data.hasUsedFreeDownload === true);
        
        // Sync to localStorage for offline/quick access
        localStorage.setItem(`payment_${currentUser.uid}`, data.isPaid ? 'paid' : 'unpaid');
        localStorage.setItem(`free_download_${currentUser.uid}`, data.hasUsedFreeDownload ? 'used' : 'unused');
      } else {
        // 2. Fallback to localStorage if doc doesn't exist yet
        const paymentStatus = localStorage.getItem(`payment_${currentUser.uid}`);
        const freeDownloadUsed = localStorage.getItem(`free_download_${currentUser.uid}`);
        
        setIsPaid(paymentStatus === 'paid');
        setHasUsedFreeDownload(freeDownloadUsed === 'used');

        // Initialize Firestore doc with local data
        await setDoc(userDocRef, {
          email: currentUser.email,
          isPaid: paymentStatus === 'paid',
          hasUsedFreeDownload: freeDownloadUsed === 'used',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error checking payment status from Firestore:", error);
      // Final fallback to localStorage on error
      const paymentStatus = localStorage.getItem(`payment_${currentUser.uid}`);
      const freeDownloadUsed = localStorage.getItem(`free_download_${currentUser.uid}`);
      setIsPaid(paymentStatus === 'paid');
      setHasUsedFreeDownload(freeDownloadUsed === 'used');
    } finally {
      setLoading(false);
    }
  };

  const redirectToPayment = () => {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (paymentLink && currentUser) {
      // Add user ID as metadata to track the payment
      // Stripe Payment Links support client_reference_id
      const urlWithMetadata = `${paymentLink}?client_reference_id=${currentUser.uid}&prefilled_email=${encodeURIComponent(currentUser.email || '')}`;
      window.open(urlWithMetadata, '_blank');
    }
  };

  useEffect(() => {
    checkPaymentStatus();
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
    hasUsedFreeDownload,
    canDownload,
    checkPaymentStatus,
    redirectToPayment,
    markFreeDownloadUsed,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};