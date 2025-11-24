import React from 'react';
import { LogoIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import BuyMeACoffeeButton from './BuyMeACoffeeButton';

interface HeaderProps {
  onSignInClick?: () => void;
  onUpgradeClick?: () => void;
  onBlogClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSignInClick, onUpgradeClick, onBlogClick }) => {
  const { currentUser, signOutUser } = useAuth();
  const { isPaid } = usePayment();

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <LogoIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 flex-shrink-0" />
          <h1 className="text-sm sm:text-xl md:text-2xl font-bold text-white tracking-tight truncate">
            AI Credit Report Analyzer
          </h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <button
            onClick={onBlogClick}
            className="px-3 py-2 text-xs sm:text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
          >
            Blog
          </button>
          <BuyMeACoffeeButton className="hidden sm:inline-flex px-3 py-2 text-xs font-medium rounded-lg" />
          <button
            onClick={onUpgradeClick}
            className="px-3 py-2 text-xs sm:text-sm font-medium bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
          >
            {currentUser && isPaid ? 'Premium' : 'Upgrade'}
          </button>
          {currentUser ? (
            <>
              <div className="hidden sm:flex items-center space-x-2">
                {currentUser.photoURL && (
                  <img src={currentUser.photoURL} alt="Profile" className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
                )}
                <span className="text-gray-300 text-sm max-w-24 truncate">{currentUser.displayName || currentUser.email}</span>
              </div>
              <button
                onClick={signOutUser}
                className="px-3 py-2 text-xs sm:text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={onSignInClick}
              className="px-3 py-2 text-xs sm:text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};