import React from 'react';

interface BuyMeACoffeeButtonProps {
  className?: string;
}

const BuyMeACoffeeButton: React.FC<BuyMeACoffeeButtonProps> = ({ className }) => {
  const username = 'coinvest';
  const url = `https://www.buymeacoffee.com/${username}/extras`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center bg-[#FF5F5F] text-white transition-colors hover:bg-opacity-90 ${className || 'px-4 py-2 rounded-lg font-semibold'}`}
    >
      <span className="mr-2">🛒</span>
      <span className="hidden sm:inline">Credit Repair Products</span>
      <span className="sm:hidden">🛒</span>
    </a>
  );
};

export default BuyMeACoffeeButton;
