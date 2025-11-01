
import React from 'react';
import { LogoIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';

interface HeaderProps {
  onSignInClick?: () => void;
  onUpgradeClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignInClick, onUpgradeClick }) => {
  const { currentUser, signOutUser } = useAuth();
  const { isPaid } = usePayment();

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <LogoIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            AI Credit Repair Agent
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onUpgradeClick}
            className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-500 text-white rounded transition-colors"
          >
            {currentUser && isPaid ? 'Premium' : 'Upgrade'}
          </button>
          {currentUser ? (
            <>
              <div className="flex items-center space-x-2">
                {currentUser.photoURL && (
                  <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                )}
                <span className="text-gray-300 text-sm">{currentUser.displayName || currentUser.email}</span>
              </div>
              <button
                onClick={signOutUser}
                className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={onSignInClick}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};