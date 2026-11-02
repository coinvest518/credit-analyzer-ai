import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { isAuthRetryableFetchError, type User } from '@supabase/supabase-js';
import {
    supabase,
    isSupabaseConfigured,
    isGoogleAuthEnabled,
    initialUrlParams,
    cleanAuthParamsFromUrl,
} from '../lib/supabase';
import { PasswordResetModal } from '../components/PasswordResetModal';

/** The signed-in user, in the shape the rest of the app already uses. */
export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    provider: string; // 'email' | 'google'
}

/** Which screen of the sign-in modal is showing. */
export type AuthView = 'signin' | 'signup' | 'check-email' | 'forgot' | 'welcome';

export interface AuthNotice {
    tone: 'success' | 'error' | 'info';
    text: string;
}

export interface AuthModalState {
    open: boolean;
    view: AuthView;
    email: string;
    notice: AuthNotice | null;
    /** check-email screen: true when we just sent an activation email to `email`. */
    sent: boolean;
}

export interface OpenAuthOptions {
    email?: string;
    notice?: AuthNotice | null;
    sent?: boolean;
}

export type SignUpResult = 'needs_confirmation' | 'signed_in';

/** An error with a Supabase error code attached, so the modal can react to it. */
export class AuthFlowError extends Error {
    code?: string;
    constructor(message: string, code?: string) {
        super(message);
        this.code = code;
    }
}

interface AuthContextType {
    currentUser: AppUser | null;
    loading: boolean;
    googleEnabled: boolean;
    // modal control
    authModal: AuthModalState;
    openAuth: (view?: AuthView, opts?: OpenAuthOptions) => void;
    closeAuth: () => void;
    // actions
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<SignUpResult>;
    resendConfirmation: (email: string) => Promise<void>;
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

/** Turn Supabase errors into plain-English messages, keyed on error.code (not the English text). */
export function friendlyError(error: { message?: string; code?: string; status?: number } | null | undefined): AuthFlowError {
    const code = error?.code;
    const msg = error?.message ?? '';
    if (!isSupabaseConfigured) return new AuthFlowError('Sign-in is not set up yet. Please try again later.', 'not_configured');

    switch (code) {
        case 'invalid_credentials':
            return new AuthFlowError('Wrong email or password.', code);
        case 'email_not_confirmed':
            return new AuthFlowError("Your email isn't confirmed yet. Click the link we emailed you, or send a new one below.", code);
        case 'user_already_exists':
        case 'email_exists':
            return new AuthFlowError('An account with this email already exists. Sign in instead.', code);
        case 'weak_password':
            return new AuthFlowError('That password is too weak. Use at least 6 characters — mixing letters and numbers helps.', code);
        case 'over_email_send_rate_limit':
            return new AuthFlowError("We've sent too many emails in a short time. Please wait a few minutes and try again.", code);
        case 'over_request_rate_limit':
            return new AuthFlowError('Too many attempts. Please wait a minute and try again.', code);
        case 'email_address_invalid':
            return new AuthFlowError("That email address doesn't look right. Please check it.", code);
        case 'email_address_not_authorized':
            console.error('Supabase refused to email this address. Set up custom SMTP (e.g. Resend) in Supabase → Authentication → Emails.');
            return new AuthFlowError("We couldn't send an email to this address right now. Please try again later or contact support.", code);
        case 'signup_disabled':
        case 'email_provider_disabled':
            return new AuthFlowError('New sign-ups are paused right now. Please try again later.', code);
        case 'otp_expired':
        case 'flow_state_expired':
        case 'flow_state_not_found':
        case 'bad_code_verifier':
            return new AuthFlowError('That link has expired or was already used.', code);
        case 'same_password':
            return new AuthFlowError('Your new password must be different from your old one.', code);
        case 'provider_disabled':
            return new AuthFlowError('Google sign-in is not available yet. Please use email and password.', code);
    }
    if (isAuthRetryableFetchError(error) || /failed to fetch|network/i.test(msg)) {
        return new AuthFlowError("Can't reach the server. Check your internet connection and try again.", 'network');
    }
    return new AuthFlowError(msg || 'Something went wrong. Please try again.', code);
}

/** Where Supabase sends people back to after email links. The flow tag lets us show the right message. */
const redirectUrl = (flow: 'signup' | 'recovery' | 'oauth') => `${window.location.origin}/app?auth_flow=${flow}`;

// Remembered on this device so we can greet people correctly when they return from an email link.
const PENDING_FLOW_KEY = 'rd_auth_pending_flow';
const PENDING_EMAIL_KEY = 'rd_auth_pending_email';
const safeStorage = {
    get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
    del: (k: string) => { try { localStorage.removeItem(k); } catch { /* private mode */ } },
};

const CLOSED_MODAL: AuthModalState = { open: false, view: 'signin', email: '', notice: null, sent: false };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
    const [initializing, setInitializing] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [authModal, setAuthModal] = useState<AuthModalState>(CLOSED_MODAL);
    const recoveryRef = useRef(false);

    const openAuth = useCallback((view: AuthView = 'signin', opts?: OpenAuthOptions) => {
        setAuthModal((prev) => ({
            open: true,
            view,
            email: opts?.email ?? prev.email ?? '',
            notice: opts?.notice ?? null,
            sent: opts?.sent ?? false,
        }));
    }, []);

    const closeAuth = useCallback(() => setAuthModal((prev) => ({ ...prev, open: false, notice: null })), []);

    // ── Session tracking ───────────────────────────────────────────────────────
    useEffect(() => {
        // Keep this callback synchronous — no awaited Supabase calls inside it.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setCurrentUser(toAppUser(session?.user));
            if (event === 'PASSWORD_RECOVERY') {
                recoveryRef.current = true;
                setAuthModal(CLOSED_MODAL);
                setShowPasswordReset(true);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    // ── First load: restore session, then explain any email link the user just used ──
    useEffect(() => {
        let cancelled = false;
        const p = initialUrlParams;
        const flowFromUrl = p.auth_flow;
        const flowFromDevice = safeStorage.get(PENDING_FLOW_KEY);
        const flow = flowFromUrl || flowFromDevice || '';
        const rememberedEmail = safeStorage.get(PENDING_EMAIL_KEY) || '';

        // Never leave people staring at a blank page if the network is slow.
        const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000));

        (async () => {
            const result = await Promise.race([supabase.auth.getSession(), timeout]);
            if (cancelled) return;
            let session = result && 'data' in result ? result.data.session : null;
            setCurrentUser(toAppUser(session?.user));
            setInitializing(false);

            const hasLinkError = Boolean(p.error || p.error_code || p.error_description);
            const hasTokenHash = Boolean(p.token_hash && p.type);
            const hasCode = Boolean(p.code);
            const authParam = p.auth; // ?auth=true | signin | signup from landing-page buttons

            if (!hasLinkError && !hasTokenHash && !hasCode && !authParam && !flowFromUrl) return;

            // 1) Link came back with an error (usually expired or already used).
            if (hasLinkError) {
                const expired = /expired|invalid|used/i.test(`${p.error_code} ${p.error_description}`);
                const reason = expired ? 'That link has expired or was already used.' : (p.error_description || 'That link did not work.');
                if (flow === 'recovery') {
                    openAuth('forgot', { email: rememberedEmail, notice: { tone: 'error', text: `${reason} Enter your email and we'll send a new reset link.` } });
                } else {
                    openAuth('check-email', { email: rememberedEmail, notice: { tone: 'error', text: `${reason} If you already confirmed your email, just sign in. Otherwise send yourself a new link.` } });
                }
            }
            // 2) Email template that uses token_hash (works on any device).
            else if (hasTokenHash) {
                const { data, error } = await supabase.auth.verifyOtp({ token_hash: p.token_hash, type: p.type as any });
                if (cancelled) return;
                if (error) {
                    const f = friendlyError(error);
                    if (p.type === 'recovery') openAuth('forgot', { email: rememberedEmail, notice: { tone: 'error', text: `${f.message} Enter your email to get a new reset link.` } });
                    else openAuth('check-email', { email: rememberedEmail, notice: { tone: 'error', text: `${f.message} If you already confirmed, just sign in. Otherwise send yourself a new link.` } });
                } else if (p.type !== 'recovery') {
                    session = data.session;
                    safeStorage.del(PENDING_FLOW_KEY);
                    safeStorage.del(PENDING_EMAIL_KEY);
                    openAuth('welcome', { email: data.user?.email ?? '' });
                }
            }
            // 3) Default email template under PKCE: we land on ?code=...
            else if (hasCode) {
                if (session) {
                    // Same browser: Supabase already signed them in.
                    if (flow === 'recovery' || recoveryRef.current) {
                        setShowPasswordReset(true);
                    } else {
                        openAuth('welcome', { email: session.user.email ?? '' });
                    }
                } else if (flow === 'recovery') {
                    openAuth('forgot', {
                        email: rememberedEmail,
                        notice: { tone: 'info', text: 'Open the reset link on the same phone or computer where you asked for it — or send a new link here.' },
                    });
                } else {
                    // Different browser/device: the email IS confirmed, they just need to sign in.
                    openAuth('signin', {
                        email: rememberedEmail,
                        notice: { tone: 'success', text: 'Your email is confirmed! Sign in with your email and password to get started.' },
                    });
                }
                if (flow !== 'recovery') {
                    safeStorage.del(PENDING_FLOW_KEY);
                    safeStorage.del(PENDING_EMAIL_KEY);
                }
            }
            // 4) Landing-page buttons: /app?auth=signup or /app?auth=true
            else if (authParam && !session) {
                openAuth(authParam === 'signup' ? 'signup' : 'signin');
            }

            cleanAuthParamsFromUrl();
        })();

        return () => { cancelled = true; };
    }, [openAuth]);

    // ── Actions ────────────────────────────────────────────────────────────────
    const signInWithGoogle = useCallback(async () => {
        if (!isGoogleAuthEnabled) throw new AuthFlowError('Google sign-in is not available yet. Please use email and password.');
        setAuthLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrl('oauth') },
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
            safeStorage.del(PENDING_FLOW_KEY);
            safeStorage.del(PENDING_EMAIL_KEY);
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const signUpWithEmail = useCallback(async (email: string, password: string): Promise<SignUpResult> => {
        setAuthLoading(true);
        try {
            const cleanEmail = email.trim();
            const { data, error } = await supabase.auth.signUp({
                email: cleanEmail,
                password,
                options: { emailRedirectTo: redirectUrl('signup') },
            });
            if (error) throw friendlyError(error);
            // Supabase hides whether an email is taken: a confirmed account comes back
            // as a user with no identities and no email is sent.
            if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
                throw new AuthFlowError('An account with this email already exists. Sign in instead, or reset your password if you forgot it.', 'user_already_exists');
            }
            if (data.session) return 'signed_in'; // "Confirm email" is turned off in Supabase
            safeStorage.set(PENDING_FLOW_KEY, 'signup');
            safeStorage.set(PENDING_EMAIL_KEY, cleanEmail);
            return 'needs_confirmation';
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const resendConfirmation = useCallback(async (email: string) => {
        const cleanEmail = email.trim();
        if (!cleanEmail) throw new AuthFlowError('Enter your email address first.');
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: cleanEmail,
            options: { emailRedirectTo: redirectUrl('signup') },
        });
        if (error) throw friendlyError(error);
        safeStorage.set(PENDING_FLOW_KEY, 'signup');
        safeStorage.set(PENDING_EMAIL_KEY, cleanEmail);
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
        if (!target) throw new AuthFlowError('Enter your email address first.');
        const { error } = await supabase.auth.resetPasswordForEmail(target, { redirectTo: redirectUrl('recovery') });
        if (error) throw friendlyError(error);
        safeStorage.set(PENDING_FLOW_KEY, 'recovery');
        safeStorage.set(PENDING_EMAIL_KEY, target);
    }, [currentUser]);

    const updatePassword = useCallback(async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw friendlyError(error);
        recoveryRef.current = false;
        safeStorage.del(PENDING_FLOW_KEY);
        safeStorage.del(PENDING_EMAIL_KEY);
    }, []);

    const deleteAccount = useCallback(async () => {
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new AuthFlowError('Please sign in again before deleting your account.');

        const res = await fetch('/api/delete-account', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new AuthFlowError(body.error || 'Could not delete your account. Please try again.');
        }
        // The server already ended every session; just clear this browser's copy.
        await supabase.auth.signOut({ scope: 'local' });
        setCurrentUser(null);
    }, []);

    const value: AuthContextType = {
        currentUser,
        loading: authLoading,
        googleEnabled: isGoogleAuthEnabled,
        authModal,
        openAuth,
        closeAuth,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resendConfirmation,
        signOutUser,
        updateUserProfile,
        sendPasswordReset,
        updatePassword,
        deleteAccount,
    };

    return (
        <AuthContext.Provider value={value}>
            {initializing ? (
                <div className="min-h-screen bg-background" aria-busy="true" />
            ) : (
                children
            )}
            <PasswordResetModal isOpen={showPasswordReset} onClose={() => setShowPasswordReset(false)} />
        </AuthContext.Provider>
    );
};
