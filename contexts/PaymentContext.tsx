import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

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

interface ProfileRow {
  is_paid: boolean | null;
  plan: string | null;
  has_used_free_download: boolean | null;
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
  const uid = currentUser?.uid ?? null;
  const [isPaid, setIsPaid] = useState(false);
  const [userPlan, setUserPlan] = useState<UserPlan>('free');
  const [hasUsedFreeDownload, setHasUsedFreeDownload] = useState(false);

  const applyProfile = useCallback((row: Partial<ProfileRow> | null) => {
    const paid = row?.is_paid === true;
    setIsPaid(paid);
    setUserPlan(((row?.plan as UserPlan) || (paid ? 'pro' : 'free')));
    setHasUsedFreeDownload(row?.has_used_free_download === true);
  }, []);

  /** Reads paid status from the database. Returns whether the user is paid. */
  const fetchProfile = useCallback(async (): Promise<boolean> => {
    if (!uid) return false;
    const { data, error } = await supabase
      .from('profiles')
      .select('is_paid, plan, has_used_free_download')
      .eq('id', uid)
      .maybeSingle();
    if (error) {
      console.error('Could not load payment status:', error);
      return false;
    }
    applyProfile(data);
    return data?.is_paid === true;
  }, [uid, applyProfile]);

  const checkPaymentStatus = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const redirectToPayment = (plan: 'pro' | 'enterprise') => {
    if (!currentUser) return;
    const link = PAYMENT_LINKS[plan];
    const url = `${link}?client_reference_id=${currentUser.uid}&prefilled_email=${encodeURIComponent(currentUser.email || '')}`;
    window.open(url, '_blank');
  };

  // Load status + listen live, so "Premium" appears as soon as the Stripe webhook updates the row.
  useEffect(() => {
    if (!uid) {
      applyProfile(null);
      setHasUsedFreeDownload(localStorage.getItem('anonymous_free_download') === 'used');
      return;
    }

    fetchProfile();

    const channel = supabase
      .channel(`profile-${uid}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${uid}` },
        (payload) => applyProfile(payload.new as ProfileRow)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [uid, fetchProfile, applyProfile]);

  // Returning from Stripe with ?payment=success — never trust the URL to unlock anything.
  // Only the Stripe webhook can mark someone paid; we just re-check for a short while.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') !== 'success' || !uid) return;

    params.delete('payment');
    const query = params.toString();
    window.history.replaceState({}, document.title, window.location.pathname + (query ? `?${query}` : ''));

    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      const paid = await fetchProfile();
      if (paid || attempts >= 15) clearInterval(timer);
    }, 2000);
    return () => clearInterval(timer);
  }, [uid, fetchProfile]);

  const markFreeDownloadUsed = async () => {
    setHasUsedFreeDownload(true);
    if (uid) {
      const { error } = await supabase.rpc('mark_free_download_used');
      if (error) console.error('Could not save free download usage:', error);
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
