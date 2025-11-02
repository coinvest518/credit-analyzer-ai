import React, { useEffect } from 'react';

import BuyMeACoffeeButton from './BuyMeACoffeeButton';

export const Footer: React.FC = () => {
  useEffect(() => {
    // Load Stripe buy button script
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
    stripeScript.async = true;
    document.head.appendChild(stripeScript);

    return () => {
      // Cleanup scripts on unmount
      if (document.head.contains(stripeScript)) {
        document.head.removeChild(stripeScript);
      }
    };
  }, []);

  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 AI Credit Report Analyzer. All rights reserved.</p>
          <div className="mt-4">
            <BuyMeACoffeeButton />
          </div>
        </div>
      </div>
    </footer>
  );
};