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
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://consumerai.info" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors">AI Tools</a>
            <a href="https://fdwa.site" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">Consulting</a>
            <a href="https://cal.com/bookme-daniel" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-sm font-medium bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors">Book Call</a>
          </div>
          <div className="flex space-x-4">
            <a href="/terms" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms of Service</a>
            <a href="/privacy" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</a>
          </div>
          <p className="text-gray-400 text-sm">&copy; 2024 AI Credit Report Analyzer. All rights reserved.</p>
          <BuyMeACoffeeButton />
        </div>
      </div>
    </footer>
  );
};