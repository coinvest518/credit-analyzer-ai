import React, { useState } from 'react';
import { LogoIcon, MenuIcon, CloseIcon } from './icons/Icons';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import BuyMeACoffeeButton from './BuyMeACoffeeButton';

interface HeaderProps {
  onSignInClick?: () => void;
  onUpgradeClick?: () => void;
  onBlogClick?: () => void;
  onHomeClick?: () => void;
  showHomeButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSignInClick, onUpgradeClick, onBlogClick, onHomeClick, showHomeButton = false }) => {
  const { currentUser, signOutUser } = useAuth();
  const { isPaid } = usePayment();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <LogoIcon className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 flex-shrink-0" />
            <h1 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-white tracking-tight truncate">
              AI Credit Report Analyzer
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {showHomeButton ? (
              <button
                onClick={onHomeClick}
                className="px-3 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                🏠 Home
              </button>
            ) : (
              <button
                onClick={onBlogClick}
                className="px-3 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Blog
              </button>
            )}
            <BuyMeACoffeeButton className="px-3 py-2 text-sm font-medium rounded-lg" />
            <button
              onClick={onUpgradeClick}
              className="px-3 py-2 text-sm font-medium bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
            >
              {currentUser && isPaid ? 'Premium' : 'Upgrade'}
            </button>
            {currentUser ? (
              <>
                <div className="flex items-center space-x-2">
                  {currentUser.photoURL && (
                    <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                  )}
                  <span className="text-gray-300 text-sm max-w-32 truncate">{currentUser.displayName || currentUser.email}</span>
                </div>
                <button
                  onClick={signOutUser}
                  className="px-3 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onSignInClick}
                className="px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700/50 pt-4">
            <div className="flex flex-col space-y-3">
              {showHomeButton ? (
                <button
                  onClick={() => {
                    onHomeClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  🏠 Home
                </button>
              ) : (
                <button
                  onClick={() => {
                    onBlogClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  📝 Blog
                </button>
              )}
              
              <div className="px-4">
                <BuyMeACoffeeButton className="w-full justify-center px-4 py-3 text-sm font-medium rounded-lg" />
              </div>
              
              <button
                onClick={() => {
                  onUpgradeClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm font-medium bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
              >
                {currentUser && isPaid ? '⭐ Premium' : '⚡ Upgrade'}
              </button>

              {currentUser ? (
                <>
                  <div className="px-4 py-2 border-t border-gray-700/50">
                    <div className="flex items-center space-x-3 mb-3">
                      {currentUser.photoURL && (
                        <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-sm font-medium truncate">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-gray-500 text-xs truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOutUser();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onSignInClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                >
                  🔐 Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};