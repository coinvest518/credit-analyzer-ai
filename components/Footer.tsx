import React, { useEffect } from 'react';

export const Footer: React.FC = () => {
  useEffect(() => {
    // Load Stripe buy button script
    const stripeScript = document.createElement('script');
    stripeScript.src = 'https://js.stripe.com/v3/buy-button.js';
    stripeScript.async = true;
    document.head.appendChild(stripeScript);

    // Load Buy Me a Coffee widget script
    const bmcScript = document.createElement('script');
    bmcScript.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
    bmcScript.setAttribute('data-name', 'BMC-Widget');
    bmcScript.setAttribute('data-cfasync', 'false');
    bmcScript.setAttribute('data-id', 'coinvest');
    bmcScript.setAttribute('data-description', 'Support me on Buy me a coffee!');
    bmcScript.setAttribute('data-message', 'Thank You for the Donations');
    bmcScript.setAttribute('data-color', '#FF5F5F');
    bmcScript.setAttribute('data-position', 'Right');
    bmcScript.setAttribute('data-x_margin', '18');
    bmcScript.setAttribute('data-y_margin', '18');
    document.head.appendChild(bmcScript);

    return () => {
      // Cleanup scripts on unmount
      if (document.head.contains(stripeScript)) {
        document.head.removeChild(stripeScript);
      }
      if (document.head.contains(bmcScript)) {
        document.head.removeChild(bmcScript);
      }
    };
  }, []);

  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/50 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-400">
          <p>&copy; 2024 AI Credit Repair Agent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};