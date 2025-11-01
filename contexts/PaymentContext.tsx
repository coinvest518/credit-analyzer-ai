import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface PaymentContextType {
  isPaid: boolean;
  checkPaymentStatus: () => void;
  redirectToPayment: () => void;
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

  const checkPaymentStatus = () => {
    if (!currentUser) {
      setIsPaid(false);
      return;
    }
    
    // Check localStorage for payment status (simple implementation)
    const paymentStatus = localStorage.getItem(`payment_${currentUser.uid}`);
    setIsPaid(paymentStatus === 'paid');
  };

  const redirectToPayment = () => {
    const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
    if (paymentLink && currentUser) {
      // Add user ID as metadata to track the payment
      const urlWithMetadata = `${paymentLink}?client_reference_id=${currentUser.uid}`;
      window.open(urlWithMetadata, '_blank');
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [currentUser]);

  // Listen for payment success (when user returns from Stripe)
  useEffect(() => {
    const handlePaymentSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('payment') === 'success' && currentUser) {
        localStorage.setItem(`payment_${currentUser.uid}`, 'paid');
        setIsPaid(true);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handlePaymentSuccess();
  }, [currentUser]);

  const value = {
    isPaid,
    checkPaymentStatus,
    redirectToPayment,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};