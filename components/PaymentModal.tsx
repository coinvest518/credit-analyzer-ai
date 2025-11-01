import React from 'react';
import { usePayment } from '../contexts/PaymentContext';
import { LogoIcon } from './icons/Icons';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { redirectToPayment } = usePayment();

  if (!isOpen) return null;

  const handleUpgrade = () => {
    redirectToPayment();
    onClose();
  };

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

          <button
            onClick={handleUpgrade}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 mb-4"
          >
            Upgrade Now
          </button>
          
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