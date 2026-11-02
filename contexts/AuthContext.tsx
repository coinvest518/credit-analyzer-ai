import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PasswordResetModal } from '../components/PasswordResetModal';

/** The signed-in user, in the shape the rest of the app already uses. */
export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    provider: string; // 'email' | 'google'
}

interface AuthContextType {
    currentUser: AppUser | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    /** Resolves with needsConfirmation=true when the user must click the link in their email first. */
    signUpWithEmail: (email: string, password: string) => Promise<{ needsConfirmation: boolean }>;
    signOutUser: () => Promise<void>;
    updateUserProfile: (displayName: string) => Promise<void>;
    sendPasswordReset: (email?: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

function toAppUser(user: User | null | undefined): AppUser | null {
    if (!user) return null;
    const meta = user.user_metadata ?? {};
    return {
        uid: user.id,
        email: user.email ?? null,
        displayName: meta.full_name ?? meta.name ?? null,
        photoURL: meta.avatar_url ?? meta.picture ?? null,
        provider: user.app_metadata?.provider ?? 'email',
    };
}

/** Turn Supabase's error text into something a normal person understands. */
function friendlyError(error: { message?: string } | null | undefined): Error {
    const msg = error?.message ?? 'Something went wrong. Please try again.';
    const lower = msg.toLowerCase();
    if (!isSupabaseConfigured) return new Error('Sign-in is not set up yet. Please try again later.');
    if (lower.includes('invalid login credentials')) return new Error('Wrong email or password.');
    if (lower.includes('email not confirmed')) return new Error('Please confirm your email first. Check your inbox (and spam) for the link.');
    if (lower.includes('already registered')) return new Error('An account with this email already exists. Try signing in instead.');
    if (lower.includes('password should be')) return new Error('Password must be at least 6 characters.');
    if (lower.includes('rate limit')) return new Error('Too many attempts. Please wait a few minutes and try again.');
    if (lower.includes('provider is not enabled')) return new Error('Google sign-in is not turned on yet. Please use email and password for now.');
    return new Error(msg);
}

/** Where Supabase should send people back to after Google / email links. */
const redirectUrl = () => `${window.location.origin}/app`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setCurrentUser(toAppUser(data.session?.user));
            setInitializing(false);
        }).catch(() => {
            if (mounted) setInitializing(false);
        });

        // Keep this callback synchronous — no awaited Supabase calls inside it.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setCurrentUser(toAppUser(session?.user));
            if (event === 'PASSWORD_RECOVERY') setShowPasswordReset(true);
            setInitializing(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = useCallback(async () => {
        setAuthLoading(true);
        // Full-page redirect to Google — no popups to get blocked.
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrl() },
        });
        if (error) {
            setAuthLoading(false);
            throw friendlyError(error);
        }
    }, []);

    const signInWithEmail = useCallback(async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
            if (error) throw friendlyError(error);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const signUpWithEmail = useCallback(async (email: string, password: string) => {
        setAuthLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: { emailRedirectTo: redirectUrl() },
            });
            if (error) throw friendlyError(error);
            // When "Confirm email" is on in Supabase, there's no session until they click the link.
            return { needsConfirmation: !data.session };
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const signOutUser = useCallback(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error);
        setCurrentUser(null);
    }, []);

    const updateUserProfile = useCallback(async (displayName: string) => {
        const { data, error } = await supabase.auth.updateUser({ data: { full_name: displayName } });
        if (error) throw friendlyError(error);
        setCurrentUser(toAppUser(data.user));
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ display_name: displayName })
                .eq('id', data.user.id);
            if (profileError) console.error('Could not update profile name:', profileError);
        }
    }, []);

    const sendPasswordReset = useCallback(async (email?: string) => {
        const target = (email ?? currentUser?.email ?? '').trim();
        if (!target) throw new Error('Enter your email address first.');
        const { error } = await supabase.auth.resetPasswordForEmail(target, { redirectTo: redirectUrl() });
        if (error) throw friendlyError(error);
    }, [currentUser]);

    const updatePassword = useCallback(async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw friendlyError(error);
    }, []);

    const deleteAccount = useCallback(async () => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Please sign in again before deleting your account.');

        const res = await fetch('/api/delete-account', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error || 'Could not delete your account. Please try again.');
        }
        await supabase.auth.signOut();
        setCurrentUser(null);
    }, []);

    const value: AuthContextType = {
        currentUser,
        loading: authLoading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        updateUserProfile,
        sendPasswordReset,
        updatePassword,
        deleteAccount,
    };

    return (
        <AuthContext.Provider value={value}>
            {!initializing && children}
            <PasswordResetModal isOpen={showPasswordReset} onClose={() => setShowPasswordReset(false)} />
        </AuthContext.Provider>
    );
};
