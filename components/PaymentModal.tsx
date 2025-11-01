import React, { useEffect } from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { LogoIcon } from './icons/Icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Load Stripe buy button script when modal opens
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      script.async = true;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="text-center">
          <LogoIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Upgrade Required</h2>
          <p className="text-gray-400 mb-6">
            To access document analysis and generate dispute letters, upgrade to our premium plan.
          </p>
          
          <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
            <div className="text-cyan-400 font-bold text-lg mb-2">Premium Features</div>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• AI-powered credit report analysis</li>
              <li>• Custom dispute letter generation</li>
              <li>• FCRA/FDCPA violation detection</li>
              <li>• Step-by-step action plans</li>
              <li>• Progress tracking tools</li>
            </ul>
          </div>

          <div className="w-full mb-4">
            <stripe-buy-button
              buy-button-id={import.meta.env.VITE_STRIPE_BUY_BUTTON_ID}
              publishable-key={import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY}
            />
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};