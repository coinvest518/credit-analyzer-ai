import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type AuthView, type AuthNotice } from '../contexts/AuthContext';
import { LogoIcon } from './icons/Icons';

const RESEND_COOLDOWN_SECONDS = 60;

const inputClass =
  'w-full px-3 py-3 sm:px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 text-base';
const primaryBtn =
  'w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-wait text-base min-h-[48px]';
const linkBtn = 'text-cyan-400 hover:text-cyan-300 text-sm min-h-[44px] inline-flex items-center justify-center';

const NoticeBox: React.FC<{ notice: AuthNotice | null }> = ({ notice }) => {
  if (!notice) return null;
  const styles = {
    success: 'bg-emerald-900/40 border-emerald-700 text-emerald-200',
    error: 'bg-red-900/50 border-red-700 text-red-200',
    info: 'bg-sky-900/40 border-sky-700 text-sky-100',
  }[notice.tone];
  return (
    <div className={`border px-3 py-2 rounded-lg mb-4 text-sm ${styles}`} role={notice.tone === 'error' ? 'alert' : 'status'}>
      {notice.text}
    </div>
  );
};

const PasswordInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete: string;
  show: boolean;
}> = ({ value, onChange, placeholder, autoComplete, show }) => (
  <input
    type={show ? 'text' : 'password'}
    placeholder={placeholder}
    autoComplete={autoComplete}
    minLength={6}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={inputClass}
    required
  />
);

const Steps: React.FC<{ active: 1 | 2 | 3 | 4 }> = ({ active }) => {
  const items = ['Create account', 'Confirm email', 'Sign in & start'];
  return (
    <ol className="flex items-start justify-between gap-2 mb-5" aria-label="How sign-up works">
      {items.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const done = n < active;
        const current = n === active;
        return (
          <li key={label} className="flex-1 flex flex-col items-center text-center">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                done ? 'bg-emerald-600 text-white' : current ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}
            >
              {done ? '✓' : n}
            </span>
            <span className={`text-[11px] leading-tight ${current ? 'text-white' : 'text-gray-400'}`}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
};

/**
 * The one sign-in / sign-up window for the whole site. Open it from anywhere with
 * `openAuth('signin' | 'signup')` from useAuth().
 */
export const AuthModal: React.FC = () => {
  const {
    authModal, openAuth, closeAuth, currentUser, googleEnabled,
    signInWithGoogle, signInWithEmail, signUpWithEmail, resendConfirmation, sendPasswordReset,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { open, view } = authModal;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<AuthNotice | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [sentTo, setSentTo] = useState<string | null>(null);

  // Sync with whatever opened the modal (view, prefilled email, message).
  useEffect(() => {
    if (!open) return;
    if (authModal.email) setEmail(authModal.email);
    setNotice(authModal.notice);
    setSentTo(authModal.sent && authModal.email ? authModal.email : null);
    setPassword('');
    setConfirm('');
    setShowPassword(false);
  }, [open, view, authModal.email, authModal.notice, authModal.sent]);

  // Close automatically once signed in — except on the welcome screen.
  useEffect(() => {
    if (open && currentUser && view !== 'welcome') closeAuth();
  }, [currentUser, open, view, closeAuth]);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (!open) return null;

  const go = (next: AuthView, nextNotice: AuthNotice | null = null, sent = false) =>
    openAuth(next, { email, notice: nextNotice, sent });

  const run = async (fn: () => Promise<void>) => {
    setNotice(null);
    setBusy(true);
    try {
      await fn();
    } catch (err: any) {
      setNotice({ tone: 'error', text: err?.message || 'Something went wrong. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setBusy(true);
    signInWithEmail(email, password)
      .then(() => closeAuth())
      .catch((err: any) => {
        if (err?.code === 'email_not_confirmed') {
          go('check-email', { tone: 'error', text: err.message });
        } else {
          setNotice({ tone: 'error', text: err?.message || 'Could not sign in. Please try again.' });
        }
      })
      .finally(() => setBusy(false));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setNotice({ tone: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirm) {
      setNotice({ tone: 'error', text: "Passwords don't match." });
      return;
    }
    setNotice(null);
    setBusy(true);
    signUpWithEmail(email, password)
      .then((result) => {
        if (result === 'signed_in') {
          closeAuth();
        } else {
          setCooldown(RESEND_COOLDOWN_SECONDS);
          go('check-email', null, true);
        }
      })
      .catch((err: any) => {
        if (err?.code === 'user_already_exists') {
          go('signin', { tone: 'info', text: err.message });
        } else {
          setNotice({ tone: 'error', text: err?.message || 'Could not create your account. Please try again.' });
        }
      })
      .finally(() => setBusy(false));
  };

  const handleResend = () =>
    run(async () => {
      await resendConfirmation(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setSentTo(email.trim());
      setNotice({ tone: 'success', text: `Activation email sent to ${email.trim()}. It can take a minute to arrive.` });
    });

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    run(async () => {
      await sendPasswordReset(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setNotice({ tone: 'success', text: 'If that email has an account, a reset link is on its way. Open it on this same device. Check Spam too.' });
    });
  };

  const handleGoogle = () => run(signInWithGoogle);

  const finishWelcome = () => {
    closeAuth();
    if (location.pathname !== '/app') navigate('/app');
  };

  // ── Screens ──────────────────────────────────────────────────────────────────
  let title = '';
  let subtitle = '';
  let body: React.ReactNode = null;

  const emailField = (
    <input
      type="email"
      placeholder="Email"
      autoComplete="email"
      inputMode="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className={inputClass}
      required
    />
  );

  const showToggle = (
    <label className="flex items-center gap-2 text-sm text-gray-300 select-none">
      <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} className="w-4 h-4 accent-cyan-500" />
      Show password
    </label>
  );

  const googleButton = googleEnabled ? (
    <>
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600" /></div>
        <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-800 text-gray-400">or</span></div>
      </div>
      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        className="w-full px-4 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center text-base min-h-[48px]"
      >
        Continue with Google
      </button>
    </>
  ) : null;

  switch (view) {
    case 'signup':
      title = 'Create your account';
      subtitle = "It's free. We'll email you a link to activate your account.";
      body = (
        <>
          <Steps active={1} />
          <form onSubmit={handleSignUp} className="space-y-3">
            {emailField}
            <PasswordInput value={password} onChange={setPassword} placeholder="Password (6+ characters)" autoComplete="new-password" show={showPassword} />
            <PasswordInput value={confirm} onChange={setConfirm} placeholder="Confirm password" autoComplete="new-password" show={showPassword} />
            {showToggle}
            <button type="submit" disabled={busy} className={primaryBtn}>
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          {googleButton}
          <div className="text-center mt-4">
            <button type="button" onClick={() => go('signin')} className={linkBtn}>Already have an account? Sign in</button>
          </div>
        </>
      );
      break;

    case 'check-email': {
      title = sentTo ? 'Check your email' : 'Activate your account';
      subtitle = sentTo ? '' : 'Enter the email you signed up with and we’ll send you a new activation link.';
      body = (
        <>
          <Steps active={2} />
          {sentTo && (
            <div className="text-center mb-4">
              <div className="text-5xl mb-2" aria-hidden>📬</div>
              <p className="text-gray-200">
                We sent an activation link to <span className="font-semibold text-white break-words">{sentTo}</span>
              </p>
            </div>
          )}
          <ol className="text-sm text-gray-300 space-y-2 bg-gray-900/60 border border-gray-700 rounded-lg p-3 mb-3 list-decimal list-inside">
            <li>Open the email from ReportDisputer. <span className="text-gray-400">Not there after a minute? Check Spam or Promotions.</span></li>
            <li>Tap the <span className="text-white font-medium">confirm</span> link in that email.</li>
            <li>You’ll come back here. If you aren’t signed in automatically, sign in with your email and password.</li>
          </ol>
          <p className="text-xs text-gray-400 mb-4">Tip: open the link on this same phone or computer to be signed in automatically.</p>
          {sentTo ? (
            <div className="space-y-2">
              <button type="button" onClick={() => go('signin')} className={primaryBtn}>
                I’ve confirmed — Sign in
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={busy || cooldown > 0}
                className="w-full px-4 py-3 bg-gray-700 text-gray-100 font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-50 text-base min-h-[48px]"
              >
                {busy ? 'Sending…' : cooldown > 0 ? `Resend email in ${cooldown}s` : 'Resend activation email'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => { setEmail(''); go('signup'); }} className={linkBtn}>Wrong email? Start over</button>
              </div>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleResend(); }} className="space-y-3">
              {emailField}
              <button type="submit" disabled={busy || cooldown > 0} className={primaryBtn}>
                {busy ? 'Sending…' : cooldown > 0 ? `Send again in ${cooldown}s` : 'Send activation link'}
              </button>
              <div className="text-center">
                <button type="button" onClick={() => go('signin')} className={linkBtn}>Back to sign in</button>
              </div>
            </form>
          )}
        </>
      );
      break;
    }

    case 'forgot':
      title = 'Reset your password';
      subtitle = "Enter your email and we'll send you a link to choose a new password.";
      body = (
        <>
          <form onSubmit={handleForgot} className="space-y-3">
            {emailField}
            <button type="submit" disabled={busy || cooldown > 0} className={primaryBtn}>
              {busy ? 'Sending…' : cooldown > 0 ? `Send again in ${cooldown}s` : 'Send reset link'}
            </button>
          </form>
          <div className="text-center mt-4">
            <button type="button" onClick={() => go('signin')} className={linkBtn}>Back to sign in</button>
          </div>
        </>
      );
      break;

    case 'welcome':
      title = "You're all set!";
      subtitle = '';
      body = (
        <>
          <Steps active={4} />
          <div className="text-center mb-5">
            <div className="text-5xl mb-2" aria-hidden>🎉</div>
            <p className="text-gray-200">
              Your email is confirmed and you’re signed in
              {authModal.email ? <> as <span className="font-semibold text-white break-words">{authModal.email}</span></> : null}.
            </p>
          </div>
          <button type="button" onClick={finishWelcome} className={primaryBtn}>Start my credit analysis</button>
        </>
      );
      break;

    case 'signin':
    default:
      title = 'Sign in';
      subtitle = 'Welcome back. Sign in to analyze your report and save your disputes.';
      body = (
        <>
          <form onSubmit={handleSignIn} className="space-y-3">
            {emailField}
            <PasswordInput value={password} onChange={setPassword} placeholder="Password" autoComplete="current-password" show={showPassword} />
            <div className="flex items-center justify-between">
              {showToggle}
              <button type="button" onClick={() => go('forgot')} className="text-sm text-gray-400 hover:text-cyan-300 min-h-[44px]">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={busy} className={primaryBtn}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          {googleButton}
          <div className="text-center mt-4 flex flex-col items-center">
            <button type="button" onClick={() => go('signup')} className={linkBtn}>New here? Create a free account</button>
            <button type="button" onClick={() => go('check-email')} className="text-xs text-gray-400 hover:text-gray-200 min-h-[40px]">
              Didn’t get your activation email?
            </button>
          </div>
        </>
      );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-gray-800 border border-gray-700 rounded-t-2xl sm:rounded-xl p-5 sm:p-8 max-w-md w-full shadow-2xl max-h-[92dvh] overflow-y-auto relative">
        {view !== 'welcome' && (
          <button
            type="button"
            onClick={closeAuth}
            aria-label="Close"
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        )}
        <div className="text-center mb-4">
          <LogoIcon className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <NoticeBox notice={notice} />
        {body}
      </div>
    </div>
  );
};
