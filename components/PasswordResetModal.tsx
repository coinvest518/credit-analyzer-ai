import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogoIcon } from './icons/Icons';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Shown automatically when someone opens the "reset your password" link from their email. */
export const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setSaving(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-3 sm:px-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 text-sm sm:text-base';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-4 sm:mb-6">
          <LogoIcon className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {done ? 'Password updated' : 'Choose a new password'}
          </h2>
        </div>

        {done ? (
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 min-h-[44px]"
          >
            Continue
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-3 py-2 rounded-lg text-sm">{error}</div>
            )}
            <input
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
              required
            />
            <button
              type="submit"
              disabled={saving}
              className="w-full px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-500 disabled:opacity-50 min-h-[44px]"
            >
              {saving ? 'Saving...' : 'Save new password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
